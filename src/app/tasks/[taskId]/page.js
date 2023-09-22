import axios from "axios";
import Modal from "./Modal";

export async function generateStaticParams() {
  const tasks = await axios({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
  });

  console.log("tasks", tasks);

  return tasks;
  // return tasks.map((task) => ({
  //   taskId: task.id,
  // }));
}

export default function Task({ params }) {
  console.log("params", params);
  return <Modal />;
}
