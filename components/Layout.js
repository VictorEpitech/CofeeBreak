import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingAtom from "../context/atoms/loadingAtom";
import userAtom from "../context/atoms/userAtom";
import { client } from "../utils/client";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({children}) {

  const [user, setUser] = useRecoilState(userAtom);
  const loading = useRecoilValue(loadingAtom);
  const router = useRouter()

  useEffect(() => {
    const getUser = async() => {
      try {
        const u = await client.account.get()
        setUser(u)
      } catch (error) {
        toast.error("could not authenticate you, please sign in again")
        router.push("/")
      }
    }
    if (router.pathname !== "/") {
      getUser()
    }
  }, [router, setUser])

  return (
    <div id="root" className="relative">
        {loading && <div className="h-full w-full bg-neutral/90 z-10 absolute flex flex-col justify-center items-center">
            <span className="text-3xl font-bold capitalize text-neutral-content">loading, please wait...</span>
          </div>}
      <Header />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}