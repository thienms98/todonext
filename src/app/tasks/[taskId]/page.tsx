"use server";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Task } from "@/utils/types";
import { headers } from "next/headers";
import axios from "axios";
import { notification } from "antd";
// import { notification } from "antd";

async function getTask(taskId: string, token?: string) {
  if(!token) return null
  const {data} = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    {headers: {'cookie': `token=${token}`}}
  ) as { data: { success: boolean; message?: string; task?: Task } };
  return data;
}

export default async function Task({ params }: { params: { taskId: string } }) {
  const { taskId } = params;
  
  const token = headers().get("cookie")?.slice(6);
  
  const data = await getTask(taskId, token);
  if(!data) { return null }
  const {success, message, task} = data
  
  console.log(task)
  return (
    <>
      <Head>
        {/* <title>Todo - {task.title}</title> */}
      </Head>
      <div
        className="fixed w-screen h-screen bg-slate-700/50 z-50"
        // onClick={() => router.back()}
      >
        {task && <div className="min-w-[50%] min-h-[50%] py-10 px-20 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
          <div>Title    : {task.title}</div>
          <div>Create At: {new Date(task.createdDate).toLocaleDateString()}</div>
          <div>Due At   : {new Date(task.deadline).toLocaleDateString()}</div>
          <div>Creator  : <div className="inline-block w-6 h-6 rounded-full overflow-hidden"><Image src={task.creator.image || ''} width={24} height={24} alt='' title={task.creator.username} /></div></div>
          <div>Assignees: <div className="inline-flex">
          {
            task.assignees.map(assignee => (
              <div key={assignee.id} className="w-6 h-6 rounded-full overflow-hidden"><Image src={task.creator.image || ''} width={24} height={24} alt='' title={task.creator.username} /></div>
            ))
          }</div></div>
          <div>Done: {task.completed ? 'Yes' : 'No'}</div>
        </div>}
      </div>
    </>
  );
}
