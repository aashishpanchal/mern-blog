import React from "react";
import Header from "./ui/header";
import Logo from "@/assets/logo.png";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { LuBell, LuFileEdit, LuSearch } from "react-icons/lu";
import { Button, buttonProps } from "./ui/button";
import UserMenu from "./user-menu";

export default function Navbar() {
  const [show, setShow] = React.useState(false);
  const { user, auth } = useAppSelector((state) => state.auth);

  return (
    <Header>
      <Link to="/">
        <img src={Logo} alt="Logo" width={40} height={40} />
      </Link>
      {/* search */}
      <div
        className={
          "flex items-center justify-center absolute bg-white/5 w-full left-0 top-full mt-0.5 border-b border-stone-100 py-5 px-10 md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show backdrop-blur-md " +
          (show ? "show" : "hide")
        }
      >
        <div className="relative w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search"
            className="pr-10 rounded-full md:pl-9"
          />
          <span className="absolute h-full text-gray-500 pointer-events-none -translate-y-1/4 right-4 md:left-3 top-1/2">
            <LuSearch size={20} />
          </span>
        </div>
      </div>
      {/* left */}
      <div className="flex items-center gap-4 ml-auto">
        <Button
          size="icon"
          variant="light"
          className="md:hidden"
          onClick={() => setShow((curr) => !curr)}
        >
          <LuSearch size={20} />
        </Button>
        <Link
          to="/editor"
          className={buttonProps({
            variant: "link",
            className: "hidden md:inline-flex",
          })}
        >
          <LuFileEdit />
          <span className="text-sm">Write</span>
        </Link>
        {!auth ? (
          <>
            <Link to="/login" className={buttonProps()}>
              Log In
            </Link>
            <Link
              to="/register"
              className={buttonProps({
                variant: "light",
                className: "hidden md:inline-flex",
              })}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="#"
              className={buttonProps({
                size: "icon",
                variant: "light",
              })}
            >
              <LuBell size={20} />
            </Link>
            <UserMenu user={user} />
          </>
        )}
      </div>
    </Header>
  );
}
