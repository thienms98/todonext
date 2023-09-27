"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
import Loading from "@/components/Loading";

interface EditData {
  title: string;
  deadline: Date;
  assignees: User[];
}
type Switch = 0 | 1 | -1;

const defaultData: EditData = {
  title: "",
  deadline: new Date(),
  assignees: [],
};

const statusList: { value: Switch; label: string }[] = [
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
const limitList: number[] = [2, 5, 12, 20, 50]

export default function Home() {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {tasks} = useSelector((state: RootState) => state.tasks);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  console.log('render tasks')

  const [todo, setTodo] = useState<Task[]>(tasks)
  const [newTitle, setNewTitle] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditData>(defaultData);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationInfo>()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(pagination?.pageSize || 12)
  const [showLimit, setShowLimit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<Switch>(searchParams.get('isDone') ? (searchParams.get('isDone') === '1' ? 1 : -1) : 0);
  const [createdDateSort, setCreatedDateSort] = useState<Switch>(0);
  const [deadlineSort, setDeadlineSort] = useState<Switch>(0);

  const createFormRef = useRef<HTMLFormElement>(null);
  const createBtnRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const limitRef = useRef<HTMLButtonElement>(null)

  const getAssignees: Function = (assignees: User[]) => {
    setEditData((prev) => ({ ...prev, assignees }));
  };

  const fetchData = useCallback((url:string = `/api${pathname}?${searchParams.toString()}`) => {
    setLoading(true)
    console.log('call axios ', url)
    axios.get(url)
      .then(({data}) => {
        console.log(data)
        if(!data.success) return
        const {tasks, pagination} = data
        const normalize_tasks:Task[] = Object.keys(tasks).map(key => {
          const task = tasks[key]
          return {
            id: task.id,
            title: task.title,
            createdDate: new Date(task.created_at),
            deadline: new Date(task.due_at),
            creator: task.creator,
            assignees: task.assignees.map((user: {users: User}) => user.users),
            completed: task.isDone
          }
        })
        console.log('update store with: ', normalize_tasks)
        dispatch(initTasks(normalize_tasks));
        setPagination(pagination)
        setLoading(false)
      })
  }, [pathname, searchParams])

  useEffect(() => {
    console.log('url changed')
    fetchData()
  }, [pathname, searchParams, fetchData])

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchText(filterSearch)
    }, 500)
    return ()=>clearTimeout(delay)
  }, [filterSearch])

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

    axios.get('/api/users').then(({data}) => dispatch(initUsers(data.users)))

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEditData((prev) => ({ ...prev, title: newTitle }));
  }, [newTitle]);

  useEffect(() => {
    if (editMode) titleRef.current?.focus();
  }, [editMode]);

  useEffect(() => {
    console.log('tasks updated');
    setTodo(tasks)
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
        `/api/tasks`,
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
      dispatch(createTask({ id: data.task.id, ...createData }));
      // fetchData()
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
    const params = new URLSearchParams();
    if(searchText?.trim()) params.set('q', searchText.trim())
    if(status !== 0) params.set('isDone', status === 1 ? '1' : '0')
    if(createdDateSort) {
      params.set('sortBy', 'created_at')
      params.set('sort', createdDateSort === 1 ? 'asc' : 'desc')
    }
    if(deadlineSort) {
      params.set('sortBy', 'due_at')
      params.set('sort', deadlineSort === 1 ? 'asc' : 'desc')
    }
    if(limit) params.set('limit', limit+'')
    if(page) params.set('page', page+'')
    console.log(params.toString());
    
    router.push(`${pathname}?${params.toString()}`)
  }, [status, searchText, createdDateSort, deadlineSort, limit, page, pathname, router]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', limit.toString())
    router.push(url.href)
  }, [limit, router])

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
  const getStatus = (key: Switch) => {
    return statusList.find((item) => item.value === key);
  };

  return (
    <main className="flex flex-col px-24 pt-10">
      <Loading loading={loading}>
        <div className="flex gap-4 mb-5">
          <div className="flex flex-col group/status min-w-[250px] cursor-pointer relative bg-inherit">
            <div className="absolute w-full bg-white">
              <div className="capitalize shadow-md px-4 py-[6px]">
                Status: {getStatus(status)?.label}
              </div>
              <div className="shadow-md">
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
              className={
                filterSearch.trim()
                ? "w-[80%] pl-8 bg-transparent border-2 border-black outline-none transition-all"
                : "w-0 pl-8 bg-transparent border-2 border-transparent focus:w-[80%] focus:border-black outline-none transition-all"
              }
              onChange={filterTask}
              value={filterSearch}
            />
          </div>
          <div className="flex-1"></div>
          <div className="relative">
            <label htmlFor="checkbox" className="bg-white shadow-md px-4 py-2">
              Tasks/page: {limit}
            </label>
            <input type="checkbox" hidden id="checkbox" onChange={e => setShowLimit(e.target.checked)} />
            {showLimit && <div className="flex flex-col absolute top-[100%] right-0 bg-white shadow-md min-w-[40px]">
              {limitList.map(limit => (
                <div
                  key={limit}
                  onClick={()=>{
                    setLimit(limit);
                    setShowLimit(false)}
                  }
                  className="cursor-pointer hover:bg-gray-200 text-right px-3"
                >
                  {limit}
                </div>))
              }
            </div>}
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
            [...todo].splice(0, limit).map((task) => <TaskItem key={task.id} task={task} />)
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
        {pagination && <Pagination pagination={pagination} updatePage={(number:number) => setPage(number)} />}
      </Loading>
    </main>
  );
}
