"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveInfo } from "@/store/auth";
import { useRouter } from "next/navigation";
import { notification } from "antd";

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();

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
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    notification.success({ message: "Login successfully" });
    router.push("/tasks");
  };

  return (
    <div className="mx-auto">
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={(e: FormEvent<Element>) => login(e)}
      >
        <h1>Login</h1>
        <label htmlFor="username">
          <input
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
