import { useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../context/atoms/userAtom";
import { client } from "../utils/client";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({children}) {

  const [user, setUser] = useRecoilState(userAtom); 

  useEffect(() => {
    const getUser = async() => {
      try {
        const u = await client.account.get()
        setUser(u)
      } catch (error) {
      }
    }
    getUser()
  }, [setUser])

  return (
    <div id="root">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}