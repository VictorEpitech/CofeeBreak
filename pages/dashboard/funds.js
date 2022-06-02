import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useRecoilValue, useSetRecoilState } from "recoil"
import FundsAdd from "../../components/FundsAdd"
import loadingAtom from "../../context/atoms/loadingAtom"
import payMethodsAtom from "../../context/atoms/payMethods"
import Trash from "../../icons/trash"
import { client } from "../../utils/client"

export default function DashboardFunds() {
  const [funds, setFunds] = useState([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const setLoading = useSetRecoilState(loadingAtom)
  const payMethods = useRecoilValue(payMethodsAtom);

  useEffect(() => {
    const getFunds = async () => {
      if (!router.query?.page) {
        router.push("/dashboard/funds?page=1", undefined, {shallow:true})
      }
      setLoading(true)
      const data = await client.database.listDocuments(process.env.NEXT_PUBLIC_FUND_COLLECTION, undefined, 25, router.query.page ? (router.query.page - 1) * 25 : 0, undefined, undefined, ["date"], ["ASC"])
      if (data.total > 25) {
        console.log("should paginate")
        setTotalPages(Math.floor(data.total / 25 + (data.total % 25 !== 0 ? 1 : 0)))
      }
      setFunds(data.documents);
      setTotalDocs(data.total)
      setLoading(false)
    }
    getFunds()
  }, [router, setFunds, setLoading])

  useEffect(() => {
    const unsub = client.subscribe(`collections.${process.env.NEXT_PUBLIC_FUND_COLLECTION}.documents`, (e) => {
      if (e.events.includes("collections.*.documents.*.delete")) {
        setFunds((old) => old.filter((x) => x.$id !== e.payload.$id))
      } else {
        setFunds((old) => [...old, e.payload])
      }
    })
    return () => unsub();
  })

  return (
    <div className="w-full h-full relative">
            {funds.length === 0 &&  <div className="w-full h-full flex flex-col justify-center items-center"><h3>No data here...</h3></div>}
      <FundsAdd isOpen={showModal} setIsOpen={setShowModal} latestAmount={funds[funds.length - 1]?.totalAmount || 0} />
{     (router.query?.page ?? 1) == totalPages && <button className="absolute btn btn-error bottom-10 right-5 rounded-full z-10" onClick={() => setShowModal(true)}>
        <span className="text-xl font-bold">+</span>
      </button>}
      {funds.length > 0 && <>
      <table className="table w-full z-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Origin</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((e, idx) => {
            return (
              <tr key={e.$id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.amount}</td>
                <td>{e.reason || "N/A"}</td>
                <td>{payMethods.find((p) => p.$id === e.method)?.name}</td>
                <td>{e.totalAmount}</td>
                <td>{(idx === funds.length - 1 && (router.query?.page == totalPages || totalPages === 1)) && <button className="btn btn-warning" onClick={async() => {
                  await client.database.deleteDocument(process.env.NEXT_PUBLIC_FUND_COLLECTION, e.$id);
                  toast.success("deleted document")
                }}><Trash /></button>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="w-full flex justify-center">

      <div className="btn-group">
          <button 
          className="btn" 
          onClick={() => {
            router.push(`/dashboard/funds?page=1`)
          }} 
          disabled={router.query?.page == 1 ?? true}>{"<<"}</button>
          <button 
          className="btn"
          onClick={() => {
            router.push(`/dashboard/funds?page=${parseInt(router.query?.page) - 1}`)
          }}
          disabled={router.query?.page < 2 ?? true}>{"<"}</button>
          <button className="btn btn-active">{router.query?.page || 1}</button>
          <button 
          className="btn"
          onClick={() => {
            router.push(`/dashboard/funds?page=${(parseInt(router.query.page) || 1) + 1}`)
          }}
          disabled={router.query?.page == totalPages}>{">"}</button>
          <button className="btn" disabled={router.query?.page == totalPages} onClick={() => {
            router.push(`/dashboard/funds?page=${totalPages}`, undefined)
          }}>{">>"}</button>
      </div>
      </div>
      </>}
    </div>
  )
}