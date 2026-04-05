'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StudentSignupForm } from '@/components/student/StudentSignupForm'
import { isStudentAuthenticated } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function StudentSignupPage() {
  const router = useRouter()

  useEffect(() => {
    if (isStudentAuthenticated()) {
      router.push('/student/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="border-b border-blue-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Step into your educational journey
          </div>
        </div>
      </header>

      {/* Signup Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              Welcome
            </h1>
            <p className="text-muted-foreground">
              Create your account to manage railway concessions
            </p>
          </div>
          <StudentSignupForm />
        </div>
      </div>
    </main>
  )
}
