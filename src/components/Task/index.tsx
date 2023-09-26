"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeTask,
  changeState,
  changeTitle,
  changeAssignees,
  changeDeadline,
} from "@/store/tasks";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faTrashCan,
  faPenToSquare,
  faSquareCheck,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import type { Task, User } from "@/utils/types";
import UserSelector from "../UserSelector";
import { notification } from "antd";
import { RootState } from "@/store";

function Task({ task }: { task: Task }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [delMode, setDelMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (editMode && titleRef.current) titleRef.current.focus();
  }, [editMode]);

  useEffect(() => {
    if (dateRef.current)
      dateRef.current.valueAsNumber = task.deadline.getTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCompleted = async () => {
    const { data } = (await axios.put(
      `/api/tasks/${task.id}`,
      { isDone: !task.completed },
      { headers: { 
        Authorization: `Bearer ${accessToken}` ,
        'Content-Type': 'application/json',
      } }
    )) as { data: { success: boolean; message: string } };
    const { success, message } = data;

    if (success) notification.success({ message });
    else notification.error({ message });
    dispatch(changeState({ id: task.id }));
  };

  const updateTitle = async () => {
    setEditMode(false);
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
      { title },
      { headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      ,} }
    );
    if (!data.success) {
      notification.error({ message: "Update failed" });
      return;
    }
    notification.success({ message: "Update successfully" });
    dispatch(changeTitle({ id: task.id, title }));
  };

  const updateDeadline = async (e: any) => {
    const deadline = new Date(e.target.value);
    if (deadline.getTime() - new Date().getTime() >= 0) {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        { due_at: deadline },
        { headers: { Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'application/json', } }
      );
      if (!data.success) {
        notification.error({ message: "Update failed" });
        return;
      }
      notification.success({ message: "Update successfully" });
      dispatch(changeDeadline({ id: task.id, deadline }));
    }
  };

  const updateAssignees = async (
    assignees: User[],
    flag: number,
    user: User
  ) => {
    const method = flag === -1 ? "delete" : "post";
    const { data } = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/assignees`,
      method,
      data: {
        taskId: task.id,
        userId: user.id,
      },
      headers: { Authorization: `Bearer ${accessToken}`, 
      'Content-Type': 'application/json', },
    });
    if (!data.success) {
      notification.error({ message: "Update failed" });
      return;
    }
    notification.success({ message: "Update successfully" });
    dispatch(changeAssignees({ id: task.id, assignees }));
  };

  const deleteTask = async () => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'application/json', },
      }
    );
    if (res.data.status === "failure") {
      notification.error({ message: "Delele task failed" });
      return;
    }
    notification.success({ message: "Delele task successfully" });
    dispatch(removeTask({ id: task.id }));
  };

  return (
    <div className="flex flex-row items-center">
      <div className="w-10" onClick={updateCompleted}>
        <FontAwesomeIcon icon={task.completed ? faCircleCheck : faCircle} />
      </div>
      <div className="flex-[4] flex gap-2 group/interact">
        {editMode ? (
          <form
            className="w-full flex"
            onSubmit={(e) => {
              e.preventDefault();
              setEditMode(false);
              updateTitle();
            }}
          >
            <input
              className="flex-1"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FontAwesomeIcon icon={faSquareCheck} onClick={updateTitle} />
          </form>
        ) : (
          <>
            <Link href={`/tasks/${task.id}`}>{task.title}</Link>
            <div
              className="invisible cursor-pointer ml-2 group-hover/interact:visible"
              onClick={() => setEditMode(true)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div
              className="invisible cursor-pointer group-hover/interact:visible"
              // onClick={() => dispatch(removeTask({ id: task.id }))}
              onMouseLeave={() => setDelMode(false)}
            >
              {delMode ? (
                <div className="flex gap-2">
                  <div
                    className="w-5 h-5 rounded-sm overflow-hidden border-black border-2 text-black flex items-center justify-center"
                    onClick={() => setDelMode(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                  <div
                    className="w-5 h-5 rounded-sm overflow-hidden border-2 text-white bg-red-700 flex items-center justify-center"
                    onClick={deleteTask}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
              ) : (
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={() => setDelMode(true)}
                />
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-row flex-[2]">
        <UserSelector
          selection={task.assignees}
          changeHandler={updateAssignees}
        />
      </div>
      <div className=" flex-[2]">
        {task.createdDate.toLocaleDateString("vi")}
      </div>
      <div className=" flex-[2] group/date flex flex-nowrap items-center">
        <span className="">{task.deadline.toLocaleDateString("vi")}</span>
        <input
          type="date"
          className="hidden group-hover/date:block focus:block w-6"
          ref={dateRef}
          onChange={updateDeadline}
        />
      </div>
      <div className="flex-[2]">
        <div
          className="w-6 h-6 rounded-full overflow-hidden cursor-pointer"
          key={Math.random()}
          title={task.creator.username}
        >
          <Image
            height={24}
            width={24}
            src={task.creator.image || "https://picsum.photos/200"}
            alt={task.creator.username || ""}
            className="h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Task);
