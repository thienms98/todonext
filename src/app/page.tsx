"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { saveInfo } from "@/store/auth";
import type { Info } from "@/store/auth";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  async function refresh(
    accessToken: string | null,
    refreshToken: string | null
  ) {
    if (!accessToken || !refreshToken) return null;
    return (await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )) as Info;
  }

  if (!localStorage) router.push("/login");
  refresh(
    localStorage.getItem("accessToken"),
    localStorage.getItem("refreshToken")
  ).then((data) => {
    if (!data) router.push("/login");
    else {
      dispatch(saveInfo(data));
      router.push("/tasks");
    }
  });

  return <></>;
}
