"use server";

import Tasks from "./Tasks";
import { revalidatePath } from "next/cache";
import axios from "axios";
import { redirect } from "next/navigation";
import { Task, User, TaskResponse } from "@/utils/types";
import { cookies } from "next/headers";
// import router from "next/router";
// import { useRouter } from "next/router";

const revalidate = 0;

async function getTodo(headers: {}) {
  const { data } = await axios("http://localhost:3000/api/tasks?limit=20", {
    headers,
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
async function getUsers(headers: {}) {
  const { data } = await axios("http://localhost:3000/api/users", { headers });
  // if (!data.success) redirect("/login");
  return data.users as User[];
}

const Task = async () => {
  console.log("render tasks page");
  const authorization = cookies().get("Authorization")?.value;
  console.log(authorization);
  if (!authorization) redirect("/login");

  const todo = await getTodo({ Authorization: authorization });
  const users = await getUsers({ Authorization: authorization });
  // const router = useRouter();
  // router.refresh();

  return <Tasks todo={todo} users={users} />;
};

export default Task;
