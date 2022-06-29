import { useRouter } from "next/router"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useRecoilState } from "recoil"
import userAtom from "../../context/atoms/userAtom"
import { client, account } from "../../utils/client"


export default function SuccessAuth() {
  const router = useRouter()
  const [user, setUser] = useRecoilState(userAtom)
  useEffect(() => {
    const getUser = async() => {
      try {
        const u = await account.get()
        setUser(u)
        router.push("/dashboard")
      } catch (error) {
        toast.error("something went wrong")
        console.error(error)
        router.push("/")
      }
    }
    getUser()
  }, [router, setUser])
  return (
    <div>

    </div>
  )
}