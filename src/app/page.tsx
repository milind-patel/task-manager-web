import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// In Next.js 15, cookies() returns a Promise — must be awaited in an async component
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
