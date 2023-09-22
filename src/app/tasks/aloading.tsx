import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Loading() {
  return (
    <div className="animate-spin text-2xl">
      <FontAwesomeIcon icon={faSpinner} />
    </div>
  );
}
