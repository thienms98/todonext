import {useState, useEffect, useRef, useMemo} from 'react'
import Link from 'next/link';
import { usePathname, useRouter} from 'next/navigation';
import React, { memo } from 'react'
import { Pagination as PaginationInfo } from "@/utils/types";

const Pagination = ({pagination}: {pagination: PaginationInfo}) => {
  const {totalCount, pageSize, pageNumber} = pagination;
  const pathname = usePathname();
  const [page, setPage] = useState<number>(pageNumber);
  const pageRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  // const searchParams = useSearchParams();

  const pageCount = Math.ceil(totalCount / pageSize)
  
  // const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL)
  useEffect(() => {
    const url = new URL(window?.location.href || `${process.env.NEXT_PUBLIC_BASE_URL}/${pathname}`)
    url.searchParams.set('page', page.toString())
    router.push(url.href)
  }, [page, pathname, router])

  return <div className='flex flex-row justify-center gap-2'>
    <div 
      className='px-2 hover:bg-gray-200 cursor-pointer' 
      onClick={()=>{setPage(prev => prev - 1 < 1 ? 1 : prev-1 )}}>&lt;</div>
    <span>Page <form className='inline'><input type="number" className='inline w-12' value={page} onChange={(e:any) => setPage(e.target.value)} /></form>/{pageCount}</span>
    <div 
      className='px-2 hover:bg-gray-200 cursor-pointer' 
      onClick={()=>{setPage(prev => prev + 1 > pageCount ? pageCount : prev+1 )}}>&gt;</div>
  </div>
}

export default Pagination
