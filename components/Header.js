import Link from "next/link"
import { useRecoilValue } from "recoil"
import userAtom from "../context/atoms/userAtom"
import User from "../icons/user"

export default function Header() {
  const user = useRecoilValue(userAtom)
  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link passHref href="/"><a className="btn btn-ghost normal-case text-xl">CofeeBreak</a></Link>
        </div>
        {
          user !== null &&
          <> 
            <div className="navbar-end">
            <ul className="menu menu-horizontal rounded-box">
              <li><Link href="/dashboard/funds">Funds</Link></li>
              <li><Link href="">Credits</Link></li>
              <li><Link href="">Consume</Link></li>
            </ul>
              <div className="dropdown dropdown-end">
                <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <User className="w-full" />
                  </div>
                </label>
                <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a>Logout</a></li>
                </ul>
              </div>
            </div>
        </>
        }
        </div>
    </header>
  )
}

