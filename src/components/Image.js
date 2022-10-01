//import { useEffect, useState } from "react";

export default function Image(props) {
  //const [blob, setBlob] = useState("");

  //useEffect(() => {}, [src]);

  //if (!blob) return null;

  return <img {...props} alt={props.alt} />;
}
