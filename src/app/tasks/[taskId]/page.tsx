"use server";

import { fetchData } from "@/utils/fetchData";
import { Task } from "@/utils/types";
import { headers } from "next/headers";

export async function getTask(taskId: string, accessToken: string) {
  return await fetchData({ path: `tasks/${taskId}`, accessToken });
}

export default async function Task({ params }: { params: { taskId: string } }) {
  const { taskId } = params;
  const accessToken = headers().get("authorization");

  const { data }: any = await getTask(taskId, accessToken || "");

  return (
    <div className="fixed w-screen h-screen z-50">
      <div className="w-[50%] h-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
        <div>Title: {data.task.title}</div>
        <div>Creator: {data.task.creator.username}</div>
        <div>
          Assignees:{" "}
          {data.task.assignees
            .map((user: { users: { username: string } }) => user.users.username)
            .join(", ")}
        </div>
      </div>
    </div>
  );
}
