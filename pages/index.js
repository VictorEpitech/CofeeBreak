/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { login } from "../utils/client";
import loginSchema from "../schemas/login.schema";
import Input from "../components/Input";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../context/atoms/userAtom";

export default function Home() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      toast.loading("signing in", { id: "login" });
      try {
        const res = await login(values);
        const data = JSON.parse(res.data);
        setUser({ user: data.user, token: data.token });
        localStorage.setItem("coffee-token", data.token);
        toast.success("welcome back", { id: "login" });
      } catch (error) {
        toast.error("something went wrong. Try again later", { id: "login" });
      }
      console.log(values);
    },
  });
  const setUser = useSetRecoilState(userAtom);
  return (
    <div className="flex justify-evenly gap-5">
      <img
        src="/coffee2.jpg"
        alt="coffee"
        className="h-auto w-2/3 rounded-lg"
      />
      <div className="w-1/3 card self-center">
        <h2 className="card-title">Coffee Break</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="card-body">
            <Input
              labelText="Email"
              inputName="email"
              inputValue={formik.values.email}
              htmlFor="email"
              onInputChange={formik.handleChange}
              inputType="email"
              required
              inputPlaceholder="enter your email here"
              error={formik.errors.email}
            />
            <Input
              labelText="Password"
              inputName="password"
              inputValue={formik.values.password}
              htmlFor="password"
              onInputChange={formik.handleChange}
              inputType="password"
              required
              inputPlaceholder="enter your password here"
              error={formik.errors.password}
            />
          </div>
          <div className="card-actions justify-end">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
