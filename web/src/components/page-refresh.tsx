import { PropsWithChildren } from "react";
import { useRefresh } from "@/hooks/useRefresh";
import loader from "@/assets/loader.gif";

export default function PageRefresh({ children }: PropsWithChildren) {
  const loading = useRefresh();

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-white">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
