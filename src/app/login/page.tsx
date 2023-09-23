"use server";

import { cookies } from "next/headers";

import Login from "./Login";
import { redirect } from "next/navigation";

export default async function Page() {
  if (cookies().get("Authorization")?.value.split(" ")[1]) redirect("/tasks");

  return <Login />;
}
