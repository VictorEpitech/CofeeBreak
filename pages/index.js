/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { login } from "../utils/client";

export default function Home() {
  const router = useRouter();
  router.push("/dashboard");
  return (
    <div className="flex justify-evenly gap-5">
      <img
        src="/coffee2.jpg"
        alt="coffee"
        className="h-auto w-2/3 rounded-lg shadow-md"
      />
      <div className="w-1/3 flex flex-col justify-center">
        <h2 className="text-xl font-bold text-center">Coffee Break</h2>
        <button onClick={login} className="btn btn-primary m-4">
          Sign In
        </button>
      </div>
    </div>
  );
}
