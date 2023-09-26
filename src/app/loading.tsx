import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
  return <div className="w-full">
    <FontAwesomeIcon icon={faSpinner} className="animation-spin text-base" />
  </div>;
};

export default Loading;
