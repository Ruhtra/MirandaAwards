"use server";

import { redirect } from "next/navigation";

export default async function adminPage() {
  //TO-DO: Added redirect based on user role
  await redirect("/admin/users");
}
