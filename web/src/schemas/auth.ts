import * as yup from "yup";

export type LoginSchema = yup.InferType<typeof LoginSchema>;

export const LoginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export type RegisterSchema = yup.InferType<typeof RegisterSchema>;

export const RegisterSchema = yup.object({
  fullname: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});
