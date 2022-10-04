import { useState, useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import ChargesAdd from "../../components/ChargesAdd";
import loadingAtom from "../../context/atoms/loadingAtom";
import { getCharges } from "../../utils/client";
import { Link } from "react-router-dom";
import { usePagination, useSortBy, useTable } from "react-table";
import Pagination from "../../components/Pagination";

export default function Credits() {
  const [charges, setCharges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState();
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getCharges();
      const data = JSON.parse(res.data);
      setCharges(data.charges);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const columns = useMemo(() => {
    return [
      {
        Header: "Login",
        accessor: "email",
      },
      {
        Header: "Remaining Charges",
        accessor: "charges",
      },
      {
        Header: "Recharge",
        accessor: "recharge",
      },
      {
        Header: "Details",
        accessor: "details",
      },
    ];
  }, []);

  const data = useMemo(() => {
    return charges.map((e) => ({
      _id: e._id,
      email: e.email,
      charges: e.charges,
      recharge: (
        <button
          key="charge"
          className="btn btn-primary"
          onClick={async () => {
            setCurrentDoc(e);
            setShowModal(true);
          }}
        >
          <span className="uppercase">recharge</span>
        </button>
      ),
      details: (
        <Link to={`/dashboard/credits/${e._id}`} className="btn btn-info">
          details
        </Link>
      ),
    }));
  }, [charges]);

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
    <>
      <div className="h-full w-full relative">
        <ChargesAdd
          isOpen={showModal}
          setIsOpen={setShowModal}
          doc={currentDoc}
        />
        {charges.length === 0 && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <h3>No data here...</h3>
          </div>
        )}
        {charges.length > 0 && (
          <>
            <table className="table w-full z-0" {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
    </>
  );
}
