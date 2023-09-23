import { useEffect, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { saveInfo } from "@/store/auth";
import type { Info } from "@/store/auth";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      saveInfo(JSON.parse(localStorage.getItem("auth") || "{}") as Info)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default Wrapper;
