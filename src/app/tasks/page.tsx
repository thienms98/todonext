"use server";

import Tasks from "./Tasks";
import axios from "axios";
import { redirect } from "next/navigation";
import { Task, User, TaskResponse } from "@/utils/types";
import { headers } from "next/headers";
// import router from "next/router";
// import { useRouter } from "next/router";

async function getTodo(token: string) {
  const { data } = await axios.get("http://localhost:3000/api/tasks?limit=20", {
    headers: {
      'cookie': `token=${token}`
    }
  });
  // if (!data.success) redirect("/login");
  const tasks: TaskResponse[] = [];
  for (let key in data.tasks) {
    tasks.push(data.tasks[key]);
  }
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    createdDate: new Date(task.created_at),
    deadline: new Date(task.due_at),
    assignees: task.assignees.map((assignee) => assignee.users),
    creator: task.creator,
    completed: task.isDone,
  })) as Task[];
}
async function getUsers(token: string) {
  const { data } = await axios.get("http://localhost:3000/api/users", {
    headers: {
      'cookie': `token=${token}`
    }
  });
  // if (!data.success) redirect("/login");
  return data.users as User[];
}

const Task = async () => {
  console.log("render tasks page");

  const token = headers().get('cookie')?.slice(6)
  if(!token) redirect('/login')

  const todo = await getTodo(token);
  const users = await getUsers(token);
  // const router = useRouter();
  // router.refresh();

  return <Tasks todo={todo} users={users} />;
};

export default Task;
