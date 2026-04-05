'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthorityLoginForm } from '@/components/authority/AuthorityLoginForm'
import { isAuthorityAuthenticated } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ChevronLeft } from 'lucide-react'

export default function AuthorityLoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthorityAuthenticated()) {
      router.push('/authority/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
              Authority Portal
            </h1>
            <p className="text-muted-foreground">
              Login to manage concessions
            </p>
          </div>
          <AuthorityLoginForm />
        </div>
      </div>
    </main>
  )
}
