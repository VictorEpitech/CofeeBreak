import { useState, useEffect, useMemo } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import { useSetRecoilState } from "recoil";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import loadingAtom from "../../context/atoms/loadingAtom";
import { getConsumed } from "../../utils/client";

export default function Consumes() {
  const [consumed, setConsumed] = useState([]);
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
  }, [setConsumed, setLoading]);

  const columns = useMemo(() => {
    return [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Login",
        accessor: "email",
      },
      {
        Header: "Items",
        accessor: "total",
      },
    ];
  }, []);

  const data = useMemo(() => {
    return consumed.map((e) => ({
      date: new Date(e.date).toLocaleDateString(),
      email: e.email,
      total: e.consumedItems,
    }));
  }, [consumed]);

  const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

  return (
    <div className="w-full h-full relative">
      {consumed.length === 0 && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h3>No data here...</h3>
        </div>
      )}
      {consumed.length > 0 && (
        <>
          <Table tableInstance={tableInstance} />
        </>
      )}
    </div>
  );
}
