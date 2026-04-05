'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthoritySignupForm } from '@/components/authority/AuthoritySignupForm'
import { isAuthorityAuthenticated } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function AuthoritySignupPage() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthorityAuthenticated()) {
      router.push('/authority/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Manage the concession system
          </div>
        </div>
      </header>

      {/* Signup Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
              Authority Access
            </h1>
            <p className="text-muted-foreground">
              Create your authority account
            </p>
          </div>
          <AuthoritySignupForm />
        </div>
      </div>
    </main>
  )
}
