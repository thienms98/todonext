"use server";

import Head from "next/head";
import Link from "next/link";
import { Task } from "@/utils/types";
import { headers } from "next/headers";
import axios from "axios";
import { notification } from "antd";

async function getTask(taskId: string, accessToken: string) {
  const { data } = (await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )) as { data: { success: boolean; message?: string; task?: Task } };
  return data;
}

export default async function Task({ params }: { params: { taskId: string } }) {
  const { taskId } = params;
  const accessToken = headers().get("authorization");

  const { success, message, task }: any = await getTask(
    taskId,
    accessToken || ""
  );
  // if (!success) notification.error({ message });

  return (
    <>
      <Head>
        <title>Todo - {task.title}</title>
      </Head>
      return (
    <div
      className="fixed w-screen h-screen bg-slate-700/50 z-50"
      // onClick={() => router.back()}
    >
      <div className="w-[50%] h-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
        <div>Task page {params.taskId}</div>
        {/* <div>{task.title}</div> */}
      </div>
    </div>
  );
    </>
  );
}
