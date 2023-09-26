import Link from 'next/link';
import { usePathname, useRouter} from 'next/navigation';
import React, { memo } from 'react'
import { Pagination as PaginationInfo } from "@/utils/types";

const Pagination = ({pagination, updatePage}: {pagination: PaginationInfo, updatePage:Function}) => {
  const {totalCount, pageSize, pageNumber} = pagination;
  // const searchParams = useSearchParams();

  const pageCount = Math.ceil(totalCount / pageSize)

  return <div className='flex flex-row justify-center gap-2'>
    {pageNumber > 1 ? <div 
      className='px-2 hover:bg-gray-200 cursor-pointer shadow-md' 
      onClick={()=>{updatePage(pageNumber - 1 < 1 ? 1 : pageNumber-1 )}}>&lt;</div>
      : <div 
      className='px-2 bg-gray-400 cursor-not-allowed'>&lt;</div>
    }
    <span>Page <form className='inline'><input type="number" className='inline w-12' value={pageNumber} onChange={(e:any) => updatePage(e.target.value < 1 ? 1 : e.target.value > pageCount ? pageCount : e.target.value)} /></form>/{pageCount}</span>
    {pageNumber < pageCount ? <div 
      className='px-2 hover:bg-gray-200 cursor-pointer shadow-md' 
      onClick={()=>{updatePage(pageNumber + 1 > pageCount ? pageCount : pageNumber+1 )}}>&gt;</div>
    : <div 
    className='px-2 bg-gray-400 cursor-not-allowed'>&gt;</div>}
  </div>
}

export default memo(Pagination)
