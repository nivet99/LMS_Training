import type { UserProfile } from "@/types";

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user_learner_01",
    name: "Parichat Wongkham",
    email: "parichat@example.com",
    image: null,
    role: "LEARNER",
    locale: "th",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "user_instructor_01",
    name: "Nattapong Srisuk",
    email: "nattapong@example.com",
    image: null,
    role: "INSTRUCTOR",
    locale: "th",
    createdAt: new Date("2024-11-01"),
  },
  {
    id: "user_admin_01",
    name: "Pat Admin",
    email: "pat@plearn.co",
    image: null,
    role: "ADMIN",
    locale: "th",
    createdAt: new Date("2024-10-01"),
  },
  {
    id: "user_instructor_02",
    name: "Siriporn Kamolrat",
    email: "siriporn@example.com",
    image: null,
    role: "INSTRUCTOR",
    locale: "th",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "user_learner_02",
    name: "Thanida Jiraporn",
    email: "thanida@corp.co.th",
    image: null,
    role: "LEARNER",
    locale: "th",
    createdAt: new Date("2025-02-10"),
  },
];
