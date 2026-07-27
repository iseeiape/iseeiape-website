import { useEffect } from "react"
import { useRouter } from "next/router"

// performance-dashboard temporarily redirects to /master while the
// dashboard component is being rebuilt (static-data version, week 2).
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return null
}
