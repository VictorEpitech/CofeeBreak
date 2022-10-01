import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getFunds } from "../../../utils/client";

export default function FundGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const tmp = [];
      const d = JSON.parse((await getFunds()).data).funds.reverse();
      d.forEach((element) => {
        if (
          tmp.length > 0 &&
          new dayjs(element.date).isSame(tmp[tmp.length - 1]["date"], "day")
        ) {
          tmp.pop();
          tmp.push(element);
        } else {
          tmp.push(element);
        }
      });
      setData(tmp);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <div className="w-1/3 text-center">
          <h2>Loading, please wait...</h2>
          <div className="flex items-center justify-center mt-5">
            <div className="w-24 h-24 border-l-2 border-current rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label, payload) => {
              return new Date(label).toLocaleDateString();
            }}
            formatter={(value, name, props) => [value, "total"]}
          />
          <Line type="monotone" dataKey="totalAmount" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
