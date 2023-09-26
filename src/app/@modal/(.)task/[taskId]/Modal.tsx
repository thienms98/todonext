'use client';

import { useRouter } from 'next/navigation';

const Task = () => {
  const router = useRouter();
  return (
    <div
      className="bg-black/30 p-96 box-border fixed top-0 left-0 min-h-full min-w-full z-[1000]"
      onClick={() => router.back()}
    >
      <div className="min-h-full min-w-full bg-white text-black border-4 shadow-xl">Task page</div>
    </div>
  );
};

export default Task;
