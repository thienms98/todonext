import React, { memo } from 'react'
import { Pagination as PaginationInfo } from "@/utils/types";

const Pagination = ({pagination, updatePage}: {pagination: PaginationInfo, updatePage:Function}) => {
  let {totalCount, pageSize, pageNumber} = pagination;
  pageNumber -= 0
  pageSize -= 0
  // const searchParams = useSearchParams();

  const pageCount = Math.ceil(totalCount / pageSize)
  if(pageNumber < 0 || pageNumber > pageCount) updatePage(0)
  const array = Array.apply(null, Array(pageCount)).map((item,index) => index+1)
  
  const getButtons = () => {
    if(pageNumber <= 5){
      if(pageCount <=5){
        return <>
          {array.map(num => (
            <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
          ))}
        </>
      }
      else return <>
        {[...array].splice(0, pageNumber+1).map(num => (
          <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
        ))}
        <div>...</div>
        {[...array].splice(-2).map(num => (
          <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
        ))}
      </>
    }
    if(pageNumber > pageCount - 5) return (
      <>
        {[...array].splice(0,2).map(num => (
          <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
        ))}
        <div>...</div>
        {[...array].splice(pageNumber-2).map(num => (
          <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
        ))}
      </>
    )

    return <>
    {[...array].splice(0,2).map(num => (
      <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
    ))}
    <div>...</div>
    {[...array].splice(pageNumber-2,3).map(num => (
      <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
    ))}
    <div>...</div>
    {[...array].splice(-2).map(num => (
      <Button key={num} num={num} pageNumber={pageNumber} updatePage={updatePage}/>
    ))}
  </>
  }

  return <div className='flex flex-row justify-center gap-2'>
    {getButtons()}
  </div>
}

export default memo(Pagination)

const Button = ({num, pageNumber, updatePage}: {num:number, pageNumber: number, updatePage:Function}) => {
  const buttonClassName = 'px-2 hover:bg-gray-200 cursor-pointer shadow-md'
  const activeButtonClassName = 'px-2 cursor-pointer shadow-md bg-black text-white'
  return <div className={num === +pageNumber ? activeButtonClassName : buttonClassName} onClick={() => updatePage(num)}>{num}</div>
}