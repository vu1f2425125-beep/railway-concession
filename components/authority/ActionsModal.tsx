'use client'

import { useState } from 'react'
import { Application } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, AlertCircle } from 'lucide-react'

interface ActionsModalProps {
  application: Application
  isOpen: boolean
  onClose: () => void
  onSave: (updatedApplication: Application) => void
  allApplications?: Application[]
}

export function ActionsModal({ application, isOpen, onClose, onSave, allApplications = [] }: ActionsModalProps) {
  const [assignedSlot, setAssignedSlot] = useState(application.assignedSlot || '')
  const [collectionDate, setCollectionDate] = useState(
    application.offlineFormCollectionDateTime?.split(' ')[0] || ''
  )
  const [collectionTime, setCollectionTime] = useState(
    application.offlineFormCollectionDateTime?.split(' ')[1] || ''
  )
  const [isCollected, setIsCollected] = useState(application.isCollected || false)
  const [expiryDate, setExpiryDate] = useState(
    application.expiryDateTime?.split(' ')[0] || ''
  )
  const [expiryTime, setExpiryTime] = useState(
    application.expiryDateTime?.split(' ')[1] || ''
  )
  const [remarks, setRemarks] = useState(application.remarks || '')
  const [isSaving, setIsSaving] = useState(false)

  // Check if the collection slot is already assigned
  const isSlotConflict = () => {
    if (!collectionDate || !collectionTime) return false
    const proposedDateTime = `${collectionDate} ${collectionTime}`
    return allApplications.some(
      (app) =>
        app.id !== application.id &&
        app.offlineFormCollectionDateTime === proposedDateTime &&
        app.offlineFormSubmitted
    )
  }

  if (!isOpen) return null

  const handleApprove = async () => {
    setIsSaving(true)
    try {
      const collectionDateTime =
        collectionDate && collectionTime ? `${collectionDate} ${collectionTime}` : undefined
      const expiryDateTime =
        expiryDate && expiryTime ? `${expiryDate} ${expiryTime}` : undefined

      const updatedApplication: Application = {
        ...application,
        status: 'Approved',
        assignedSlot: assignedSlot || undefined,
        offlineFormCollectionDateTime: collectionDateTime,
        isCollected: isCollected,
        expiryDateTime: expiryDateTime,
        offlineFormSubmitted: true,
        remarks: remarks || undefined,
      }
      onSave(updatedApplication)
    } finally {
      setIsSaving(false)
    }
  }



  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-0">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Manage Application</CardTitle>
            <CardDescription>Application {application.id}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Application Details</h3>
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Student Name</p>
                <p className="font-medium">{application.studentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{application.studentEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Roll Number</p>
                <p className="font-medium">{application.rollNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{application.course}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Year</p>
                <p className="font-medium">{application.year}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{new Date(application.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{new Date(application.endDate).toLocaleDateString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Route</p>
                <p className="font-medium">
                  {application.fromStation} → {application.toStation}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Class</p>
                <p className="font-medium">{application.travelClass}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{application.duration}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="font-medium">{application.purposeOfTravel}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Status</p>
                <p className="font-medium">{application.status}</p>
              </div>
            </div>
          </div>

          {/* Offline Form Collection Section */}
          <div className="border-t border-border pt-6 space-y-4 bg-secondary/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground">Offline Form Collection</h3>
            <p className="text-sm text-muted-foreground">
              Assign a date and time for the student to submit their physical concession form
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="collectionDate" className="text-sm font-medium text-foreground">
                  Collection Date
                </label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="collectionTime" className="text-sm font-medium text-foreground">
                  Collection Time
                </label>
                <Input
                  id="collectionTime"
                  type="time"
                  value={collectionTime}
                  onChange={(e) => setCollectionTime(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            {isSlotConflict() && (
              <div className="flex gap-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  This time slot is already assigned to another student. Please choose a different time.
                </p>
              </div>
            )}
          </div>

          {/* Collection Status Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Collection Status</h3>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <input
                type="checkbox"
                id="isCollected"
                checked={isCollected}
                onChange={(e) => setIsCollected(e.target.checked)}
                disabled={isSaving}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <label htmlFor="isCollected" className="cursor-pointer flex-1">
                <p className="font-medium text-foreground">Mark as Collected</p>
                <p className="text-sm text-muted-foreground">Check if student has collected their physical concession form</p>
              </label>
            </div>
          </div>

          {/* Auto-Expiry Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Auto-Expiry Settings</h3>
            <p className="text-sm text-muted-foreground">Set when this application will automatically expire if not collected</p>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="expiryTime" className="text-sm font-medium text-foreground">
                  Expiry Time
                </label>
                <Input
                  id="expiryTime"
                  type="time"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex flex-col gap-2 md:flex-row">
              <Button
                onClick={handleApprove}
                disabled={isSaving || isSlotConflict()}
                className="flex-1"
              >
                {isSaving ? 'Processing...' : 'Approve Application'}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
