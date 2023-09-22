import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { saveInfo } from "@/store/auth";
import type { Info } from "@/store/auth";
import axios from "axios";
import { notification } from "antd";

const Header = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth) as Info;
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (res.data.success) {
        notification.success({ message: "Logout successfully", duration: 2 });
        dispatch(saveInfo({}));
        localStorage.removeItem("auth");
        router.push("/login");
      } else notification.error({ message: "Logout fail" });
    } catch (err) {
      notification.error({ message: "Logout fail" });
    }
  };

  return (
    <div className="flex justify-between px-24 pt-10">
      <h1 className="text-3xl">
        <Link href="/">Todo</Link>
      </h1>
      {user && Object.keys(user).length > 1 ? (
        <div className="flex">
          <div className="rounded-full w-6 h-6 overflow-hidden">
            <Image
              src={user.image || ""}
              width={24}
              height={24}
              alt=""
              className="h-full object-cover"
            />
          </div>
          {user.name}
          <div
            className="rounded-2xl px-2 py-[2px] hover:bg-slate-600 cursor-pointer"
            onClick={logout}
          >
            Logout
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-2xl px-2 py-[2px] hover:bg-slate-600 cursor-pointer"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Header;
