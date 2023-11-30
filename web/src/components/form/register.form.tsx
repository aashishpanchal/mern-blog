import React from "react";
import { Button } from "../ui/button";
import { TextField } from "../text-field";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas/auth";
import { yupResolver } from "@hookform/resolvers/yup";
// icons
import {
  LuKey as Lock,
  LuUser as User,
  LuMail as Email,
  LuArrowRight as ArrowRight,
} from "react-icons/lu";
import Loading from "../loading";

export default function RegisterForm() {
  const [loading, setLoading] = React.useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: yupResolver(RegisterSchema),
  });

  async function onSubmit(data: RegisterSchema) {
    try {
      setLoading(true);
      console.log(data);
    } catch (error) {
    } finally {
      reset({ password: "" });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <TextField
        {...register("email")}
        type="email"
        placeholder="Email"
        left={<Email size={20} />}
        error={errors.email?.message}
      />
      <TextField
        {...register("fullname")}
        placeholder="Full Name"
        left={<User size={20} />}
        error={errors.fullname?.message}
      />
      <TextField
        {...register("password")}
        type="password"
        placeholder="Password"
        left={<Lock size={20} />}
        error={errors.password?.message}
      />
      <Button type="submit" className="mt-3" disabled={loading}>
        Create Account{" "}
        {loading ? <Loading /> : <ArrowRight className="ml-2" size={16} />}
      </Button>
    </form>
  );
}
