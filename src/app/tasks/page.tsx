"use server";

import Tasks from "./Tasks";
import axios from "axios";
import { redirect } from "next/navigation";
import { Task, User, TaskResponse } from "@/utils/types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
// import router from "next/router";
// import { useRouter } from "next/router";

const revalidate = 0;

async function getTodo() {
  const { data } = await axios("http://localhost:3000/api/tasks?limit=20");
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
async function getUsers() {
  const { data } = await axios("http://localhost:3000/api/users");
  // if (!data.success) redirect("/login");
  return data.users as User[];
}

const Task = async () => {
  console.log("render tasks page");
  const token = cookies().get("token")?.value;
  if (!token) redirect("/login");
  revalidatePath('/tasks', 'page')

  const todo = await getTodo();
  const users = await getUsers();
  // const router = useRouter();
  // router.refresh();

  return <Tasks todo={todo} users={users} />;
};

export default Task;
