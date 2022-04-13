import { atom } from "recoil"

const loadingAtom = atom({
  default: true,
  key: 'loading'
})

export default loadingAtom;