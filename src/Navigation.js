import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/index";
import Funds from "./pages/dashboard/funds";
import Consumes from "./pages/dashboard/consumes";
import Credits from "./pages/dashboard/credits";
import AuthOut from "./pages/auth/out";

export default function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/out" element={<AuthOut />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/funds" element={<Funds />} />
      <Route path="/dashboard/consumes" element={<Consumes />} />
      <Route path="/dashboard/credits" element={<Credits />} />
    </Routes>
  );
}
