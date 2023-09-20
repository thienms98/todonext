import Tasks from './Tasks';
import axios from 'axios';
import { Task, User, TaskResponse } from '@/utils/types';

async function getTodo() {
  const { data } = await axios('http://localhost:3000/api/tasks');
  console.log(data);
  const tasks = [];
  for (let key in data.tasks) {
    tasks.push(data.tasks[key]);
  }
  return tasks.map((task: TaskResponse) => ({
    id: task.id,
    title: task.title,
    createdDate: new Date(task.created_at),
    deadline: new Date(task.due_at),
    assignees: task.assignees.map((assignee) => assignee.users),
    creator: task.creatorid,
    completed: task.isDone,
  })) as Task[];
}
async function getUsers() {
  const { data } = await axios('http://localhost:3000/api/users');
  const users = [];
  return data.users as User[];
}

export default async function Page() {
  const todo = await getTodo();
  const users = await getUsers();

  return <Tasks todo={todo} users={users} />;
}
