"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/lip/api";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number")
    .required("Phone is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "password", label: "Password", type: "password" },
  { name: "rePassword", label: "Confirm Password", type: "password" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        await api("/auth/signup", {
          method: "POST",
          body: JSON.stringify(values),
        });
        router.push("/login");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              value={formik.values[f.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2 focus:border-green-600 focus:outline-none"
            />
            {formik.touched[f.name] && formik.errors[f.name] && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors[f.name]}
              </p>
            )}
          </div>
        ))}

        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {formik.isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
}