import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { scan } from "../utils/client";

export default function Scan() {
  const navigate = useNavigate();
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scanner = useRef();

  useEffect(() => {
    if (!("NDEFReader" in window)) {
      toast.error("nfc must be enabled to view this content");
      navigate("/dashboard");
    }
    if (!scanner.current) {
      scanner.current = new window.NDEFReader();
      scanner.current.onreading = (event) => {
        setInfo(event.serialNumber);
        setIsLoading(false);
      };
    }
  }, [navigate]);

  useEffect(() => {
    if (info) {
      const trad = info.replaceAll(":", "").toUpperCase();
      scan(trad).then((res) => {
        const data = JSON.parse(res.data);
        navigate(`/dashboard/credits/${data.charge._id}`);
      });
    }
  }, [info, navigate]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <button
        disabled={isLoading}
        onClick={async () => {
          try {
            await scanner.current.scan();
            setIsLoading(true);
          } catch (error) {
            toast.error("could not scan nfc code");
          }
        }}
      >
        SCAN
      </button>
      {isLoading && <div>Please wait, we're scanning for cards...</div>}
      {info}
    </div>
  );
}
