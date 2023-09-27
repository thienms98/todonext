"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Task as TaskType } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";


export default function Task() {
  const {taskId} = useParams()
  const [task, setTask] = useState<TaskType>()
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setLoading(true)
    axios(`/api/tasks/${taskId}`).then(({data}) => {
      setTask(data.task);
      setLoading(false)
    })
  }, [taskId])

  return (
    <>
      <Head>
        <title>Todo - {task?.title}</title>
      </Head>
      <div
        className="fixed w-screen h-screen z-50"
        // onClick={() => router.back()}
      >
        <Loading loading={loading} >
          {task ? <div className="min-w-[50%] min-h-[50%] py-10 px-20 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">
            <div>Title    : {task.title}</div>
            <div>Create At: {new Date(task.createdDate).toLocaleDateString()}</div>
            <div>Due At   : {new Date(task.deadline).toLocaleDateString()}</div>
            <div>Creator  : <div className="inline-block w-6 h-6 rounded-full overflow-hidden"><Image src={task.creator.image || ''} width={24} height={24} alt='' title={task.creator.username} /></div></div>
            <div>Assignees: <div className="inline-flex">
            {
              task.assignees && task.assignees.length > 0 ?
              task.assignees.map(assignee => (
                <div key={assignee.id} className="w-6 h-6 rounded-full overflow-hidden"><Image src={task.creator.image || ''} width={24} height={24} alt='' title={task.creator.username} /></div>
              ))
              : "No"
            }
            </div></div>
            <div>Done: {task.completed ? 'Yes' : 'Not yet'}</div>
          </div>:
            <div className="min-w-[50%] min-h-[50%] py-10 px-20 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white">Task not found 
            <Link href={'/tasks'}>Back to homepage</Link></div>
          }
        </Loading>
      </div>
    </>
  );
}
