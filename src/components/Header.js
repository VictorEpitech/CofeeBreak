import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../context/atoms/userAtom";

export default function Header() {
  const user = useRecoilValue(userAtom);
  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to={user ? "/dashboard" : "/"}>
            <button className="btn btn-ghost normal-case text-xl">
              CofeeBreak
            </button>
          </Link>
        </div>
        {user !== null && (
          <>
            <div className="navbar-end">
              <ul className="menu menu-vertical lg:menu-horizontal rounded-box">
                <li>
                  <Link to="/dashboard/funds">Funds</Link>
                </li>
                <li>
                  <Link to="/dashboard/credits">Credits</Link>
                </li>
                <li>
                  <Link to="/dashboard/consumes">Consume</Link>
                </li>
                <li>
                  <Link to="/auth/out">Sign Out</Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
