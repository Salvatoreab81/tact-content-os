import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export default async function Home() {
  // Check if any brand exists
  const result = await query("SELECT COUNT(*) as count FROM brands");
  const count = parseInt(result.rows[0].count);

  if (count === 0) {
    // No brands → go to onboarding
    redirect("/onboarding");
  } else {
    // Brand exists → go to dashboard
    redirect("/dashboard");
  }
}
