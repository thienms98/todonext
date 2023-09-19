'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeTask, changeState, changeTitle, changeAssignees, changeDeadline } from '@/store/tasks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck, faTrashCan, faPenToSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

import type { Task, User } from '@/utils/types';
import UserSelector from '../UserSelector';
import { users } from '@/app/page';

export default function Task({ task }: { task: Task }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editMode && titleRef.current) titleRef.current.focus();
  }, [editMode]);

  useEffect(() => {
    if (dateRef.current) dateRef.current.valueAsNumber = task.deadline.getTime();
  }, []);

  return (
    <div className="flex flex-row items-center">
      <div className="w-10" onClick={() => dispatch(changeState({ id: task.id }))}>
        <FontAwesomeIcon icon={task.completed ? faCircleCheck : faCircle} />
      </div>
      <div className="flex-1 flex gap-2 pr-4 group/interact">
        {editMode ? (
          <form
            className="w-full flex"
            onSubmit={(e) => {
              e.preventDefault();
              setEditMode(false);
              dispatch(changeTitle({ id: task.id, title }));
            }}
          >
            <input
              className="flex-1"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSquareCheck}
              onClick={() => {
                setEditMode(false);
                dispatch(changeTitle({ id: task.id, title }));
              }}
            />
          </form>
        ) : (
          <>
            <Link href="/task">{task.title}</Link>
            <div
              className="invisible cursor-pointer ml-2 group-hover/interact:visible"
              onClick={() => setEditMode(true)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div
              className="invisible cursor-pointer group-hover/interact:visible"
              onClick={() => dispatch(removeTask({ id: task.id }))}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
          </>
        )}
      </div>
      <div className="flex flex-row basis-28">
        <UserSelector
          list={users}
          selection={task.assignees}
          changeHandler={(assignees: User[]) => dispatch(changeAssignees({ id: task.id, assignees }))}
        />
      </div>
      <div className="basis-28">{task.createdDate.toLocaleDateString('vi')}</div>
      <div className="basis-28 group/date flex flex-nowrap items-center">
        <span className="">{task.deadline.toLocaleDateString('vi')}</span>
        <input
          type="date"
          className="hidden group-hover/date:block focus:block w-6"
          ref={dateRef}
          onChange={(e) => {
            const deadline = new Date(e.target.value);
            if (deadline.getTime() - new Date().getTime() >= 0) dispatch(changeDeadline({ id: task.id, deadline }));
          }}
        />
      </div>
      <div className="basis-28">
        <div
          className="w-6 h-6 rounded-full overflow-hidden cursor-pointer"
          key={Math.random()}
          title={task.creator.name}
        >
          <Image height={24} width={24} src={task.creator.image} alt={task.creator.name} />
        </div>
      </div>
    </div>
  );
}
