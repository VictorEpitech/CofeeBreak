import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useSetRecoilState } from "recoil"
import ChargesAdd from "../../components/CreditsAdd"
import loadingAtom from "../../context/atoms/loadingAtom"
import { client } from "../../utils/client"

export default function Credits() {

  const [charges, setCharges] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentDoc, setCurrentDoc] = useState()
  const router = useRouter()
  const setLoading = useSetRecoilState(loadingAtom)


  useEffect(() => {
    const getCharges = async() => {
      setLoading(true)
      const data = await client.database.listDocuments(process.env.NEXT_PUBLIC_CREDIT_COLLECTION, undefined, 25, router.query.page ? (page - 1) * 25 : 0, undefined, undefined)
      if (data.total > 25) {
        console.log("should paginate")
      }
      setCharges(data.documents);
      setLoading(false)
    }
    getCharges()
  }, [router, setLoading])

  useEffect(() => {
    const subscription = client.subscribe(`collections.${process.env.NEXT_PUBLIC_CREDIT_COLLECTION}.documents`, (e) => {
      console.log(e);
      if (e.event === "database.documents.update") {
        console.log(e.payload)
        setCharges((old) => {
          let newData = [...old];
          const changeIndex = newData.findIndex((x) => x.$id === e.payload.$id);
          if (changeIndex > -1) {
            newData[changeIndex] = {...e.payload}
          }
          return newData
        })
      } 
    });
    return () => subscription()
  }, [])

  return (
    <div className="h-full w-full relative">
      <ChargesAdd isOpen={showModal} setIsOpen={setShowModal} doc={currentDoc} />
      {charges.length === 0 &&  <div className="w-full h-full flex flex-col justify-center items-center"><h3>No data here...</h3></div>}
      {charges.length > 0 && <>
      <table className="table w-full z-0">
        <thead>
          <tr>
            <th>login</th>
            <th>remaining charges</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {charges.map((e) => (
            <tr key={e.$id}>
              <th>{e.email}</th>
              <th>{e.charges}</th>
              <th>
                <button
                  className="btn btn-primary" 
                  onClick={async() => {
                    setCurrentDoc(e);
                    setShowModal(true)
                  }}
                >
                  <span className="uppercase">recharge</span>
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      </>}
    </div>
  )
}