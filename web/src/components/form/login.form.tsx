import React from "react";
import { Button } from "../ui/button";
import { TextField } from "../text-field";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// icons
import {
  LuKey as Lock,
  LuMail as Email,
  LuArrowRight as ArrowRight,
} from "react-icons/lu";
import Loading from "../loading";
import authApi from "@/apis/auth.api";
import { toast } from "react-hot-toast";
import { LoginSchema } from "@/schemas/auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/app/features/auth.slice";

export default function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: yupResolver(LoginSchema),
  });

  async function onSubmit(schema: LoginSchema) {
    setLoading(true);
    try {
      const {
        data: { message, data },
      } = await authApi.login(schema);
      toast.success(message);
      dispatch(setAuth(data.user));
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      reset({ password: "" });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <TextField
        {...register("username")}
        type="text"
        placeholder="username and email"
        left={<Email size={20} />}
        error={errors.username?.message}
      />
      <TextField
        {...register("password")}
        type="password"
        placeholder="Password"
        left={<Lock size={20} />}
        error={errors.password?.message}
      />
      <Button type="submit" className="mt-3" disabled={loading}>
        Get started{" "}
        {loading ? <Loading /> : <ArrowRight className="ml-2" size={16} />}
      </Button>
    </form>
  );
}
