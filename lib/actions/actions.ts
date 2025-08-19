"use server";

import { login, register } from "../auth";

export async function loginAction(formData: FormData) {
  return login(formData);
}

export async function registerAction(formData: FormData) {
    return register(formData);
}
