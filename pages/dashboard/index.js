import { useState, useEffect } from "react"
import { client } from "../../utils/client"

export default function DashboardHome() {
  const [fund, setFund] = useState(0)

  useEffect(() => {
    const getFunds = (async() => {
      const fundData = await client.database.listDocuments(process.env.NEXT_PUBLIC_FUND_COLLECTION, undefined, 1, undefined, undefined, undefined, ["date"], ["DESC"])
      setFund(fundData.documents[0].totalAmount)
    })
    getFunds()
  }, [])

  return (
    <div className="w-full h-full">
      <div className="stats shadow-xl">
        <div className="stat">
          <div className="stat-title">Funds</div>
          <div className={`stat-value`}>{fund.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}