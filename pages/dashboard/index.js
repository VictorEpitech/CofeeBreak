import { Query } from "appwrite";
import { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ConsumeGraph from "../../components/dashboard/index/ConsumeGraph";
import FundGraph from "../../components/dashboard/index/FundGraph";
import StatBlock from "../../components/StatBlock";
import loadingAtom from "../../context/atoms/loadingAtom";
import payMethodsAtom from "../../context/atoms/payMethods";
import { client, database } from "../../utils/client";

export default function DashboardHome() {
  const [fundCash, setFundCash] = useState(0);
  const [fundLydia, setFundLydia] = useState(0);
  const [trackedUsers, setTrackedUsers] = useState(0);
  const [todayCharge, setTodayCharge] = useState(0);
  const setLoading = useSetRecoilState(loadingAtom);
  const payMethods = useRecoilValue(payMethodsAtom);


  useEffect(() => {
    const getFunds = async () => {
      setLoading(true);

      const trackedData = await database.listDocuments(process.env.NEXT_PUBLIC_CREDIT_COLLECTION)

      const today = new Date();
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      const todayCharge = await database.listDocuments(process.env.NEXT_PUBLIC_CONSUME_COLLECTION, [Query.greaterEqual("consumedAt", today.toISOString())], 100)



      setTodayCharge(todayCharge?.documents?.reduce((acc, value) => acc + value.consumedItems, 0) ?? 0);
      setTrackedUsers(trackedData.total);
      setLoading(false);
    };
    getFunds();
  }, [setLoading]);

  useEffect(() => {
    const getMoney = async() => {
      const fundData = await database.listDocuments(
        process.env.NEXT_PUBLIC_FUND_COLLECTION,
        undefined,
        100,
        undefined,
        undefined,
        undefined,
        ["date"],
        ["DESC"]
      );
      if (fundData.documents.length > 0) {
        const cashId = payMethods.find((e) => e.name === "cash")
        setFundCash(fundData.documents.filter((e) => e.method === cashId.$id).reduce((acc, prev) => acc + prev.amount, 0));
        const lydiaId = payMethods.find((e) => e.name === "lydia")
        setFundLydia(fundData.documents.filter((e) => e.method === lydiaId.$id).reduce((acc, prev) => acc + prev.amount, 0))
      }
    }

    if (payMethods.length > 0) {
      getMoney()
    }
  }, [payMethods])

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
      <div className="flex justify-center">
        <div className=" stats stats-vertical lg:stats-horizontal shadow-xl">
          <StatBlock title="Cash" value={fundCash} />
          <StatBlock title="Lydia" value={fundLydia} />
          <StatBlock value={trackedUsers} title="Tracked Users" />
          <StatBlock value={todayCharge} title="Consumed Today" />
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row lg:justify-evenly lg:space-x-4 mt-4">
        <div className="card bg-base-100 shadow-xl w-full">
          <div className="card-body">
            <h2 className="card-title">Funds Evolution</h2>
            <FundGraph />
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl w-full">
          <div className="card-body">
            <h2 className="card-title">Sales Evolution</h2>
            <ConsumeGraph />
          </div>
        </div>
      </div>
    </div>
  );
}
