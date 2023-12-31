"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeTask,
  changeState,
  changeTitle,
  changeAssignees,
  changeDeadline,
  createTask,
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
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

import type { Task, User } from "@/utils/types";
import UserSelector from "../UserSelector";
import { notification } from "antd";
import { RootState } from "@/store";
import Tooltip from "../Tooltip";

function Task({ task }: { task: Task }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [delMode, setDelMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editMode && titleRef.current) titleRef.current.focus();
  }, [editMode]);

  useEffect(() => {
    if (dateRef.current)
      dateRef.current.valueAsNumber = task.deadline.getTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCompleted = async () => {
    dispatch(changeState({ id: task.id }));
    const { data } = (await axios.put(
      `/api/tasks/${task.id}`,
      { isDone: !task.completed }
    )) as { data: { success: boolean; message: string } };
    const { success, message } = data;

    if (success) notification.success({ message });
    else {
      notification.error({ message })
      dispatch(changeState({ id: task.id }));
    };
  };

  const updateTitle = async () => {
    setEditMode(false);
    dispatch(changeTitle({ id: task.id, title }));
    if(title === task.title) return
    const { data } = await axios.put(
      `/api/tasks/${task.id}`,
      { title }
    );
    if (!data.success) {
      notification.error({ message: "Update failed" });
      dispatch(changeTitle({id: task.id, title: task.title}));
      setTitle(task.title)
    }
    else notification.success({ message: "Update successfully" });
  };

  const updateDeadline = async (e: any) => {
    const deadline = new Date(e.target.value);
    dispatch(changeDeadline({ id: task.id, deadline }));
    if (deadline.getTime() - task.createdDate.getTime() > 0) {
      const { data } = await axios.put(
        `/api/tasks/${task.id}`,
        { due_at: deadline }
      );
      if (!data.success) {
        notification.error({ message: "Update failed" });
        dispatch(changeDeadline({ id: task.id, deadline: task.deadline }));
      }
      else notification.success({ message: "Update successfully" });
    }
  };

  const updateAssignees = async (
    assignees: User[],
    flag: number,
    user: User
  ) => {
    dispatch(changeAssignees({ id: task.id, assignees: assignees }));
    const method = flag === -1 ? "delete" : "post";
    const { data } = await axios({
      url: `/api/assignees`,
      method,
      data: {
        taskId: task.id,
        userId: user.id,
      },
    });
    if (!data.success) {
      notification.error({ message: "Update failed" });
      dispatch(changeAssignees({ id: task.id, assignees: [...task.assignees] }));
      return;
    }
    notification.success({ message: "Update successfully" });
  };

  const deleteTask = async () => {
    dispatch(removeTask({ id: task.id }));
    const res = await axios.delete(
      `/api/tasks/${task.id}`
    );
    if (!res.data.success) {
      notification.error({ message: "Delele task failed" });
      dispatch(createTask({...task}))
      return;
    }
    notification.success({ message: "Delele task successfully" });
    router.replace(window.location.href)
  };

  return (
    <div className="flex flex-row items-center border-b-2 min-h-[32px] group/container">
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
      <div className=" flex-[2] flex flex-nowrap items-center gap-1">
        <span className="">{task.deadline.toLocaleDateString("vi")}</span>
        <input
          type="date"
          className="w-0 outline-none"
          ref={dateRef}
          onChange={updateDeadline}
          id="datepicker"
        />
        <FontAwesomeIcon icon={faCalendar} className="hidden group-hover/container:block" onClick={()=>dateRef.current?.showPicker()}/>
      </div>
      <div className="flex-[2]">
        <Tooltip title={task.creator.username}>
          <div
            className="w-6 h-6 rounded-full overflow-hidden cursor-pointer"
            key={Math.random()}
          >
            <Image
              height={24}
              width={24}
              src={task.creator.image || "https://picsum.photos/200"}
              alt={task.creator.username || ""}
              className="h-full object-cover"
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default memo(Task);
