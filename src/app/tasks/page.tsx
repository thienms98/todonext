"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Tasks from "./Tasks";
import axios from "axios";
import { Task, User, TaskResponse, Pagination } from "@/utils/types";

// async function getTodo(token: string, searchParams: {limit: string, page: string}): Promise<{tasks: Task[], pagination: Pagination}> {
//   const {limit = 12, page = 0} = searchParams
//   const { data } = await axios.get(`/api/tasks?limit=${limit}&page=${page}`);
//   // if (!data.success) redirect("/login");
//   const {pagination } = data
//   const tasks: TaskResponse[] = [];
//   for (let key in data.tasks) {
//     tasks.push(data.tasks[key]);
//   }
//   return {
//     tasks: tasks.map((task) => ({
//       id: task.id,
//       title: task.title,
//       createdDate: new Date(task.created_at),
//       deadline: new Date(task.due_at),
//       assignees: task.assignees.map((assignee) => assignee.users),
//       creator: task.creator,
//       completed: task.isDone,
//     })),
//     pagination
//   }
// }
// async function getUsers(token: string): Promise<User[]> {
//   const { data } = await axios.get(`/api/users`, {
//     headers: {
//       'cookie': `token=${token}`
//     }
//   });
//   // if (!data.success) redirect("/login");
//   return data.users;
// }

const Page = async ({searchParams}: {searchParams: {limit: string, page: string}}) => {
  // console.log("render tasks page");

  // const token = headers().get('cookie')?.slice(6)
  // if(!token) redirect('/login')

  // const {tasks, pagination} = await getTodo(token, searchParams);
  // const users = await getUsers(token);

  // return <Tasks todo={tasks} users={users} pagination={pagination} />;
  return <Tasks />
};

export default Page;
