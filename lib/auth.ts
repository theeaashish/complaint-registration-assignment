"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginSchema, RegisterSchema } from "./zodSchemas";
import { connectToDB } from "./db";
import User from "@/models/user";
import { z } from "zod";

const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error("AUTH_SECRET is not defined");
}

const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await connectToDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return {
        success: false,
        message: "User not found.",
        errors: { email: ["User not found."] },
      };
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid Credentials.",
      };
    }

    const session = {
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    const sessionCookie = await encrypt(session);
    (await cookies()).set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expires),
      path: "/",
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred during login." };
  }

  return redirect("/");
}

export async function register(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Invalid form data.",
      errors: flattened.fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await connectToDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists.",
      };
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during registration.",
    };
  }

  return await login(formData);
}
