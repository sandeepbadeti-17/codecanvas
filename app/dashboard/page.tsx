// app/dashboard/page.tsx

import { getSession } from "@/lib/auth"

export default async function Dashboard() {
  const session = await getSession()

  if (!session) {
    return <div>Not logged in</div>
  }

  return <div>Welcome {session.user?.name}</div>
}