import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { scan } from "../utils/client";
import * as nfcRead from "../lottie/nfc-read-loading.json";
import * as nfcReading from "../lottie/nfc-processing.json";
import * as nfcSuccess from "../lottie/nfc-successful.json";
import * as nfcFail from "../lottie/nfc-fail.json";

export default function Scan() {
  const navigate = useNavigate();
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animation, setAnimation] = useState(nfcRead);
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
  }, [navigate, setIsLoading]);

  useEffect(() => {
    if (info) {
      setAnimation(nfcReading);
      const trad = info.replaceAll(":", "").toUpperCase();
      scan(trad)
        .then((res) => {
          setAnimation(nfcSuccess);
          const data = JSON.parse(res.data);
          navigate(`/dashboard/credits/${data.charge._id}`);
        })
        .catch((err) => {
          toast.error("could not read card");
          console.log(err);
          setAnimation(nfcFail);
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
            setAnimation(nfcRead);
            setIsLoading(true);
          } catch (error) {
            toast.error("could not scan nfc code");
          }
        }}
      >
        SCAN
      </button>
      {isLoading && <div>Please wait, we're scanning for cards...</div>}
      {isLoading && <Player autoplay loop src={animation} />}
      {info}
    </div>
  );
}
