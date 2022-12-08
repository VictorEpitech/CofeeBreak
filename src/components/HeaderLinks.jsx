import { Link } from "react-router-dom";

export const links = [
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
