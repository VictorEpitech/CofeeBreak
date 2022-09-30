import * as Yup from "yup";

const chargesRemoveSchema = Yup.object().shape({
  charges: Yup.number().positive().required(),
});

export default chargesRemoveSchema;
