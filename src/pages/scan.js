import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { scan } from "../utils/client";

export default function Scan() {
  const navigate = useNavigate();
  const [info, setInfo] = useState("");
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
        onClick={async () => {
          await scanner.current.scan();
        }}
      >
        SCAN
      </button>
      {info}
    </div>
  );
}
