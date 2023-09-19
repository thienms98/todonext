'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useState, useRef, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeTask, changeState, changeTitle, changeAssignees, changeDeadline } from '@/store/tasks';
import { supabase } from '@/supabase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faCircleCheck,
  faTrashCan,
  faPenToSquare,
  faSquareCheck,
  faTimes,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import type { Task, User } from '@/utils/types';
import UserSelector from '../UserSelector';

function Task({ task }: { task: Task }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [delMode, setDelMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editMode && titleRef.current) titleRef.current.focus();
  }, [editMode]);

  useEffect(() => {
    if (dateRef.current) dateRef.current.valueAsNumber = task.deadline.getTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTitle = async () => {
    setEditMode(false);
    dispatch(changeTitle({ id: task.id, title }));
    await supabase.from('tasks').update({ title }).eq('id', task.id);
  };
  const updateDeadline = async (e: any) => {
    const deadline = new Date(e.target.value);
    if (deadline.getTime() - new Date().getTime() >= 0) {
      dispatch(changeDeadline({ id: task.id, deadline }));
      await supabase.from('tasks').update({ due_at: deadline.toLocaleDateString() }).eq('id', task.id);
    }
  };
  const updateAssignees = async (assignees: User[], flag: number, user: User) => {
    dispatch(changeAssignees({ id: task.id, assignees }));
    console.log('update assignees', flag, user);
    if (flag === 1) await supabase.from('assignees').insert({ userId: user.id, taskId: task.id });
    if (flag === -1) await supabase.from('assignees').delete().eq('userId', user.id).eq('taskId', task.id);
  };
  const updateCompleted = async () => {
    await supabase.from('tasks').update({ isDone: !task.completed }).eq('id', task.id);
    dispatch(changeState({ id: task.id }));
  };
  const deleteTask = async () => {
    await supabase.from('tasks').delete().eq('id', task.id);
  };

  return (
    <div className="flex flex-row items-center">
      <div className="w-10" onClick={updateCompleted}>
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
            <FontAwesomeIcon icon={faSquareCheck} onClick={updateTitle} />
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
                <FontAwesomeIcon icon={faTrashCan} onClick={() => setDelMode(true)} />
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-row basis-28">
        <UserSelector selection={task.assignees} changeHandler={updateAssignees} />
      </div>
      <div className="basis-28">{task.createdDate.toLocaleDateString('vi')}</div>
      <div className="basis-28 group/date flex flex-nowrap items-center">
        <span className="">{task.deadline.toLocaleDateString('vi')}</span>
        <input
          type="date"
          className="hidden group-hover/date:block focus:block w-6"
          ref={dateRef}
          onChange={updateDeadline}
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

export default memo(Task);
