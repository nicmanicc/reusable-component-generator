"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSupabaseAuthErrorCode } from "@/lib/auth/errors";
import {
  LoginInputSchema,
  SignupInputSchema,
  LoginInput,
  SignupInput,
} from "@/lib/auth/schemas";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const parsed = LoginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: { code: "ParseError" } };
  }

  const data: LoginInput = parsed.data;
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: { code: getSupabaseAuthErrorCode(error) } };
  }

  return { error: { code: null } };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const parsed = SignupInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: { code: "ParseError" } };
  }

  const { name, email, password } = parsed.data as SignupInput;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { error: { code: getSupabaseAuthErrorCode(error) } };
  }
  return { error: { code: null } };
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}
