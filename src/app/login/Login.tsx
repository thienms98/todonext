"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { saveInfo } from "@/store/auth";
import { useRouter } from "next/navigation";
import { notification } from "antd";

export default function Page() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // if (auth.accessToken) router.push("/tasks");

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const login = async (e: FormEvent<Element>) => {
    e.preventDefault();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        username,
        password,
      }
    );
    if (data.status === "failure") {
      notification.error({
        message: data.message || "Username or password are not correct",
      });
      dispatch(saveInfo({}));
      return;
    }
    dispatch(saveInfo(data.data));
    localStorage.setItem("auth", JSON.stringify(data.data));
    notification.success({ message: "Login successfully" });
    router.push("/tasks");
  };

  return (
    <div className="mx-auto">
      <form
        className="flex flex-col items-center gap-2 w-full md:w-[50%] lg:w-80 lg:px-5 mx-auto"
        onSubmit={(e: FormEvent<Element>) => login(e)}
      >
        <h1 className="my-4 font-black text-2xl">Login</h1>
        <label htmlFor="username">
          <input
            className="w-full border-b-2 border-black outline-none pl-4 pb-1"
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            ref={inputRef}
            tabIndex={1}
          />
        </label>
        <label htmlFor="password">
          <input
            className="w-full border-b-2 border-black outline-none pl-4 pb-1 mt-2"
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={2}
          />
        </label>
        <div className="flex justify-end w-full mt-2">
          <Link className="hover:underline text-xs" href="/register">
            Create new account
          </Link>
        </div>
        <input
          type="submit"
          value="Login"
          className="mt-3 px-6 py-2 border-2 border-transparent hover:border-black cursor-pointer"
          tabIndex={3}
        />
      </form>
    </div>
  );
}
