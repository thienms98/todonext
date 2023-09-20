'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { User } from '@/utils/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUser, faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '@/store';

const UserSelector = ({ selection, changeHandler }: { selection?: User[]; changeHandler: Function }) => {
  const list = useSelector((state: RootState) => state.users);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [userList, setUserList] = useState<User[]>([...list]);
  const [selected, setSelected] = useState<User[]>(selection || []);

  const selectorWrapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler: any = (e: React.MouseEvent) => {
      if (toggleRef.current && toggleRef.current.contains(e.target as any)) {
        return;
      }
      if (selectorWrapRef.current && !selectorWrapRef.current.contains(e.target as any)) {
        setSelectMode(false);
      }
    };

    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (!search.trim()) setUserList([...list]);
    const newList: User[] = [];
    userList.forEach((user) => {
      if (user.name.toLowerCase().includes(search.toLowerCase())) newList.push(user);
    });
    if (newList.length === 0) newList.push(...list);
    setUserList(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSelect: Function = (user: User) => {
    const idx = selected.findIndex((item) => item.name === user.name);
    let newSelected = [...selected];
    let flag;
    if (idx === -1) {
      newSelected = [...newSelected, user];
      flag = 1;
    } else {
      newSelected.splice(idx, 1);
      flag = -1;
    }
    setSelected(newSelected);
    changeHandler(newSelected, flag, user);
  };

  return (
    <div className="relative basis-28 cursor-pointer">
      <div className="flex flex-row flex-wrap" onClick={() => setSelectMode(true)} ref={toggleRef}>
        {selected.length > 0 ? (
          <>
            {selected.map((user) => (
              <div key={Math.random()}>
                <Image
                  width={24}
                  height={24}
                  src={user.image || 'https://picsum.photos/200'}
                  alt={user.name || ''}
                  title={user.name}
                />
              </div>
            ))}
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faBars} />
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center border-2 rounded-sm">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}
      </div>
      {selectMode && (
        <div className="absolute flex flex-col top-0 left-0 z-10 border-2" ref={selectorWrapRef}>
          <div className="relative flex flex-row group/search bg-white items-center">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute top-[50%] left-0 translate-y-[-50%] group-hover/search:invisible group-focus-within/search:invisible visible"
            />
            <input
              className="invisible group-hover/search:visible focus:visible"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="w-6 h-6 flex items-center justify-center" onClick={() => setSelectMode(false)}>
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </div>
          <div className="max-h-52 overflow-auto w-full bg-white">
            {userList.map((user) => {
              const contain = selected.findIndex((item) => item.name === user.name) !== -1;
              return (
                <div
                  className={`flex gap-2 border-2 cursor-pointer ${
                    contain ? 'border-blue-600 text-white bg-blue-500' : ''
                  }`}
                  key={Math.random()}
                  onClick={() => handleSelect(user)}
                >
                  <Image width={24} height={24} src={user.image || 'https://picsum.photos/200'} alt="" />
                  <span>{user.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
