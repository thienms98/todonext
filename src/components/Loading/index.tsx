import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading({loading, children}:{loading: boolean, children: React.ReactNode}){
  return <>
    {loading && <div className="w-full h-full bg-white/40 flex justify-center items-center absolute top-0 left-0 z-[500]">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin spinner" />
    </div>}
    {children}
  </>
}