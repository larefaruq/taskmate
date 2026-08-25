import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "USER") redirect("/admin");
  return <main style={{ padding: 40 }}><h1>TaskMate User</h1><p>Halo, {session.user.name}</p><p>Role: {session.user.role}</p></main>;
}
