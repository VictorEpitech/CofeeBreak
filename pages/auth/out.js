import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../../context/atoms/userAtom";

export default function Out() {
  const router = useRouter();
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    localStorage.removeItem("coffee-token");
    setUser(null);
    toast.success("bye bye");
  }, [router, setUser]);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h2>Signing you out</h2>
      <p>please wait...</p>
    </div>
  );
}
