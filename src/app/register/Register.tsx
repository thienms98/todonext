"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { saveInfo } from "@/store/auth";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import { User } from "@/utils/types";

export default function Page() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // if (auth.accessToken) router.push("/tasks");

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    if (!username.match(/^(?=.*[A-Za-z])[A-Za-z\d_]{4,}$/)) {
      notification.error({
        message: "username must have at least 4 characters (_ is able)",
      });
      pwRef.current?.focus();
      return;
    }
    if (!password.match(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{4,}$/)) {
      notification.error({
        message:
          "password must have at least 4 chars (1 number, 1 letter, symbol(@ $ ! % * ? &))",
      });
      pwRef.current?.focus();
      return;
    }

    const { data } = (await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      { username, password }
    )) as { data: { success: boolean; message: string; data: User } };

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
