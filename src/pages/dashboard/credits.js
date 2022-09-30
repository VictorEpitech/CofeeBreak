import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import ChargesAdd from "../../components/ChargesAdd";
import loadingAtom from "../../context/atoms/loadingAtom";
import { createConsumed, getCharges, recharge } from "../../utils/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Credits() {
  const [charges, setCharges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState();
  const setLoading = useSetRecoilState(loadingAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getCharges();
      const data = JSON.parse(res.data);
      console.log(data);
      setCharges(data.charges);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

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
            <table className="table w-full z-0">
              <thead>
                <tr>
                  <th>login</th>
                  <th>remaining charges</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((e) => (
                  <tr key={e._id}>
                    <td onClick={() => navigate(`/dashboard/credits/${e._id}`)}>
                      {e.email}
                    </td>
                    <td>{e.charges}</td>
                    <td className=" space-x-4">
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          setCurrentDoc(e);
                          setShowModal(true);
                        }}
                      >
                        <span className="uppercase">recharge</span>
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={async () => {
                          toast.loading("removing charge", { id: "delete" });
                          await recharge(e._id, -1);
                          await createConsumed({
                            date: new Date().toISOString(),
                            email: e.email,
                            consumedItems: 1,
                          });
                          toast.success("charge removed", { id: "delete" });
                        }}
                      >
                        <span className="uppercase">remove 1 credit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
