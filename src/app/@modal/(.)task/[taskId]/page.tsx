import axios from "axios";
import Modal from "./Modal";

export async function getTask(id: number) {
  const task = await axios({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
  });

  return task;
}

export default function Task({ params }: { params: { slug: string } }) {
  console.log("params", params);
  return <Modal />;
}
