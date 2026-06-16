import { Suspense } from 'react'
import { ResetPasswordClient } from './ResetPasswordClient'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading...</div>
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  )
}
