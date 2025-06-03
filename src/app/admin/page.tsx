import { SessionProvider } from "next-auth/react"
import Dashboard from "./Dashboard"
export default function Administrator() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  )
}