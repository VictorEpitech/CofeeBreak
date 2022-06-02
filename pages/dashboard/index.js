import { Query } from "appwrite";
import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import loadingAtom from "../../context/atoms/loadingAtom";
import { client } from "../../utils/client";

export default function DashboardHome() {
  const [fund, setFund] = useState(0);
  const [trackedUsers, setTrackedUsers] = useState(0);
  const [todayCharge, setTodayCharge] = useState(0);
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    const getFunds = async () => {
      setLoading(true);
      const fundData = await client.database.listDocuments(
        process.env.NEXT_PUBLIC_FUND_COLLECTION,
        undefined,
        1,
        undefined,
        undefined,
        undefined,
        ["date"],
        ["DESC"]
      );
      const trackedData = await client.database.listDocuments(process.env.NEXT_PUBLIC_CREDIT_COLLECTION)
      if (fundData.documents.length > 0) {
        setFund(fundData.documents[0].totalAmount);
      }
      const today = new Date();
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      const todayCharge = await client.database.listDocuments(process.env.NEXT_PUBLIC_CONSUME_COLLECTION, [Query.greaterEqual("consumedAt", today.toISOString())], 100)



      setTodayCharge(todayCharge?.documents?.reduce((acc, value) => acc + value.consumedItems, 0) ?? 0);
      setTrackedUsers(trackedData.total);
      setLoading(false);
    };
    getFunds();
  }, [setLoading]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)

    const todaySub = client.subscribe(`collections.${process.env.NEXT_PUBLIC_CONSUME_COLLECTION}.documents`, (e) => {
      if (e.events.includes(`collections.${process.env.NEXT_PUBLIC_CONSUME_COLLECTION}.documents.*.create`)) {
        if (e.payload.consumedAt >= today.toISOString()) {
          setTodayCharge((c) => c + 1)
        }
      }
    })

    const trackedSub = client.subscribe(`collections.${process.env.NEXT_PUBLIC_CONSUME_COLLECTION}.documents`, (e) => {
      if (e.events.includes(`collections.${process.env.NEXT_PUBLIC_CONSUME_COLLECTION}.documents.*.create`)) {
        setTrackedUsers((t) => t + 1)
      }
    })

    const fundsSub = client.subscribe( `collections.${process.env.NEXT_PUBLIC_FUND_COLLECTION}.documents` ,(e) => {
      if (e.events.includes(`collections.${process.env.NEXT_PUBLIC_FUND_COLLECTION}.documents.*.create`)) {
        setFund(e.payload.totalAmount)
      }
    })

    return () => {
      todaySub()
      trackedSub()
      fundsSub()
    }
  })

  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-evenly">
        <div className="stats shadow-xl">
          <div className="stat">
            <div className="stat-title">Funds</div>
            <div className={`stat-value`}>{fund.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-xl">
          <div className="stat">
            <div className="stat-title">Tracked Users</div>
            <div className={`stat-value`}>{trackedUsers}</div>
          </div>
        </div>
        <div className="stats shadow-xl">
          <div className="stat">
            <div className="stat-title">Cofees Consumed Today</div>
            <div className={`stat-value`}>{todayCharge}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
