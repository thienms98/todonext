"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Tasks from "./Tasks";
import axios from "axios";
import { Task, User, TaskResponse, Pagination } from "@/utils/types";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

async function getTodo(token: string, searchParams: {limit: string, page: string}) {
  const {limit = 12, page = 0} = searchParams
  console.log(limit, page)
  const { data } = await axios.get(`/api/tasks?limit=${limit}&page=${page}`, {
    headers: {
      'cookie': `token=${token}`
    }
  });
  // if (!data.success) redirect("/login");
  const {pagination } = data
  const tasks: TaskResponse[] = [];
  for (let key in data.tasks) {
    tasks.push(data.tasks[key]);
  }
  return {
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      createdDate: new Date(task.created_at),
      deadline: new Date(task.due_at),
      assignees: task.assignees.map((assignee) => assignee.users),
      creator: task.creator,
      completed: task.isDone,
    })),
    pagination
  } as {tasks: Task[], pagination: Pagination};
}
async function getUsers(token: string) {
  const { data } = await axios.get(`/api/users`, {
    headers: {
      'cookie': `token=${token}`
    }
  });
  // if (!data.success) redirect("/login");
  return data.users as User[];
}

const Task = async ({searchParams}: {searchParams: {limit: string, page: string}}) => {
  console.log("render tasks page");

  const token = headers().get('cookie')?.slice(6)
  if(!token) redirect('/login')

  // let array:Prisma.tasksCreateInput[] = []
  // for(let i=0; i<=100; i++){
  //   array.push({
  //     title: `task 00_${i}`,
  //     due_at: new Date('09/28/2023'),
  //     creator: {
  //       connect: {
  //         id: 4
  //       }
  //     },
  //     assignees: {
  //       createMany: {
  //         data: [
  //           { userId: 1 },
  //           { userId: 2 },
  //           { userId: 6 },
  //         ]
  //       }
  //     }
  //   })
  // }
  // await prisma.tasks.createMany({data: array})

  const {tasks, pagination} = await getTodo(token, searchParams);
  const users = await getUsers(token);

  return <Tasks todo={tasks} users={users} pagination={pagination} />;
};

export default Task;
