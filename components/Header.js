import Link from "next/link"
import { useRecoilValue } from "recoil"
import userAtom from "../context/atoms/userAtom"

export default function Header() {
  const user = useRecoilValue(userAtom)
  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link passHref href={user ? "/dashboard" : "/"}><a className="btn btn-ghost normal-case text-xl">CofeeBreak</a></Link>
        </div>
        {
          user !== null &&
          <> 
            <div className="navbar-end">
            <ul className="menu menu-horizontal rounded-box">
              <li><Link href="/dashboard/funds">Funds</Link></li>
              <li><Link href="/dashboard/credits">Credits</Link></li>
              <li><Link href="/dashboard/consumes">Consume</Link></li>
              <li><Link href="/auth/out">Sign Out</Link></li>
            </ul>

            </div>
        </>
        }
        </div>
    </header>
  )
}

