import { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ConsumeGraph from "../../components/dashboard/index/ConsumeGraph";
import FundGraph from "../../components/dashboard/index/FundGraph";
import StatBlock from "../../components/StatBlock";
import loadingAtom from "../../context/atoms/loadingAtom";
import payMethodsAtom from "../../context/atoms/payMethods";
import { getCharges, getConsumed, getFunds } from "../../utils/client";

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

      const trackedData = JSON.parse((await getCharges()).data);

      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      const todayCharge = JSON.parse(
        (await getConsumed()).data
      ).consumed?.filter((e) => e.consumedAt >= today.toISOString);

      setTodayCharge(
        todayCharge?.documents?.reduce(
          (acc, value) => acc + value.consumedItems,
          0
        ) ?? 0
      );
      setTrackedUsers(trackedData.charges.length);
      setLoading(false);
    };
    getFunds();
  }, [setLoading]);

  useEffect(() => {
    const getMoney = async () => {
      const fundData = JSON.parse((await getFunds()).data).funds;

      const cashId = payMethods.find((e) => e.name === "cash");
      setFundCash(
        fundData
          .filter((e) => e.payment_method === cashId._id)
          .reduce((acc, prev) => acc + prev.amount, 0)
      );
      const lydiaId = payMethods.find((e) => e.name === "lydia");
      setFundLydia(
        fundData
          .filter((e) => e.payment_method === lydiaId._id)
          .reduce((acc, prev) => acc + prev.amount, 0)
      );
    };

    if (payMethods.length > 0) {
      getMoney();
    }
  }, [payMethods]);

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
      <div>{"NDEFReader" in window && <button>scan me</button>}</div>
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
