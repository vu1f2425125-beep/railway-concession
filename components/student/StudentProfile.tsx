'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StudentSession } from '@/lib/auth-utils'
import { useToast } from '@/hooks/use-toast'
import { User, Mail, LogOut, Upload, FileText } from 'lucide-react'

interface StudentProfileProps {
  student: StudentSession
  onLogout: () => void
  onProfileUpdate?: (profile: StudentSession) => void
}

const BRANCHES = ['Computer Engineering', 'Information Technology']
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const DIVISIONS = ['A', 'B', 'C']

export function StudentProfile({ student, onLogout, onProfileUpdate }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string>(student.idCardUrl || '')
  const [editData, setEditData] = useState({
    fullName: student.fullName,
    branch: student.branch,
    year: student.year,
    division: student.division,
    mobileNumber: student.mobileNumber,
  })
  const { toast } = useToast()

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid File',
          description: 'Please upload a PDF file only',
          variant: 'destructive',
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'PDF file should be less than 5MB',
          variant: 'destructive',
        })
        return
      }

      setIdCardFile(file)
      // Create a preview URL for the file
      const url = URL.createObjectURL(file)
      setIdCardPreview(url)
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    if (!editData.fullName.trim()) {
      toast({
        title: 'Error',
        description: 'Full name is required',
        variant: 'destructive',
      })
      return
    }

    if (!editData.mobileNumber.trim() || !/^\d{10}$/.test(editData.mobileNumber)) {
      toast({
        title: 'Error',
        description: 'Mobile number must be 10 digits',
        variant: 'destructive',
      })
      return
    }

    const updatedProfile: StudentSession = {
      ...student,
      fullName: editData.fullName,
      branch: editData.branch as any,
      year: editData.year as any,
      division: editData.division,
      mobileNumber: editData.mobileNumber,
      idCardUrl: idCardPreview || student.idCardUrl,
    }

    // Save to sessionStorage
    sessionStorage.setItem('studentSession', JSON.stringify(updatedProfile))

    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile)
    }

    setIsEditing(false)
    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    })
  }

  return (
    <div className="space-y-4">
      {/* View Mode */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary p-3">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-semibold text-foreground">{student.fullName}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary p-3">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{student.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Branch</p>
                  <p className="font-semibold text-foreground">{student.branch}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="font-semibold text-foreground">{student.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Division</p>
                  <p className="font-semibold text-foreground">{student.division}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mobile</p>
                  <p className="font-semibold text-foreground">{student.mobileNumber}</p>
                </div>
              </div>

              {student.idCardUrl && (
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ID Card (PDF)
                  </p>
                  <a
                    href={student.idCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View ID Card
                  </a>
                </div>
              )}

              <div className="border-t border-border pt-4 flex gap-2">
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Edit Profile
                </Button>
                <Button onClick={onLogout} variant="outline" className="flex-1 gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your information and upload ID card</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Basic Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <Input
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Branch *</label>
                    <select
                      name="branch"
                      value={editData.branch}
                      onChange={handleEditChange}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {BRANCHES.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Year *</label>
                    <select
                      name="year"
                      value={editData.year}
                      onChange={handleEditChange}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Division *</label>
                    <select
                      name="division"
                      value={editData.division}
                      onChange={handleEditChange}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select Division</option>
                      {DIVISIONS.map((division) => (
                        <option key={division} value={division}>
                          {division}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mobile Number *</label>
                    <Input
                      name="mobileNumber"
                      value={editData.mobileNumber}
                      onChange={handleEditChange}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* ID Card Upload */}
              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="font-semibold text-foreground">ID Card Upload (PDF)</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="idCard" className="block cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:underline">
                        {idCardFile ? idCardFile.name : 'Click to upload PDF'}
                      </span>
                    </label>
                    <input
                      id="idCard"
                      type="file"
                      accept=".pdf"
                      onChange={handleIdCardChange}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">PDF only, Max 5MB</p>
                  </div>
                </div>
                {idCardPreview && (
                  <div className="text-sm text-success flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ID Card uploaded successfully
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-border pt-4 flex gap-2">
                <Button onClick={handleSaveProfile} className="flex-1">
                  Save Profile
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false)
                    setIdCardFile(null)
                    setIdCardPreview(student.idCardUrl || '')
                    setEditData({
                      fullName: student.fullName,
                      branch: student.branch,
                      year: student.year,
                      division: student.division,
                      mobileNumber: student.mobileNumber,
                    })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
