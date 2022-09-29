import * as Yup from "yup";

const fundsAddSchema = Yup.object().shape({
  amount: Yup.number().required().not([0]),
  payment_method: Yup.string().required(),
  reason: Yup.string().when("amount", (amount, schema) =>
    amount < 0 ? Yup.string().required() : Yup.string()
  ),
});

export default fundsAddSchema;
