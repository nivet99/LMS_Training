import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string };
}) {
  return <LoginForm registered={searchParams.registered === "1"} />;
}
