import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import loadingAtom from "../../context/atoms/loadingAtom";
import { client, database } from "../../utils/client";
import Pagination from "../../components/Pagination";

export default function Consumes() {
  const [consumed, setConsumed] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    const getConsumed = async () => {
      setLoading(true);
      if (!router.query?.page) {
        router.push("/dashboard/consumes?page=1", undefined, { shallow: true });
      }
      const data = await database.listDocuments(
        process.env.NEXT_PUBLIC_CONSUME_COLLECTION,
        undefined,
        25,
        router.query.page ? (router.query.page - 1) * 25 : 0,
        undefined,
        undefined,
        ["consumedAt"],
        ["DESC"]
      );
      if (data.total > 25) {
        console.log("should paginate");
        setTotalPages(
          Math.floor(data.total / 25 + (data.total % 25 !== 0 ? 1 : 0))
        );
      }
      setConsumed(data.documents);
      setTotalDocs(data.total);
      setLoading(false);
    };
    getConsumed();
  }, [router, setConsumed, setLoading]);

  useEffect(() => {
    const subscription = client.subscribe(
      `collections.${process.env.NEXT_PUBLIC_CONSUME_COLLECTION}.documents`,
      (e) => {
        console.log(e);
        if (e.events.includes("collections.*.documents.*.update")) {
          console.log(e.payload);
          setConsumed((old) => {
            let newData = [...old];
            const changeIndex = newData.findIndex(
              (x) => x.$id === e.payload.$id
            );
            if (changeIndex > -1) {
              newData[changeIndex] = { ...e.payload };
            }
            return newData;
          });
        }
        if (e.events.includes("collections.*.documents.*.create")) {
          setConsumed((old) => [...old, e.payload]);
        }
      }
    );
    return () => subscription();
  }, []);

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
                  <tr key={e.$id}>
                    <td>{new Date(e.consumedAt).toLocaleDateString()}</td>
                    <td>{e.email}</td>
                    <td>{e.consumedItems}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            url="/dashboard/consumes"
            totalPages={totalPages}
            router={router}
          />
        </>
      )}
    </div>
  );
}
