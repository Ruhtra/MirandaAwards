"use server";

import { redirect } from "next/navigation";

export default async function IndexPage() {
  //TO-DO: Added redirect based on user role
  await redirect("/login");
}
