'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { default as TaskItem } from '@/components/Task';
import UserSelector from '@/components/UserSelector';
import { createTask } from '@/store/tasks';

import { RootState } from '@/store';
import type { User } from '@/utils/types';
import { users } from '@/utils/mocks/users';

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

    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);
  useEffect(() => {
    setEditData((prev) => ({ ...prev, title: newTitle }));
  }, [newTitle]);

  return (
    <main className="min-h-screen flex flex-col px-24 pt-10">
      <h1 className="text-3xl mb-5">Todo</h1>
      <div className="flex border-b-2">
        <div className="w-10"></div>
        <div className="flex-1">Title</div>
        <div className="basis-28">Assignees</div>
        <div className="basis-28">Created At</div>
        <div className="basis-28">Due At</div>
        <div className="basis-28">Created by</div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      {editMode ? (
        <form
          className="flex flex-row gap-4 items-center mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!editData.title) return;
            if (editData.assignees.length < 1) return;
            dispatch(createTask({ ...editData }));
            setEditMode(false);
            setEditData(defaultData);
          }}
          ref={createFormRef}
        >
          <input
            type="text"
            className="flex-1 border-b-2 outline-none"
            ref={titleRef}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <UserSelector list={users} changeHandler={getAssignees} />
          <input
            className="basis-[224px]"
            type="date"
            id="deadline"
            name="deadline"
            onChange={(e) => {
              const newEditData = { ...editData };
              newEditData.deadline = e.target.valueAsDate || new Date();
              setEditData(newEditData);
            }}
          />
          <button type="submit" className="rounded-lg bg-cyan-900 p-2 basis-28 text-white max-h-12">
            Save
          </button>
        </form>
      ) : (
        <div
          className="mt-3 cursor-pointer text-black/800"
          onClick={() => {
            setEditMode(true);
            titleRef.current?.focus();
          }}
        >
          + New task
        </div>
      )}
    </main>
  );
}
