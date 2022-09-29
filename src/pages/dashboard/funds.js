import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import FundsAdd from "../../components/FundsAdd";
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

  return (
    <div className="w-full h-full relative">
      {funds.length === 0 && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h3>No data here...</h3>
        </div>
      )}
      <FundsAdd isOpen={showModal} setIsOpen={setShowModal} />

      <button
        className="absolute btn btn-error bottom-10 right-5 rounded-full z-10"
        onClick={() => setShowModal(true)}
      >
        <span className="text-xl font-bold">+</span>
      </button>
      {funds.length > 0 && (
        <>
          <table className="table w-full z-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Origin</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((e, idx) => {
                return (
                  <tr key={e._id}>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.amount}</td>
                    <td>{e.reason || "N/A"}</td>
                    <td>
                      {payMethods.find((p) => p._id === e.payment_method)?.name}
                    </td>
                    <td>{e.totalAmount}</td>
                    <td>
                      {idx === 0 && (
                        <button
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
                        </button>
                      )}
                    </td>
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
