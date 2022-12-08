import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { usePagination, useSortBy, useTable } from "react-table";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import FundsAdd from "../../components/FundsAdd";
import Table from "../../components/Table";
import loadingAtom from "../../context/atoms/loadingAtom";
import payMethodsAtom from "../../context/atoms/payMethods";
import Trash from "../../icons/trash";
import { deleteFunds, getFunds } from "../../utils/client";

export default function DashboardFunds() {
  const [funds, setFunds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const setLoading = useSetRecoilState(loadingAtom);
  const payMethods = useRecoilValue(payMethodsAtom);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getFunds();
      const data = JSON.parse(res.data);
      setFunds(data.funds);
      setLoading(false);
    };
    getData();
  }, [setFunds, setLoading]);

  const data = useMemo(() => {
    return funds.map((e, idx) => ({
      date: new Date(e.date).toLocaleDateString(),
      amount: e.amount,
      reason: e.reason || "N/A",
      totalAmount: e.totalAmount.toFixed(2),
      method: payMethods.find((p) => p._id === e.payment_method)?.name,
      actions:
        idx === 0
          ? [
              <button
                key="delete"
                className="btn btn-warning"
                onClick={async () => {
                  const response = await Swal.fire({
                    title: "Are you sure?",
                    text: "You are about to delete this record",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                  });
                  if (response.isConfirmed) {
                    toast.loading("deleting document", {
                      id: "delete",
                    });
                    await deleteFunds(e._id);
                    toast.success("deleted document", {
                      id: "delete",
                    });
                  }
                }}
              >
                <Trash />
              </button>,
            ]
          : [],
    }));
  }, [funds, payMethods]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Reason",
        accessor: "reason",
      },
      {
        Header: "Method",
        accessor: "method",
      },
      {
        Header: "Total",
        accessor: "totalAmount",
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

  return (
    <div className="w-full h-full relative">
      {funds.length === 0 && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h3>No data here...</h3>
        </div>
      )}
      <FundsAdd isOpen={showModal} setIsOpen={setShowModal} />

      <button
        className=" fixed btn btn-error bottom-10 right-5 rounded-full z-10"
        onClick={() => setShowModal(true)}
      >
        <span className="text-xl font-bold">+</span>
      </button>
      <Table tableInstance={tableInstance} />
    </div>
  );
}
