"use server";

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
    <div className="fixed w-screen h-screen z-50">
      {task ? (
        <div className="w-[50%] h-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
          <div>Title: {task.title}</div>
          <div>Creator: {task.creator.username}</div>
          <div>
            Assignees:{" "}
            {task.assignees
              .map(
                (user: { users: { username: string } }) => user.users.username
              )
              .join(", ")}
          </div>
        </div>
      ) : (
        <div>
          Task not found
          <Link href="/tasks">Back to homepage</Link>
        </div>
      )}
    </div>
  );
}
