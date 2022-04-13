import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import FundsAdd from "../../components/FundsAdd"
import Trash from "../../icons/trash"
import { client } from "../../utils/client"

export default function DashboardFunds() {
  const [funds, setFunds] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()


  useEffect(() => {
    const getFunds = async() => {
      const data = await client.database.listDocuments(process.env.NEXT_PUBLIC_FUND_COLLECTION, undefined, 25, router.query.page ? (page - 1) * 25 : 0, undefined, undefined, ["date"], ["ASC"])
      if (data.total > 25) {
        console.log("should paginate")
      }
      setFunds(data.documents);
    }
    getFunds()
  }, [router, setFunds])

  useEffect(() => {
    const unsub = client.subscribe(`collections.${process.env.NEXT_PUBLIC_FUND_COLLECTION}.documents`, (e) => {
      if (e.event === "database.documents.delete") {
        setFunds((old) => old.filter((x) => x.$id !== e.payload.$id))
      } else {
        setFunds((old) => [...old, e.payload])
      }
    })
    return () => unsub();
  })

  return (
    <div className="w-full h-full relative">
      <FundsAdd isOpen={showModal} setIsOpen={setShowModal} latestAmount={funds[funds.length - 1]?.totalAmount || 0} />
      <button className="absolute btn btn-error bottom-10 right-5 rounded-full" onClick={() => setShowModal(true)}>
        <span className="text-xl font-bold">+</span>
      </button>
      <table className="table w-full z-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Total Funds</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((e, idx) => (
            <tr key={e.$id}>
              <th>{new Date(e.date).toLocaleDateString()}</th>
              <th>{e.amount}</th>
              <th>{e.reason ?? "N/A"}</th>
              <th>{e.totalAmount.toFixed(2)}</th>
{             idx === funds.length - 1 && <th>
                <button className="btn btn-error" onClick={async() => {
                  if (confirm("want to delete this element?")) {
                    try {
                      await client.database.deleteDocument(process.env.NEXT_PUBLIC_FUND_COLLECTION, e.$id)
                      toast.success("element deleted")
                    } catch (error) {
                      toast.error("something went wrong")
                      console.error(error)
                    }
                  }
                }}>
                  <div className="w-5">
                  <Trash />
                  </div>
                </button>
              </th>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}