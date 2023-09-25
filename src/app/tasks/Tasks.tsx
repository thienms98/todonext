"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { default as TaskItem } from "@/components/Task";
import UserSelector from "@/components/UserSelector";
import { initTasks, createTask } from "@/store/tasks";
import { initUsers } from "@/store/users";

import { RootState } from "@/store";
import type { User, Task, Pagination as PaginationInfo } from "@/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSort,
  faSortDown,
  faSortUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { notification } from "antd";
import Pagination from "@/components/Pagination";

interface EditData {
  title: string;
  deadline: Date;
  assignees: User[];
}
type Status = 0 | 1 | -1;

const defaultData: EditData = {
  title: "",
  deadline: new Date(),
  assignees: [],
};

const statusList: { value: Status; label: string }[] = [
  {
    value: 0,
    label: "All",
  },
  {
    value: -1,
    label: "Incomplete",
  },
  {
    value: 1,
    label: "Complete",
  },
];

export default function Home(props: {pagination: PaginationInfo, todo: Task[], users: User[]}) {
  const router = useRouter();
  const tasks = useSelector((state: RootState) => state.tasks);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  console.log('render tasks pagination', props.pagination)

  const [newTitle, setNewTitle] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditData>(defaultData);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [todo, setTodo] = useState<Task[]>([...tasks]);

  const [status, setStatus] = useState<Status>(0);
  const [createdDateSort, setCreatedDateSort] = useState<-1 | 0 | 1>(0);
  const [deadlineSort, setDeadlineSort] = useState<-1 | 0 | 1>(0);

  const createFormRef = useRef<HTMLFormElement>(null);
  const createBtnRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const getAssignees: Function = (assignees: User[]) => {
    setEditData((prev) => ({ ...prev, assignees }));
  };

  useEffect(() => {
    const handler: EventListener = (e: any) => {
      if (
        createFormRef.current &&
        !e.target.contains(createFormRef.current) &&
        createBtnRef.current &&
        !e.target.contains(createBtnRef.current)
      ) {
        setEditMode(false);
      }
    };

    dispatch(initUsers(props.users));

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(initTasks(props.todo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.todo])

  useEffect(() => {
    setEditData((prev) => ({ ...prev, title: newTitle }));
  }, [newTitle]);

  useEffect(() => {
    if (editMode) titleRef.current?.focus();
  }, [editMode]);

  useEffect(() => {
    setTodo(tasks);
  }, [tasks]);

  const createHandler = async () => {
    const createData = {
      ...editData,
      creator: {
        id: auth.id,
        username: auth.username,
        image: auth.image,
      }
    } as {
      title: string,
      deadline: Date,
      creator: User,
      assignees: User[]
    }
    if (!createData.title) return;
    if (!createData.deadline) createData.deadline = new Date();

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
        {
          title: createData.title,
          due_at: createData.deadline,
          creator: createData.creator,
          assignees: createData.assignees,
        },
        {
          headers: { Authorization: auth.accessToken },
        }
      );
      if (!data.success) {
        notification.error({ message: "Create task failed", duration: 3 });
        return;
      }
      console.log(data.task);
      dispatch(createTask({ id: data.task.id, ...createData }));
      notification.success({
        message: "Create task successfully",
        duration: 3,
      });
    } catch (err) {
      notification.error({ message: "Create task failed", duration: 3 });
    }

    setEditMode(false);
    setEditData(defaultData);
  };

  const editTitle = (e: any) => setNewTitle(e.target.value);
  const editDeadline = (e: any) => {
    const newEditData = { ...editData };
    newEditData.deadline = e.target.valueAsDate || new Date();
    setEditData(newEditData);
  };

  const filterTask = (e: any) => {
    setFilterSearch(e.target.value);
  };
  useEffect(() => {
    setTodo((prev) => {
      let result: Task[];
      if (!filterSearch.trim()) result = [...tasks];
      else
        result = [...tasks].filter((item) => item.title.includes(filterSearch));
      if (result.length === 0) result = [...tasks];
      if (status !== 0)
        result = [...result].filter((task) => {
          if (status === 1) return task.completed;
          if (status === -1) return !task.completed;
        });
      if (createdDateSort !== 0) {
        result.sort(
          (a, b) =>
            (a.createdDate.getTime() - b.createdDate.getTime()) *
            createdDateSort
        );
      }
      if (deadlineSort !== 0) {
        result.sort(
          (a, b) => (a.deadline.getTime() - b.deadline.getTime()) * deadlineSort
        );
      }
      return result;
    });
  }, [status, filterSearch, createdDateSort, deadlineSort, tasks]);

  const changeSort = (callback: any) => {
    callback((prev: -1 | 0 | 1) => (prev + 1 > 1 ? -1 : prev + 1));
  };
  const sortIcon = (value: -1 | 0 | 1) => {
    switch (value) {
      case -1:
        return <FontAwesomeIcon icon={faSortDown} />;
      case 0:
        return <FontAwesomeIcon icon={faSort} />;
      case 1:
        return <FontAwesomeIcon icon={faSortUp} />;
      default:
        return <FontAwesomeIcon icon={faSort} />;
    }
  };
  const getStatus = (key: Status) => {
    return statusList.find((item) => item.value === key);
  };

  return (
    <main className="min-h-screen flex flex-col px-24 pt-10">
      <div className="flex gap-4 mb-5">
        <div className="flex flex-col group/status min-w-[100px] cursor-pointer relative bg-inherit">
          <div className="absolute w-full bg-white">
            <div className="capitalize  px-2">
              Status: {getStatus(status)?.label}
            </div>
            {statusList.map((item) => (
              <div
                key={item.value}
                className="hidden group-hover/status:block hover:bg-gray-600 hover:text-white  px-2"
                onClick={() => setStatus(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative max-w-xs">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute w-4 h-4 left-2 top-[50%] translate-y-[-50%] cursor-pointer"
            onClick={() => searchRef.current?.focus()}
          />
          <input
            type="text"
            ref={searchRef}
            className="w-0 pl-8 bg-transparent border-2 border-transparent focus:w-[80%] focus:border-black outline-none transition-all"
            onChange={filterTask}
          />
        </div>
      </div>
      <div className="flex border-b-2">
        <div className="w-10"></div>
        <div className="flex-[4] flex items-center">
          <span>Title</span>
        </div>
        <div className="flex-[2]">Assignees</div>
        <div
          className="flex-[2] cursor-pointer"
          onClick={() => {
            changeSort(setCreatedDateSort);
            setDeadlineSort(0);
          }}
        >
          Created At {sortIcon(createdDateSort)}
        </div>
        <div
          className="flex-[2] cursor-pointer"
          onClick={() => {
            changeSort(setDeadlineSort);
            setCreatedDateSort(0);
          }}
        >
          Due At {sortIcon(deadlineSort)}
        </div>
        <div className="flex-[2]">Created by</div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {todo && todo.length > 0 ? (
          todo.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <span className="text-xl mt-4">There are no todo. Create new</span>
        )}
      </div>
      {editMode ? (
        <form
          className="flex flex-row gap-4 items-center mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            createHandler();
          }}
          ref={createFormRef}
        >
          <input
            type="text"
            className="flex-1 border-b-2 outline-none"
            ref={titleRef}
            onChange={editTitle}
          />
          <UserSelector changeHandler={getAssignees} />
          <input
            className="basis-[224px]"
            type="date"
            id="deadline"
            name="deadline"
            onChange={editDeadline}
          />
          <button
            type="submit"
            className="rounded-lg bg-cyan-900 p-2 basis-18 text-white max-h-12"
          >
            Save
          </button>
          <div
            className="rounded-lg bg-red-600 p-2 basis-10 text-white text-center cursor-pointer"
            onClick={() => setEditMode(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </form>
      ) : (
        <div
          className="mt-3 cursor-pointer text-black/800 hover:bg-green-500 hover:text-white self-start p-4 rounded-lg"
          onClick={() => {
            setEditMode(true);
          }}
          ref={createBtnRef}
        >
          + New task
        </div>
      )}
      <Pagination pagination={props.pagination} />
    </main>
  );
}
