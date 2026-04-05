'use client'

import { useState, useMemo } from 'react'
import { Application } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ActionsModal } from './ActionsModal'
import { Search, ChevronDown } from 'lucide-react'

interface ApplicationsTableProps {
  applications: Application[]
  onApplicationUpdate: (updatedApplication: Application) => void
}

export function ApplicationsTable({ applications, onApplicationUpdate }: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    }
  }

  const handleOpenModal = (application: Application) => {
    setSelectedApplication(application)
    setShowModal(true)
  }

  const handleSaveChanges = (updatedApplication: Application) => {
    onApplicationUpdate(updatedApplication)
    setShowModal(false)
    setSelectedApplication(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Review and manage student applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-8 appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {applications.length === 0
                  ? 'No applications submitted yet'
                  : 'No applications match your search or filter'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">App ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Roll No</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Travel Dates</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Collection Slot</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {application.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">{application.studentName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{application.rollNumber}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        <div className="text-xs">
                          <div>{new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {application.offlineFormCollectionDateTime ? (
                          <div className="text-xs">
                            <div className="font-medium">{application.offlineFormCollectionDateTime}</div>
                            <div className="text-muted-foreground">Assigned</div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Not Assigned</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(application)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-right">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </CardContent>
      </Card>

      {/* Actions Modal */}
      {selectedApplication && (
        <ActionsModal
          application={selectedApplication}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveChanges}
          allApplications={applications}
        />
      )}
    </>
  )
}
