'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Train, Users, FileText } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Railway Concession</h1>
              <p className="text-xs text-muted-foreground">PVPP College of Engineering</p>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center md:py-24">
        <div className="mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">
            Student Railway Concession Management
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Streamlined application process for students to apply for railway concessions and track their approval status in real-time.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-6 dark:bg-card">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">For Students</h3>
            <p className="text-sm text-muted-foreground">
              Apply for concessions, track your application status, and download your concession slip in minutes.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 dark:bg-card">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">For Authorities</h3>
            <p className="text-sm text-muted-foreground">
              Review applications, approve or reject requests, and assign travel slots efficiently.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 dark:bg-card">
            <div className="mb-4 flex justify-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Train className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Fast Processing</h3>
            <p className="text-sm text-muted-foreground">
              Get instant confirmations and real-time updates on your application status.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/student/login">
            <Button size="lg" className="w-full sm:w-auto">
              Student Login
            </Button>
          </Link>
          <Link href="/authority/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Authority Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8 dark:bg-card">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 PVPP College of Engineering. Railway Concession Management System.
          </p>
        </div>
      </footer>
    </main>
  )
}
