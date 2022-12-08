import axios from "axios";
//import { useState, useEffect } from "react";
//import { useRecoilValue } from "recoil";
//import userAtom from "../context/atoms/userAtom";

export default function Image(props) {
  return <img {...props} alt={props.alt} />;
}
