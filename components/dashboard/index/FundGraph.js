import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { client, database } from "../../../utils/client";

export default function FundGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let offset = 0;
    let count = 0
    const getData = async () => {
      const tmp = [];
      while (true) {
        const d = await database.listDocuments(
          process.env.NEXT_PUBLIC_FUND_COLLECTION,
          undefined,
          100,
          100 * offset,
          undefined,
          undefined,
          ["date"],
          ["ASC"]
        );
        count += d.documents.length
        d.documents.forEach((element) => {
            if (tmp.length > 0 && new dayjs(element.date).isSame(tmp[tmp.length - 1]["date"], "day")) {
                tmp.pop()
                tmp.push(element)
            } else {
                tmp.push(element)
            }
        })
        //tmp.push(...d.documents);
        if (count === d.total) break;
        offset += 1;
      }
      setData(tmp);
    };
    if (data.length === 0) getData();
  }, [data]);

  return (
    <div style={{width:"100%", height:"300px"}}>
    <ResponsiveContainer>
    <LineChart data={data}>
      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
      <YAxis />
      <Tooltip labelFormatter={(label, payload) => {
        return new Date(label).toLocaleDateString()
      }} formatter={(value, name, props) => [value, "total"]} />
      <Line
        type="monotone"
        dataKey="totalAmount"
      />
    </LineChart>
    </ResponsiveContainer>
    </div>
  );
}
