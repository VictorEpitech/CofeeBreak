import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import Input from "../components/Input";
import payMethodsAtom from "../context/atoms/payMethods";
import fundsAddSchema from "../schemas/funds.add.schema";
import { addFunds } from "../utils/client";

export default function FundsAdd({ isOpen, setIsOpen }) {
  const payMethods = useRecoilValue(payMethodsAtom);
  const formik = useFormik({
    initialValues: {
      amount: 0,
      reason: "",
      payment_method: "",
    },
    validationSchema: fundsAddSchema,
    onSubmit: async (values) => {
      toast.loading("updating funds", { id: "funds" });
      await addFunds(
        new Date().toISOString(),
        values.amount,
        values.payment_method,
        values.reason
      );
      toast.success("funds updated", { id: "funds" });
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
                  htmlFor="amount"
                  error={formik.errors.amount}
                  inputName="amount"
                  inputValue={formik.values.amount}
                  labelText="Amount"
                  onInputChange={formik.handleChange}
                  inputPlaceholder="amount"
                  inputType="number"
                  required
                />
                <div className=" form-control">
                  <label className="label">
                    <span className="label-text">Payment Method</span>
                  </label>
                  <select
                    className="select select-bordered w-full max-w-x"
                    name="payment_method"
                    id="payment_method"
                    value={formik.values.payment_method}
                    onChange={formik.handleChange}
                  >
                    <option disabled value="">
                      Select payment method
                    </option>
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
                </div>
                <Input
                  htmlFor="reason"
                  error={formik.errors.reason}
                  inputName="reason"
                  inputValue={formik.values.reason}
                  labelText="Reason"
                  onInputChange={formik.handleChange}
                  inputPlaceholder="reason"
                  inputType="text"
                />

                <div className="card-actions justify-end mt-3">
                  <button
                    className="btn btn-error"
                    onClick={() => {
                      setValue();
                      setReason("");
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
