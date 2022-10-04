import { useState, useEffect, useMemo } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import { useSetRecoilState } from "recoil";
import Pagination from "../../components/Pagination";
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex },
  } = tableInstance;

  return (
    <div className="w-full h-full relative">
      {consumed.length === 0 && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h3>No data here...</h3>
        </div>
      )}
      {consumed.length > 0 && (
        <>
          <table className="table w-full z-0" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}{" "}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            gotoPage={gotoPage}
            nextPage={nextPage}
            pageCount={pageCount}
            pageOptions={pageOptions}
            previousPage={previousPage}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
          />
        </>
      )}
    </div>
  );
}
