"use server";

import { default as Modal } from "./Modal";
import { fetchData } from "@/utils/fetchData";
import { Info } from "@/store/auth";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";

export default async function Task({ params }: { params: { taskId: string } }) {
  // const { data: task } = await getTask(params.taskId);
  // console.log(task);
  const router = useRouter();
  console.log(params);

  return (
    <div
      className="fixed w-screen h-screen bg-slate-700/50 z-50"
      onClick={() => router.back()}
    >
      <div className="w-[50%] h-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
        <div>Task page {params.taskId}</div>
        {/* <div>{task.title}</div> */}
      </div>
    </div>
  );
}
