import { useEffect } from "react";
import { link } from "../../utils/client";

export default function Link() {
  useEffect(() => {
    link().then((res) => {
      const data = JSON.parse(res.data);
      window.location.href = data.url;
    });
  }, []);

  return <div></div>;
}
