import { Outlet } from "react-router-dom";
import Navbar from "../navbar";

type Props = {};

export default function AppLayout({}: Props) {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
