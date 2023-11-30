import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export default function Protected({ children }: React.PropsWithChildren) {
  const { auth } = useAppSelector((state) => state.auth);

  if (!auth) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
