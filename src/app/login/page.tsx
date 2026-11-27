"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";

type LoginResponse = {
  message: string;
  token: string;
  user: { name: string; email: string; role: string };
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        const data = await api<LoginResponse>("/auth/signin", {
          method: "POST",
          body: JSON.stringify(values),
        });
        login(data.token);
        router.push("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue shopping"
      footer={
        <>
          New to FreshCart?{" "}
          <Link
            href="/register"
            className="font-semibold text-green-700 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <FormField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
        />

        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {formik.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}