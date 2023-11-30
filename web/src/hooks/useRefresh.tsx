import userApi from "@/apis/user.api";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/app/features/auth.slice";

export function useRefresh() {
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data },
        } = await userApi.me();
        dispatch(setAuth(data));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  return loading;
}
