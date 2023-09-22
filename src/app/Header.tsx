import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { Info } from "@/store/auth";

const Header = () => {
  const user = useSelector((state: RootState) => state.auth) as Info;

  return (
    <div className="flex justify-between px-24 pt-10">
      <h1 className="text-3xl">
        <Link href="/">Todo</Link>
      </h1>
      {user && Object.keys(user).length > 1 ? (
        <div className="flex">
          <div className="rounded-full w-6 h-6">
            <Image src={user.image} width={24} height={24} alt="" />
          </div>
          {user.name}
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-2xl px-2 py-[2px] hover:bg-slate-600"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Header;
