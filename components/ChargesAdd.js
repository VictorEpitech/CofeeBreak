import { useFormik } from "formik";
import { clearPreviewData } from "next/dist/server/api-utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import payMethodsAtom from "../context/atoms/payMethods";
import AddChargeSchema from "../schemas/charges.add.schema";
import Input from "../components/Input";
import { addFunds, client, recharge } from "../utils/client";

export default function ChargesAdd({ isOpen, setIsOpen, doc }) {
  const payMethods = useRecoilValue(payMethodsAtom);
  const formik = useFormik({
    initialValues: {
      charges: 0,
      addToFunds: true,
      payment_method: "",
    },
    validationSchema: AddChargeSchema,
    onSubmit: async (values) => {
      toast.loading("updating charges", { id: "charges" });
      await recharge(doc._id, values.charges);
      toast.success("charges updated", { id: "charges" });
      if (values.addToFunds) {
        toast.loading("updating funds", { id: "funds" });
        await addFunds(
          new Date().toISOString(),
          process.env.NEXT_PUBLIC_CHARGE_VALUE * values.charges,
          values.payment_method,
          `${doc.email} recharge`
        );
        toast.success("funds updated", { id: "funds" });
        //TODO implement add to funds
      }
      setIsOpen(false);
    },
  });

  if (isOpen) {
    return (
      <div className=" w-full h-full absolute top-0 z-10">
        <div
          className="bg-black/70 w-full h-full flex flex-col justify-center items-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="card bg-base-100 w-96 shadow-xl z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body">
              <h2 className="card-title">Add / Remove funds</h2>
              <form onSubmit={formik.handleSubmit}>
                <Input
                  inputName="charges"
                  htmlFor="charges"
                  inputValue={formik.values.charges}
                  labelText="Charges"
                  error={formik.errors.charges}
                  onInputChange={formik.handleChange}
                  inputType="number"
                  inputPlaceholder="number of charges"
                  required
                />
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Add to Funds</span>
                    <input
                      type="checkbox"
                      name="addToFunds"
                      onChange={formik.handleChange}
                      checked={formik.values.addToFunds}
                      className="checkbox checkbox-primary"
                    />
                  </label>
                </div>
                <select
                  className="select select-bordered w-full max-w-x"
                  value={formik.values.payment_method}
                  name="payment_method"
                  id="payment_method"
                  onChange={formik.handleChange}
                >
                  <option value="">Select payment method</option>
                  {payMethods.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                {formik.errors.payment_method && (
                  <div className="text-red-500">
                    {formik.errors.payment_method}
                  </div>
                )}
                <div className="card-actions justify-end mt-3">
                  <button
                    className="btn btn-error"
                    onClick={() => {
                      setValue();
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
