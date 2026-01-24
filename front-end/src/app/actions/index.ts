"use client";

import { api } from "@/lib/axios";
import { loginSchema, signupSchema, updateSchema } from "@/schemas";
import { z } from "zod";

async function register (values: z.infer<typeof signupSchema>) {
  const result = signupSchema.safeParse(values);

  if (!result.success) {
    return { status: "error", message: result.error.message };
  }

  await api.post("/auth/register", {
    name: values.name,
    email: values.email,
    password: values.password,
  }); 

  return { 
    status: "success", 
    message: "User created successfully",
  };
}

async function login (values: z.infer<typeof loginSchema>) {
  try {
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      return { status: "error", message: result.error.message };
    }

    await api.post("/auth/login", {
      email: values.email,
      password: values.password,
    }, { withCredentials: true }); 

    return { status: "success", message: "Login successfully", email: values.email };
  } catch(err: any) {
    console.log(err);
    return { status: "error", message: err.response?.data?.error || "Something went wrong", };
  }
}

async function updateProfile (values: z.infer<typeof updateSchema>) {
  
}

export { register, login, updateProfile };