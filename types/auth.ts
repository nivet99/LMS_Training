export type Role = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "LEARNER";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  locale: string;
}

export interface JWTPayload {
  id: string;
  role: Role;
  locale: string;
}
