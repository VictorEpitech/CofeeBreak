import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../context/atoms/userAtom";

const links = [
  <li key="funds">
    <Link to="/dashboard/funds">Funds</Link>
  </li>,
  <li key="credits">
    <Link to="/dashboard/credits">Credits</Link>
  </li>,
  <li key="consumes">
    <Link to="/dashboard/consumes">Consume</Link>
  </li>,
  <li key="link">
    <Link to="/auth/link">Link Account</Link>
  </li>,
  <li key="out">
    <Link to="/auth/out">Sign Out</Link>
  </li>,
];

export default function Header() {
  const user = useRecoilValue(userAtom);
  return (
    <header>
      <div className="navbar bg-base-100">
        {user !== null && (
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {links}
              {"NDEFReader" in window && (
                <li>
                  <Link to="/dashboard/scan">Scan</Link>
                </li>
              )}
            </ul>
          </div>
        )}
        <div className="flex-1">
          <Link to={user ? "/dashboard" : "/"}>
            <button className="btn btn-ghost normal-case text-xl">
              CofeeBreak
            </button>
          </Link>
        </div>
        {user !== null && (
          <>
            <div className="navbar-end hidden lg:flex">
              <ul className="menu menu-vertical lg:menu-horizontal rounded-box">
                {links}
                {"NDEFReader" in window && (
                  <li>
                    <Link to="/dashboard/scan">Scan</Link>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
