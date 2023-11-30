import Divider from "@/components/divider";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/form";
import { DivMotion } from "@/components/animation";
import Logo from "@/assets/logo.png";

export default function Register() {
  return (
    <main className="flex items-center justify-center h-cover">
      <DivMotion className="space-y-4 bg-white shadow-lg px-4 py-6 rounded-xl w-full max-w-[350px]">
        <img src={Logo} alt="Logo" width={56} height={56} className="m-auto" />
        <h1 className="items-center text-3xl text-center capitalize font-semibold">
          Create Account
        </h1>
        <RegisterForm />
        <Divider middle="or" />
        <Button type="button" variant="light" className="w-full gap-5">
          <FcGoogle size={24} />
          Sign in with Google
        </Button>
        <p className="text-sm text-center text-gray-600 ">
          Already have a member?{" "}
          <Link
            to="/login"
            className="mt-2 text-sm font-semibold underline transition-all duration-200 text-primary hover:underline"
          >
            Log in here.
          </Link>
        </p>
      </DivMotion>
    </main>
  );
}
