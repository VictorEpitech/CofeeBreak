import { atom } from "recoil"

const loadingAtom = atom({
  default: false,
  key: 'loading'
})

export default loadingAtom;