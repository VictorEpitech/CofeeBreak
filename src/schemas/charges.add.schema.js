import * as Yup from "yup";
const AddChargeSchema = Yup.object().shape({
  charges: Yup.number().positive().required(),
  addToFunds: Yup.boolean().required().default(true),
  payment_method: Yup.string().when("addToFunds", {
    is: true,
    then: Yup.string().required("please select a payment method"),
    otherwise: Yup.string().notRequired(),
  }),
});

export default AddChargeSchema;
