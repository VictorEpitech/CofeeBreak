import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
//import Image from "../../components/Image";
import Input from "../../components/Input";
import loadingAtom from "../../context/atoms/loadingAtom";
import chargesRemoveSchema from "../../schemas/charges.remove.schema";
import { createConsumed, getCharge, recharge } from "../../utils/client";

export default function CreditsDetails() {
  const { id } = useParams();
  const [charge, setCharge] = useState(null);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const formik = useFormik({
    initialValues: {
      charges: 1,
    },
    validationSchema: chargesRemoveSchema,
    onSubmit: async (values) => {
      toast.loading("updating charges", { id: "update" });
      await recharge(charge._id, -values.charges);
      await createConsumed({
        date: new Date().toISOString(),
        email: charge.email,
        consumedItems: values.charges,
      });
      toast.success("charges updated", { id: "update" });
    },
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await getCharge(id);
      const data = JSON.parse(res.data);
      setCharge(data.charge);
      setLoading(false);
    };
    if (id) {
      getData();
    }
  }, [id, setLoading]);

  if (loading || !charge) {
    return (
      <div>
        <p>loading</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-evenly">
        {/* <Image
          alt={charge.email}
          src={`https://intra.epitech.eu/file/userprofil/profilview/${charge.email}.jpg`}
        /> */}
        <div className="bg-base-100 card shadow-xl lg:w-1/3 mb-4">
          <div className="card-body">
            <p>
              <span className="font-semibold">First Name</span>:{" "}
              {charge?.email?.split(".")[0]?.replace("1", "")}
            </p>
            <p>
              <span className="font-semibold">Last Name</span>:{" "}
              {charge?.email.split(".")[1]?.split("@")[0]}
            </p>
            <p>
              <span className="font-semibold">Email</span>: {charge.email}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <p className="text-2xl font-bold">charges left: {charge?.charges}</p>
      </div>
      <div className="w-full card shadow-lg bg-base-100">
        <form onSubmit={formik.handleSubmit}>
          <div className="card-body">
            <h2 className="card-title">Update charges</h2>
            <Input
              error={formik.errors.charges}
              htmlFor="charges"
              inputName="charges"
              inputValue={formik.values.charges}
              labelText="Charges to remove"
              onInputChange={formik.handleChange}
              inputPlaceholder="charges here"
              inputType="number"
            />
            <button
              disabled={charge?.charges - formik.values.charges < 0}
              className="mt-3 btn btn-primary btn-block"
              type="submit"
            >
              Submit
            </button>
            {charge.charges - formik.values.charges < 0 && (
              <div className="text-red-500">
                cannot remove more charges than those owned by the user
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
