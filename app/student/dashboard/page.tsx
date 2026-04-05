'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getStudentSession, logout, isStudentAuthenticated } from '@/lib/auth-utils'
import { StudentSession } from '@/lib/auth-utils'
import { Application } from '@/lib/types'
import { ConcessionForm } from '@/components/student/ConcessionForm'
import { ApplicationStatus } from '@/components/student/ApplicationStatus'
import { StudentProfile } from '@/components/student/StudentProfile'
import { Button } from '@/components/ui/button'
import { Train, FileText, ClipboardList, AlertCircle, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthorityNotice } from '@/lib/types'

type TabType = 'profile' | 'applications'

interface OfflineSubmission {
  id: string
  fileName: string
  uploadDate: string
  status: 'Uploaded' | 'Under Review' | 'Processed'
}

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentSession | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [offlineSubmissions, setOfflineSubmissions] = useState<OfflineSubmission[]>([])
  const [authorityNotice, setAuthorityNotice] = useState<AuthorityNotice | null>(null)
  const [showNotice, setShowNotice] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  useEffect(() => {
    setIsMounted(true)

    if (!isStudentAuthenticated()) {
      router.push('/student/login')
      return
    }

    const session = getStudentSession()
    if (session) {
      setStudent(session)
    }

    // Load applications from localStorage
    const savedApplications = localStorage.getItem('applications')
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }

    // Load offline submissions from localStorage
    const savedOfflineSubmissions = localStorage.getItem('offlineSubmissions')
    if (savedOfflineSubmissions) {
      setOfflineSubmissions(JSON.parse(savedOfflineSubmissions))
    }

    // Load authority notice from localStorage
    const savedNotice = localStorage.getItem('authorityNotice')
    if (savedNotice) {
      const notice = JSON.parse(savedNotice)
      if (notice.isActive) {
        setAuthorityNotice(notice)
      }
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleApplicationSubmit = (application: Application) => {
    setApplications((prev) => [...prev, application])
    // Show applications tab after submission
    setActiveTab('applications')
  }

  const handleProfileUpdate = (updatedProfile: StudentSession) => {
    setStudent(updatedProfile)
  }

  const handleApplicationRevoked = (applicationId: string) => {
    const updatedApplications = applications.filter((app) => app.id !== applicationId)
    setApplications(updatedApplications)
    localStorage.setItem('applications', JSON.stringify(updatedApplications))
    alert('Application revoked successfully. It has been removed from your records.')
  }

  const handleOfflineFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate PDF file
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB')
        return
      }

      // Create submission record
      const submission: OfflineSubmission = {
        id: `OFF-${Date.now()}`,
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString(),
        status: 'Uploaded',
      }

      // Save to localStorage
      const submissions = [...offlineSubmissions, submission]
      setOfflineSubmissions(submissions)
      localStorage.setItem('offlineSubmissions', JSON.stringify(submissions))

      alert(`File "${file.name}" uploaded successfully for offline processing.`)
      
      // Reset file input
      event.target.value = ''
    }
  }

  if (!isMounted || !student) {
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
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            </Link>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome,</p>
              <p className="font-semibold text-foreground">{student.fullName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Authority Notice Alert - Highlighted with Scrolling */}
      {authorityNotice && showNotice && (
        <style>{`
          @keyframes scroll-notice {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .notice-scroll {
            animation: scroll-notice 15s linear infinite;
            white-space: nowrap;
          }
        `}</style>
      )}
      {authorityNotice && showNotice && (
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 dark:from-red-700 dark:via-orange-700 dark:to-red-700 border-b-4 border-red-700 dark:border-red-900 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <AlertCircle className="h-6 w-6 text-white dark:text-yellow-100 flex-shrink-0 animate-pulse" />
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-white dark:text-yellow-50 mb-1 text-lg">IMPORTANT: Authority Notice</p>
                <div className="overflow-hidden bg-black/20 dark:bg-black/40 rounded-lg py-2 px-3">
                  <p className="notice-scroll text-white dark:text-yellow-50 font-semibold text-sm">
                    {authorityNotice.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotice(false)}
                className="text-white dark:text-yellow-100 hover:text-gray-200 dark:hover:text-yellow-200 flex-shrink-0 ml-4"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-border bg-white dark:bg-card sticky top-16 z-40">
        <div className="container mx-auto px-6">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition ${
                activeTab === 'applications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              My Applications
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <StudentProfile 
                student={student} 
                onLogout={handleLogout}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
            {/* Quick Info Sidebar */}
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4 bg-secondary">
                <h3 className="font-semibold text-foreground mb-3">Profile Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-foreground">Profile Setup</span>
                  </div>
                  {student.idCardUrl ? (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-foreground">ID Card Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-muted-foreground">ID Card Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-8">
            <ConcessionForm student={student} onApplicationSubmit={handleApplicationSubmit} />
            <ApplicationStatus 
              applications={applications} 
              studentEmail={student.email}
              onApplicationRevoked={handleApplicationRevoked}
            />
          </div>
        )}
      </div>
    </main>
  )
}
