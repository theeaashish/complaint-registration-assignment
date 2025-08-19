"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ActionResponse,
  LoginSchema,
  RegisterSchema,
  RegisterSchemaType,
} from "@/lib/zodSchemas";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchemaType } from "@/lib/zodSchemas";
import { loginAction, registerAction } from "@/lib/actions/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
const RegisterPage = () => {
  const [registerStatus, setRegisterStatus] = useState<ActionResponse>({
    success: false,
    message: "",
  });
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result && !result.success) {
        setRegisterStatus(result);
      }
    });
  };
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit(formData);
          }}
        >
          <CardHeader className="text-center">
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Join Complaint Central today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            {registerStatus?.message && !registerStatus.success && (
              <Alert variant="destructive">
                <AlertTitle>Register Failed</AlertTitle>
                <AlertDescription>{registerStatus.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                className="border border-zinc-400"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="border border-zinc-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="border border-zinc-400"
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
