import { atom } from "recoil";

const payMethodsAtom = atom({
  default: [],
  key:"payMethods"
})

export default payMethodsAtom