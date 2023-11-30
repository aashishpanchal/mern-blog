import { cn } from "@/lib/tw";
import { ImSpinner10 } from "react-icons/im";
import type { IconBaseProps } from "react-icons";

export default function Loading({ className, ...props }: IconBaseProps) {
  return <ImSpinner10 {...props} className={cn(className, "animate-spin")} />;
}
