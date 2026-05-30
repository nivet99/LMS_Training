"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginSchema } from "@/lib/validations/auth";

// Demo accounts สำหรับทดสอบ (ไม่ต้องใช้ DB)
// Phase 2: แทนที่ด้วย db.user.findUnique + bcrypt.compare
const DEMO_USERS = [
  {
    id:       "demo_learner_01",
    name:     "ปาริชาติ วงษ์คำ",
    email:    "learner@plearn.co",
    password: "Password123",
    role:     "LEARNER" as const,
  },
  {
    id:       "demo_instructor_01",
    name:     "อ.ณัฐพงษ์ ศรีสุข",
    email:    "instructor@plearn.co",
    password: "Password123",
    role:     "INSTRUCTOR" as const,
  },
  {
    id:       "demo_admin_01",
    name:     "ผู้ดูแลระบบ Plearn",
    email:    "admin@plearn.co",
    password: "Admin1234",
    role:     "ADMIN" as const,
  },
];

const ROLE_REDIRECT: Record<string, string> = {
  LEARNER:     "/dashboard",
  INSTRUCTOR:  "/instructor/dashboard",
  ADMIN:       "/admin/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

type StoredUser = {
  id:       string;
  name:     string;
  email:    string;
  password: string;
  role:     "LEARNER" | "INSTRUCTOR";
};

type SessionPayload = { id: string; name: string; email: string; role: string };

export type LoginState = { error?: string };

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email:    (formData.get("email")    as string | null) ?? "",
    password: (formData.get("password") as string | null) ?? "",
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let session: SessionPayload | null = null;

  // 1. Check demo accounts
  const demoUser = DEMO_USERS.find(
    (u) => u.email === parsed.data.email && u.password === parsed.data.password
  );
  if (demoUser) {
    const { password: _pw, ...data } = demoUser;
    session = data;
  }

  // 2. Check self-registered users stored in prototype cookie
  if (!session) {
    let registered: StoredUser[] = [];
    try {
      registered = JSON.parse(cookies().get("plearn_registered")?.value ?? "[]");
    } catch {}
    const reg = registered.find(
      (u) => u.email === parsed.data.email && u.password === parsed.data.password
    );
    if (reg) {
      const { password: _pw, ...data } = reg;
      session = data;
    }
  }

  if (!session) {
    return { error: "Email หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
  }

  cookies().set("plearn_user", JSON.stringify(session), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 7,
    path:     "/",
  });

  redirect(ROLE_REDIRECT[session.role] ?? "/dashboard");
}
