import Tasks from "./Tasks";
import axios from "axios";
import { redirect } from "next/navigation";
import { Task, User, TaskResponse } from "@/utils/types";
import { cookies } from "next/headers";

async function getTodo(headers: {}) {
  const { data } = await axios("http://localhost:3000/api/tasks", {
    headers,
  });
  console.log(data);
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
  if (!authorization) redirect("/login");

  console.log("call api tasks and users");
  const todo = await getTodo({ Authorization: authorization });
  const users = await getUsers({ Authorization: authorization });

  return <Tasks todo={todo} users={users} />;
};

export default Task;
