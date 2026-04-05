'use client'

import { useState, useEffect, useMemo } from 'react'
import { Application } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileDown, CheckCircle2, Clock, XCircle, Trash2, AlertTriangle, CheckCheck } from 'lucide-react'

interface ApplicationStatusProps {
  applications: Application[]
  studentEmail: string
  onApplicationRevoked?: (applicationId: string) => void
}

export function ApplicationStatus({ applications, studentEmail, onApplicationRevoked }: ApplicationStatusProps) {
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({})
  const [isMounted, setIsMounted] = useState(false)

  const userApplications = useMemo(
    () => applications.filter((app) => app.studentEmail === studentEmail),
    [applications, studentEmail]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const updateCountdown = () => {
      const updated: Record<string, string> = {}
      userApplications.forEach((app) => {
        if (app.expiryDateTime) {
          const expiryDate = new Date(app.expiryDateTime.replace(' ', 'T'))
          const now = new Date()
          const diff = expiryDate.getTime() - now.getTime()

          if (diff <= 0) {
            updated[app.id] = 'Expired'
          } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            updated[app.id] = `${days}d ${hours}h ${minutes}m`
          }
        }
      })
      setTimeLeft(updated)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [userApplications, isMounted])

  const handleRevoke = (applicationId: string) => {
    if (confirm('Are you sure you want to revoke this application? This action cannot be undone.')) {
      onApplicationRevoked?.(applicationId)
    }
  }

  if (userApplications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>No applications submitted yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven&apos;t submitted any concession applications yet.</p>
            <p className="text-sm text-muted-foreground">Fill out the form above to submit your first application.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-[--status-approved] text-foreground'
      case 'Rejected':
        return 'bg-destructive text-destructive-foreground'
      case 'Pending':
      default:
        return 'bg-[--status-pending] text-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="h-4 w-4" />
      case 'Rejected':
        return <XCircle className="h-4 w-4" />
      case 'Pending':
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handlePrint = (application: Application) => {
    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Concession Slip - ${application.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .details { margin: 20px 0; }
              .row { margin: 10px 0; }
              .label { font-weight: bold; width: 200px; display: inline-block; }
              .status { margin-top: 20px; padding: 10px; border: 1px solid #333; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Railway Concession Slip</h1>
              <p>PVPP College of Engineering</p>
            </div>
            <div class="details">
              <div class="row"><span class="label">Application ID:</span> ${application.id}</div>
              <div class="row"><span class="label">Student Name:</span> ${application.studentName}</div>
              <div class="row"><span class="label">Email:</span> ${application.studentEmail}</div>
              <div class="row"><span class="label">Roll Number:</span> ${application.rollNumber}</div>
              <div class="row"><span class="label">Course:</span> ${application.course}</div>
              <div class="row"><span class="label">Year:</span> ${application.year}</div>
              <div class="row"><span class="label">From Station:</span> ${application.fromStation}</div>
              <div class="row"><span class="label">To Station:</span> ${application.toStation}</div>
              <div class="row"><span class="label">Travel Class:</span> ${application.travelClass}</div>
              <div class="row"><span class="label">Duration:</span> ${application.duration}</div>
              <div class="row"><span class="label">Start Date:</span> ${application.startDate}</div>
              <div class="row"><span class="label">End Date:</span> ${application.endDate}</div>
              <div class="row"><span class="label">Status:</span> ${application.status}</div>
              ${application.assignedSlot ? `<div class="row"><span class="label">Assigned Slot:</span> ${application.assignedSlot}</div>` : ''}
              <div class="status">
                <strong>Status: ${application.status}</strong>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Applications</CardTitle>
        <CardDescription>Track the status of your submitted applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userApplications.map((application) => (
            <div
              key={application.id}
              className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">Application {application.id}</h3>
                    <Badge className={getStatusColor(application.status)}>
                      <span className="mr-1">{getStatusIcon(application.status)}</span>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(application.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Route:</span>
                  <p className="font-medium">
                    {application.fromStation} → {application.toStation}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{application.duration}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-medium">{new Date(application.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <p className="font-medium">{new Date(application.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Class:</span>
                  <p className="font-medium">{application.travelClass}</p>
                </div>
              </div>

              {application.assignedSlot && (
                <div className="mb-3 p-2 bg-primary/5 rounded text-sm">
                  <span className="text-muted-foreground">Assigned Slot: </span>
                  <span className="font-medium text-primary">{application.assignedSlot}</span>
                </div>
              )}

              {application.status === 'Approved' && application.offlineFormCollectionDateTime && (
                <div className="mb-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                    Offline Form Collection Scheduled
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <span className="font-medium">Date & Time: </span>
                    {application.offlineFormCollectionDateTime}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Please collect your physical concession form at the scheduled date and time.
                  </p>
                </div>
              )}

              {application.status === 'Approved' && application.expiryDateTime && (
                <div className={`mb-3 p-3 rounded-lg border ${
                  application.isCollected
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'
                    : timeLeft[application.id] === 'Expired'
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
                }`}>
                  <div className="flex items-start gap-2">
                    {application.isCollected ? (
                      <CheckCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : timeLeft[application.id] === 'Expired' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      {application.isCollected ? (
                        <>
                          <p className={`text-sm font-semibold ${
                            application.isCollected 
                              ? 'text-emerald-800 dark:text-emerald-200'
                              : 'text-yellow-800 dark:text-yellow-200'
                          }`}>
                            Form Collected
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                            Thank you for collecting your concession form.
                          </p>
                        </>
                      ) : timeLeft[application.id] === 'Expired' ? (
                        <>
                          <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                            Collection Period Expired
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                            The deadline for collection has passed. Please contact the authority.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                            Time Remaining to Collect
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 font-mono">
                            {timeLeft[application.id] || 'Calculating...'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {application.remarks && (
                <div className="mb-3 p-2 bg-muted rounded text-sm">
                  <span className="text-muted-foreground">Remarks: </span>
                  <span>{application.remarks}</span>
                </div>
              )}

              <div className="flex gap-2">
                {(application.status === 'Pending' || application.status === 'Approved') && (
                  <Button
                    onClick={() => handleRevoke(application.id)}
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Revoke Application
                  </Button>
                )}
                {application.status === 'Approved' && (
                  <Button
                    onClick={() => handlePrint(application)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Print Slip
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
