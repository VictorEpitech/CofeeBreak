import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import FundsAdd from "../../components/FundsAdd"
import { client } from "../../utils/client"

export default function DashboardFunds() {
  const [funds, setFunds] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(true)
  const router = useRouter()


  useEffect(() => {
    const getFunds = async() => {
      const data = await client.database.listDocuments(process.env.NEXT_PUBLIC_FUND_COLLECTION, undefined, 25, router.query.page ? (page - 1) * 25 : 0)
      if (data.total > 25) {
        console.log("should paginate")
      }
      setFunds(data.documents);
    }
    getFunds()
  }, [router, setFunds])

  return (
    <div className="w-full h-full relative">
      <FundsAdd isOpen={showModal} setIsOpen={setShowModal} />
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
          </tr>
        </thead>
        <tbody>
          {funds.map((e) => (
            <tr key={e.$id}>
              <th>{new Date(e.date).toLocaleDateString()}</th>
              <th>{e.amount}</th>
              <th>{e.reason ?? "N/A"}</th>
              <th>{e.totalAmount}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}