import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import loadingAtom from "../../context/atoms/loadingAtom";
import { getConsumed } from "../../utils/client";

export default function Consumes() {
  const [consumed, setConsumed] = useState([]);
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getConsumed();
      const data = JSON.parse(res.data);
      setConsumed(data.consumed);
      setLoading(false);
    };
    getData();
  }, [router, setConsumed, setLoading]);

  return (
    <div className="w-full h-full relative">
      {consumed.length === 0 && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h3>No data here...</h3>
        </div>
      )}
      {consumed.length > 0 && (
        <>
          <table className="table w-full z-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {consumed.map((e) => {
                return (
                  <tr key={e._id}>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.email}</td>
                    <td>{e.consumedItems}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
