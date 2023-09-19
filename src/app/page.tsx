'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { default as TaskItem } from '@/components/Task';
import UserSelector from '@/components/UserSelector';
import { initTasks, createTask } from '@/store/tasks';
import { initUsers } from '@/store/users';

import { RootState } from '@/store';
import type { User, Task, TaskField, ResponseTask } from '@/utils/types';
import { supabase } from '@/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

interface EditData {
  title: string;
  deadline: Date;
  assignees: User[];
}

const defaultData: EditData = {
  title: '',
  deadline: new Date(),
  assignees: [],
};

export default function Home() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  const [newTitle, setNewTitle] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditData>(defaultData);
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [todo, setTodo] = useState<Task[]>([...tasks]);

  const [createdDateSort, setCreatedDateSort] = useState<-1 | 0 | 1>(0);
  const [deadlineSort, setDeadlineSort] = useState<-1 | 0 | 1>(0);

  const createFormRef = useRef<HTMLFormElement>(null);
  const createBtnRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

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

    fetchTodos();
    fetchUsers();

    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEditData((prev) => ({ ...prev, title: newTitle }));
  }, [newTitle]);

  useEffect(() => {
    if (editMode) titleRef.current?.focus();
  }, [editMode]);

  useEffect(() => {
    setTodo(tasks);
  }, [tasks]);

  const fetchUsers = () => {
    supabase
      .from('users')
      .select()
      .then((res) => dispatch(initUsers(res.data || [])));
  };
  const fetchTodos = () => {
    supabase
      .from('tasks')
      .select(
        `
          *,
          creatorid(*),
          assignees(
            users(
              *
            )
          )
        `,
      )
      .returns<ResponseTask[]>()
      .then(({ data }) => {
        if (!data) return;
        const fetchData = data.map((task) => {
          const { created_at, due_at, creatorid, isDone, assignees } = task;
          return {
            ...task,
            createdDate: new Date(created_at),
            deadline: new Date(due_at),
            creator: creatorid,
            completed: isDone,
            assignees: assignees.map((item: any) => item.users),
          };
        });

        dispatch(initTasks(fetchData || []));
        setTodo(fetchData || []);
      });
  };

  const createHandler = () => {
    const createData = { ...editData };
    if (!createData.title) return;
    if (!createData.deadline) createData.deadline = new Date();
    dispatch(createTask({ ...createData }));
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
      if (!filterSearch.trim()) return [...tasks];
      const result = [...prev].filter((item) => item.title.includes(filterSearch));
      if (result.length === 0) return [...tasks];
      return result;
    });
  }, [filterSearch, tasks]);

  const sortTodo = (field: TaskField, sort: -1 | 0 | 1) => {
    if (sort === 0) {
      setTodo([...tasks]);
      return;
    }
    setTodo([...tasks].sort((a, b) => (+a[field] - +b[field]) * sort));
  };

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

  return (
    <main className="min-h-screen flex flex-col px-24 pt-10">
      <h1 className="text-3xl mb-5">Todo</h1>
      <div className="flex border-b-2">
        <div className="w-10"></div>
        <div className="flex-1 flex items-center">
          <span>Title</span>
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute w-4 h-4 left-5 top-[50%] translate-y-[-50%]"
            />
            <input type="text" className="w-[80%] pl-5 ml-5" onChange={filterTask} />
          </div>
        </div>
        <div className="basis-28">Assignees</div>
        <div
          className="basis-28"
          onClick={() => {
            sortTodo('createdDate', createdDateSort);
            changeSort(setCreatedDateSort);
          }}
        >
          Created At {sortIcon(createdDateSort)}
        </div>
        <div
          className="basis-28"
          onClick={() => {
            sortTodo('deadline', deadlineSort);
            changeSort(setDeadlineSort);
          }}
        >
          Due At {sortIcon(deadlineSort)}
        </div>
        <div className="basis-28">Created by</div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {todo.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
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
          <input type="text" className="flex-1 border-b-2 outline-none" ref={titleRef} onChange={editTitle} />
          <UserSelector changeHandler={getAssignees} />
          <input className="basis-[224px]" type="date" id="deadline" name="deadline" onChange={editDeadline} />
          <button type="submit" className="rounded-lg bg-cyan-900 p-2 basis-28 text-white max-h-12">
            Save
          </button>
        </form>
      ) : (
        <div
          className="mt-3 cursor-pointer text-black/800"
          onClick={() => {
            setEditMode(true);
          }}
          ref={createBtnRef}
        >
          + New task
        </div>
      )}
    </main>
  );
}
