import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LogoutButton from "../components/LogoutButton"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
      <LogoutButton />
    </div>
  )
}