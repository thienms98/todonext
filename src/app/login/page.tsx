"use server";

import { cookies } from "next/headers";

import Login from "./Login";

export default async function Page() {
  
  return <Login 
    cookie={cookies().get("Authorization")?.value.split(" ")[1] || ''}
  />;
}
