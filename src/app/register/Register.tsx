"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { saveInfo } from "@/store/auth";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import { fetchData } from "@/utils/fetchData";

export default function Page() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // if (auth.accessToken) router.push("/tasks");

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const register = async (e: FormEvent<Element>) => {
    e.preventDefault();
    if (!username.trim()) {
      notification.warning({ message: "Username can not be empty" });
      inputRef.current?.focus();
      return;
    }
    if (!password.trim()) {
      notification.warning({ message: "Password can not be empty" });
      pwRef.current?.focus();
      return;
    }
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)) {
      notification.error({
        message:
          "password must have at least 8 chars (1 number, 1 letter, symbol(@ $ ! % * ? &))",
      });
      pwRef.current?.focus();
      return;
    }

    const res = await fetchData({
      path: "/auth/register",
      method: "post",
      data: { username, password },
    });
    const data = res?.data;
    if (!data.success) {
      notification.error({ message: data.message });
      return;
    }

    notification.success({ message: "Your account has been created!" });
    router.push("/login");
  };

  return (
    <div className="mx-auto">
      <form
        className="flex flex-col items-center gap-2 w-full md:w-[50%] lg:w-80 lg:px-5 mx-auto"
        onSubmit={(e: FormEvent<Element>) => register(e)}
      >
        <h1 className="my-4 font-black text-2xl">Register</h1>
        <label htmlFor="username">
          <input
            className="border-b-2 border-black outline-none pl-4 pb-1"
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            ref={inputRef}
          />
        </label>
        <label htmlFor="password">
          <input
            className="border-b-2 border-black outline-none pl-4 pb-1 mt-2"
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            ref={pwRef}
          />
        </label>
        <input
          type="submit"
          value="Signup"
          className="mt-3 px-6 py-2 border-2 border-transparent hover:border-black cursor-pointer"
        />
        <Link href="/login" className="text-sm hover:underline">
          continue with login
        </Link>
      </form>
    </div>
  );
}
