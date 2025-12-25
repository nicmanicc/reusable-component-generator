import { z } from "zod";

const requiredText = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string().trim().min(1, "Required")
);

const emailField = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.email("Invalid email").trim()
);

const passwordField = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string().min(8, "Password must be at least 8 characters")
);

const loginPasswordField = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string().min(1, "Required")
);

export const LoginInputSchema = z.object({
  email: emailField,
  password: loginPasswordField,
});

export const SignupInputSchema = z.object({
  name: requiredText,
  email: emailField,
  password: passwordField,
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type SignupInput = z.infer<typeof SignupInputSchema>;
