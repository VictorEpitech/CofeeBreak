import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Scan() {
  const navigate = useNavigate();
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!("NDEFReader" in window)) {
      toast.error("nfc must be enabled to view this content");
      navigate("/dashboard");
    }
  });
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <button
        onClick={async () => {
          const ndef = new window.NDEFReader();
          await ndef.scan();
          ndef.onreading = (event) => {
            setInfo(event.serialNumber);
            console.log("NDEF message read.");
          };
        }}
      >
        SCAN
      </button>
      {info}
    </div>
  );
}
