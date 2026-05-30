"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterSchema } from "@/lib/validations/auth";

type StoredUser = {
  id:       string;
  name:     string;
  email:    string;
  password: string;
  role:     "LEARNER" | "INSTRUCTOR";
};

export type RegisterState = { error?: string };

// Emails reserved for demo accounts
const DEMO_EMAILS = new Set(["learner@plearn.co", "instructor@plearn.co", "admin@plearn.co"]);

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name:     (formData.get("name")     as string | null) ?? "",
    email:    (formData.get("email")    as string | null) ?? "",
    password: (formData.get("password") as string | null) ?? "",
    role:     (formData.get("role")     as string | null) ?? "LEARNER",
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (DEMO_EMAILS.has(parsed.data.email)) {
    return { error: "Email นี้ถูกใช้งานแล้ว" };
  }

  // Read existing registered users from prototype cookie store
  let existing: StoredUser[] = [];
  try {
    existing = JSON.parse(cookies().get("plearn_registered")?.value ?? "[]");
  } catch {}

  if (existing.some((u) => u.email === parsed.data.email)) {
    return { error: "Email นี้ถูกใช้งานแล้ว" };
  }

  const newUser: StoredUser = {
    id:       `user_${Date.now()}`,
    name:     parsed.data.name,
    email:    parsed.data.email,
    password: parsed.data.password,
    role:     parsed.data.role as "LEARNER" | "INSTRUCTOR",
  };

  existing.push(newUser);

  // Persist in a non-httpOnly cookie so loginUser can read it back
  cookies().set("plearn_registered", JSON.stringify(existing), {
    httpOnly: false,
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 365,
    path:     "/",
  });

  // TODO Phase 2: replace with db.user.create({ hashedPassword: await bcrypt.hash(...) })
  redirect("/login?registered=1");
}
