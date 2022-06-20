import { useRouter } from "next/router"
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../../context/atoms/userAtom";
import { client } from "../../utils/client";

export default function Out() {

    const router = useRouter();
    const setUser = useSetRecoilState(userAtom);

    useEffect(() => {
        client.account.deleteSession("current").finally(() => {
            toast.success("bye!")
            setUser(null)
            router.push("/")
        })
    }, [router, setUser])
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h2>Signing you out</h2>
            <p>please wait...</p>
        </div>
    )
}