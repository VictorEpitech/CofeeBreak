import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import loadingAtom from "../context/atoms/loadingAtom";
import payMethodsAtom from "../context/atoms/payMethods";
import userAtom from "../context/atoms/userAtom";
import { getPaymentMethods, verify } from "../utils/client";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
  const [user, setUser] = useRecoilState(userAtom);
  const [payMethods, setPayMethods] = useRecoilState(payMethodsAtom);
  const loading = useRecoilValue(loadingAtom);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("coffee-token");
      if (token) {
        const res = await verify(token);
        const data = JSON.parse(res.data);
        setUser(data);
      } else {
        toast.error("could not authenticate you, please sign in again");
        navigate("/", { replace: true });
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("coffee-token");
      if (token) {
        const res = await verify(token);
        const data = JSON.parse(res.data);
        setUser(data);
      } else {
        toast.error("could not authenticate you, please sign in again");
        navigate("/", { replace: true });
      }
    };
    const getPayMethods = async () => {
      const res = await getPaymentMethods();
      const data = JSON.parse(res.data);
      setPayMethods(data.payments);
    };
    if (location.pathname !== "/") {
      getUser();
      getPayMethods();
    }
  }, [location, setPayMethods, setUser]);

  return (
    <div id="root" className="relative">
      {loading && (
        <div className="h-full w-full bg-neutral/90 z-10 absolute flex flex-col justify-center items-center">
          <span className="text-3xl font-bold capitalize text-neutral-content">
            loading, please wait...
          </span>
        </div>
      )}
      <Header />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
}