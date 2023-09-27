export default function Tooltip({title, children}: {title: string, children: React.ReactNode}){
  return <div className="relative group">
    {children}
    <div className="absolute border-[1px] border-black bg-white z-20 text-sm px-1 hidden group-hover:block">
      <div className="w-2 h-2 absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-50%] rotate-45 bg-white border-black border-l-[1px] border-t-[1px]"></div>
      {title}
    </div>
  </div>
}