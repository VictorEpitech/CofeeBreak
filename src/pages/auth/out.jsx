import { useEffect } from "react";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import userAtom from "../../context/atoms/userAtom";

export default function Out() {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    localStorage.removeItem("coffee-token");
    setUser(null);
    toast.success("bye bye");
    redirect("/");
  }, [setUser]);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h2>Signing you out</h2>
      <p>please wait...</p>
    </div>
  );
}
