import { Spinner } from "@/components/shared/spinner";

 export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex min-h-screen items-center justify-center">
        <Spinner className="mx-auto" />
    </div>
  )
}