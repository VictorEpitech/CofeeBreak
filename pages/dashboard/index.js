import { useState, useEffect } from "react"
import { useSetRecoilState } from "recoil"
import loadingAtom from "../../context/atoms/loadingAtom"
import { client } from "../../utils/client"

export default function DashboardHome() {
  const [fund, setFund] = useState(0)
  const setLoading = useSetRecoilState(loadingAtom)

  useEffect(() => {
    const getFunds = (async() => {
      setLoading(true)
      const fundData = await client.database.listDocuments(process.env.NEXT_PUBLIC_FUND_COLLECTION, undefined, 1, undefined, undefined, undefined, ["date"], ["DESC"])
      if (fundData.documents.length > 0) {
        setFund(fundData.documents[0].totalAmount)
      }
      setLoading(false);
    })
    getFunds()
  }, [setLoading])

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