'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthoritySession, logout, isAuthorityAuthenticated } from '@/lib/auth-utils'
import { AuthoritySession } from '@/lib/auth-utils'
import { Application, AuthorityNotice } from '@/lib/types'
import { DashboardCards } from '@/components/authority/DashboardCards'
import { ApplicationsTable } from '@/components/authority/ApplicationsTable'
import { NoticeManager } from '@/components/authority/NoticeManager'
import { ClosedSlotManager } from '@/components/authority/ClosedSlotManager'
import { Button } from '@/components/ui/button'
import { Train, LogOut } from 'lucide-react'

export default function AuthorityDashboard() {
  const router = useRouter()
  const [authority, setAuthority] = useState<AuthoritySession | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (!isAuthorityAuthenticated()) {
      router.push('/authority/login')
      return
    }

    const session = getAuthoritySession()
    if (session) {
      setAuthority(session)
    }

    // Load applications from localStorage
    const savedApplications = localStorage.getItem('applications')
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleApplicationUpdate = (updatedApplication: Application) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApplication.id ? updatedApplication : app))
    )
    // Update localStorage
    const applications = JSON.parse(localStorage.getItem('applications') || '[]')
    const updatedApplications = applications.map((app: Application) =>
      app.id === updatedApplication.id ? updatedApplication : app
    )
    localStorage.setItem('applications', JSON.stringify(updatedApplications))
  }

  if (!isMounted || !authority) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Train className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Railway Concession</h1>
                <p className="text-xs text-muted-foreground">Authority Portal</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Authority:</p>
                <p className="font-semibold text-foreground">{authority.authorityName}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Notice Manager */}
        <NoticeManager />

        {/* Closed Slot Manager */}
        <ClosedSlotManager />

        {/* Dashboard Cards */}
        <DashboardCards applications={applications} />

        {/* Applications Table */}
        <ApplicationsTable
          applications={applications}
          onApplicationUpdate={handleApplicationUpdate}
        />
      </div>
    </main>
  )
}
