import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRecoilState } from "recoil"
import userAtom from "../context/atoms/userAtom"
import { client, login } from "../utils/client"

export default function Home() {
  const router = useRouter()
  const [u, setUser] = useRecoilState(userAtom)
  useEffect(() => {
    const checkForSignIn = async() => {
      try {
        const user = await client.account.get()
        toast.success(`welcome back, ${user.name}`)
        setUser(user);
        router.push("/dashboard")
      } catch (error) {
        
      }
    }
    checkForSignIn()
  }, [router, setUser])
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <h1 className="text-3xl font-bold mb-4">CoffeBreak Moulins</h1>
      <button className="btn btn-primary" onClick={() => login()}>Sign In</button>
    </div>
  )
}