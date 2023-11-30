import { cn } from "@/lib/tw";
import React from "react";

const Header = React.forwardRef<HTMLDivElement, React.ComponentProps<"header">>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      {...props}
      className={cn(
        "sticky top-0 z-10 flex items-center w-full h-16 gap-12 px-10 py-5 bg-white border-b border-stone-100",
        className
      )}
    />
  )
);

Header.displayName = "Header";

export default Header;
