'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { generateApplicationId } from '@/lib/auth-utils'
import { Application, TravelClass, Duration } from '@/lib/types'
import { StudentSession } from '@/lib/auth-utils'
import { Calendar, ArrowRight } from 'lucide-react'

interface ConcessionFormProps {
  student: StudentSession
  onApplicationSubmit: (application: Application) => void
}

const DURATION_OPTIONS: Duration[] = ['1 Month', '2 Months', '3 Months']

export function ConcessionForm({ student, onApplicationSubmit }: ConcessionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fromStation: '',
    toStation: '',
    startDate: '',
    endDate: '',
    travelClass: 'Second' as TravelClass,
    duration: '1 Month' as Duration,
    purposeOfTravel: 'Education',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const calculateEndDate = (startDate: string, durationMonths: number) => {
    if (!startDate) return ''
    const [year, month, day] = startDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    date.setMonth(date.getMonth() + durationMonths)
    date.setDate(date.getDate() - 1)
    const endYear = date.getFullYear()
    const endMonth = String(date.getMonth() + 1).padStart(2, '0')
    const endDay = String(date.getDate()).padStart(2, '0')
    return `${endYear}-${endMonth}-${endDay}`
  }

  const getDurationMonths = (duration: Duration): number => {
    const monthsMap: Record<Duration, number> = {
      '1 Month': 1,
      '2 Months': 2,
      '3 Months': 3,
    }
    return monthsMap[duration]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let updatedData = { ...formData, [name]: value }
    if (name === 'startDate' || name === 'duration') {
      const startDate = name === 'startDate' ? value : formData.startDate
      const duration = name === 'duration' ? value : formData.duration
      const durationMonths = getDurationMonths(duration as Duration)
      const endDate = calculateEndDate(startDate, durationMonths)
      updatedData.endDate = endDate
    }
    setFormData(updatedData)
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    const newErrors: Record<string, string> = {}
    if (!formData.fromStation.trim()) newErrors.fromStation = 'From station is required'
    if (!formData.toStation.trim()) newErrors.toStation = 'To station is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const appId = generateApplicationId()
      const application: Application = {
        id: appId,
        studentName: student.fullName || student.name,
        studentEmail: student.email,
        rollNumber: student.rollNumber || `${student.year}-${student.division}`,
        course: student.course || student.branch,
        year: student.year,
        fromStation: formData.fromStation,
        toStation: formData.toStation,
        travelClass: formData.travelClass,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        purposeOfTravel: formData.purposeOfTravel,
        status: 'Pending',
        timestamp: new Date().toISOString(),
      }

      // Save to MongoDB
      const response = await fetch('/api/student/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      toast({
        title: 'Success',
        description: `Application submitted! ID: ${appId}`,
      })

      onApplicationSubmit(application)
      setFormData({
        fromStation: '',
        toStation: '',
        startDate: '',
        endDate: '',
        travelClass: 'Second',
        duration: '1 Month',
        purposeOfTravel: 'Education',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Concession Application</CardTitle>
        <CardDescription>Fill in your travel details to apply for railway concession</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Your Details (Auto-filled)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input type="text" value={student.fullName || student.name || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course / Branch</label>
                <Input type="text" value={student.course || student.branch || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Year</label>
                <Input type="text" value={student.year || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Division</label>
                <Input type="text" value={student.division || ''} disabled className="bg-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Travel Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="fromStation" className="text-sm font-medium text-foreground">From Station *</label>
                <Input id="fromStation" name="fromStation" placeholder="e.g., Pune Junction" value={formData.fromStation} onChange={handleInputChange} disabled={isLoading} className={errors.fromStation ? 'border-destructive' : ''} />
                {errors.fromStation && <p className="text-xs text-destructive">{errors.fromStation}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="toStation" className="text-sm font-medium text-foreground">To Station *</label>
                <Input id="toStation" name="toStation" placeholder="e.g., Mumbai Central" value={formData.toStation} onChange={handleInputChange} disabled={isLoading} className={errors.toStation ? 'border-destructive' : ''} />
                {errors.toStation && <p className="text-xs text-destructive">{errors.toStation}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Travel Duration</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration *</label>
              <div className="grid gap-3 md:grid-cols-3">
                {DURATION_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition">
                    <input type="radio" name="duration" value={option} checked={formData.duration === option} onChange={(e) => handleRadioChange('duration', e.target.value)} disabled={isLoading} />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Start Date *
                </label>
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} disabled={isLoading} className={errors.startDate ? 'border-destructive' : ''} />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> End Date (Auto-calculated)
                </label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} disabled className="bg-muted" />
              </div>
            </div>
            {formData.startDate && formData.endDate && (
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg text-sm text-foreground">
                <ArrowRight className="h-4 w-4 text-mu