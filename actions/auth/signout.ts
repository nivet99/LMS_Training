"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutUser() {
  cookies().delete("plearn_user");
  redirect("/");
}
