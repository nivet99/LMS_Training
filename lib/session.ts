import { cookies } from "next/headers";

export type MockSession = {
  id: string;
  name: string;
  email: string;
  role: "LEARNER" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN";
};

export function getSession(): MockSession | null {
  try {
    const cookie = cookies().get("plearn_user");
    if (!cookie?.value) return null;
    return JSON.parse(cookie.value) as MockSession;
  } catch {
    return null;
  }
}
