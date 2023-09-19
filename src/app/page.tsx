'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { default as TaskItem } from '@/components/Task';
import UserSelector from '@/components/UserSelector';
import { createTask } from '@/store/tasks';

import { RootState } from '@/store';
import type { User } from '@/utils/types';

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

const placeholderImg: string =
  'https://www.dovercourt.org/wp-content/uploads/2019/11/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-286x300.jpg';

export const users = [
  { id: 100, name: 'Abigail', image: placeholderImg },
  { id: 101, name: 'Alexandra', image: placeholderImg },
  { id: 102, name: 'Alison', image: placeholderImg },
  { id: 103, name: 'Amanda', image: placeholderImg },
  { id: 104, name: 'Amelia', image: placeholderImg },
  { id: 105, name: 'Amy', image: placeholderImg },
  { id: 106, name: 'Andrea', image: placeholderImg },
  { id: 107, name: 'Angela', image: placeholderImg },
  { id: 108, name: 'Anna', image: placeholderImg },
  { id: 109, name: 'Anne', image: placeholderImg },
  { id: 110, name: 'Audrey', image: placeholderImg },
  { id: 111, name: 'Ava', image: placeholderImg },
  { id: 112, name: 'Bella', image: placeholderImg },
  { id: 113, name: 'Bernadette', image: placeholderImg },
  { id: 114, name: 'Carol', image: placeholderImg },
  { id: 115, name: 'Caroline', image: placeholderImg },
  { id: 116, name: 'Carolyn', image: placeholderImg },
  { id: 117, name: 'Chloe', image: placeholderImg },
  { id: 118, name: 'Claire', image: placeholderImg },
  { id: 119, name: 'Deirdre', image: placeholderImg },
  { id: 120, name: 'Diana', image: placeholderImg },
  { id: 121, name: 'Diane', image: placeholderImg },
  { id: 122, name: 'Donna', image: placeholderImg },
  { id: 123, name: 'Dorothy', image: placeholderImg },
  { id: 124, name: 'Elizabeth', image: placeholderImg },
  { id: 125, name: 'Ella', image: placeholderImg },
  { id: 126, name: 'Emily', image: placeholderImg },
  { id: 127, name: 'Emma', image: placeholderImg },
  { id: 128, name: 'Faith', image: placeholderImg },
  { id: 129, name: 'Felicity', image: placeholderImg },
  { id: 130, name: 'Fiona', image: placeholderImg },
  { id: 131, name: 'Gabrielle', image: placeholderImg },
  { id: 132, name: 'Grace', image: placeholderImg },
  { id: 133, name: 'Hannah', image: placeholderImg },
  { id: 134, name: 'Heather', image: placeholderImg },
  { id: 135, name: 'Irene', image: placeholderImg },
  { id: 136, name: 'Jan', image: placeholderImg },
  { id: 137, name: 'Jane', image: placeholderImg },
  { id: 138, name: 'Jasmine', image: placeholderImg },
  { id: 139, name: 'Jennifer', image: placeholderImg },
  { id: 140, name: 'Jessica', image: placeholderImg },
  { id: 141, name: 'Joan', image: placeholderImg },
  { id: 142, name: 'Joanne', image: placeholderImg },
  { id: 143, name: 'Julia', image: placeholderImg },
  { id: 144, name: 'Karen', image: placeholderImg },
  { id: 145, name: 'Katherine', image: placeholderImg },
  { id: 146, name: 'Kimberly', image: placeholderImg },
  { id: 147, name: 'Kylie', image: placeholderImg },
  { id: 148, name: 'Lauren', image: placeholderImg },
  { id: 149, name: 'Leah', image: placeholderImg },
  { id: 150, name: 'Lillian', image: placeholderImg },
];

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
