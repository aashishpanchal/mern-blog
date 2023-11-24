import * as z from "zod";

// signup schema
export type SignupSchema = z.infer<typeof SignupSchema>;

export const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  fullname: z.string().optional(),
});

// signin schema
export type SigninSchema = z.infer<typeof SigninSchema>;

export const SigninSchema = z.object({
  username: z.string({}),
  password: z.string(),
});

export type EmailVerificationSchema = z.infer<typeof EmailVerificationSchema>;

export const EmailVerificationSchema = SignupSchema.pick({
  email: true,
}).extend({
  totp: z.string().min(6),
  secret: z.string(),
});
