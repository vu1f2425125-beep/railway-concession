'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LockIcon, X, Calendar } from 'lucide-react'
import { ClosedSlot } from '@/lib/types'

export function ClosedSlotManager() {
  const [closedSlots, setClosedSlots] = useState<ClosedSlot[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('closedSlots')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [closedDate, setClosedDate] = useState('')
  const [closedTime, setClosedTime] = useState('')
  const [reason, setReason] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAddClosedSlot = () => {
    if (!closedDate || !closedTime || !reason.trim()) {
      alert('Please fill all fields')
      return
    }

    const closedDateTime = `${closedDate} ${closedTime}`
    const isDuplicate = closedSlots.some((slot) => slot.dateTime === closedDateTime)

    if (isDuplicate) {
      alert('This slot is already closed')
      return
    }

    const newSlot: ClosedSlot = {
      dateTime: closedDateTime,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedSlots = [...closedSlots, newSlot]
    setClosedSlots(updatedSlots)
    localStorage.setItem('closedSlots', JSON.stringify(updatedSlots))

    setClosedDate('')
    setClosedTime('')
    setReason('')
  }

  const handleRemoveClosedSlot = (dateTime: string) => {
    const updatedSlots = closedSlots.filter((slot) => slot.dateTime !== dateTime)
    setClosedSlots(updatedSlots)
    localStorage.setItem('closedSlots', JSON.stringify(updatedSlots))
  }

  return (
    <Card className="border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader
        className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div>
              <CardTitle className="text-orange-900 dark:text-orange-100">Close Collection Slots</CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Block specific date and time slots from student collection
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100">
            {closedSlots.length} Closed
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 border-t border-orange-200 dark:border-orange-900/50 pt-6">
          {/* Add New Closed Slot */}
          <div className="space-y-4 p-4 bg-white dark:bg-card rounded-lg border border-orange-200 dark:border-orange-900/50">
            <h4 className="font-semibold text-foreground">Block a Collection Slot</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input
                  type="date"
                  value={closedDate}
                  onChange={(e) => setClosedDate(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Time</label>
                <Input
                  type="time"
                  value={closedTime}
                  onChange={(e) => setClosedTime(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reason</label>
              <Input
                placeholder="e.g., Authority on leave, office closed"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-10"
              />
            </div>

            <Button onClick={handleAddClosedSlot} className="w-full bg-orange-600 hover:bg-orange-700">
              Block This Slot
            </Button>
          </div>

          {/* Display Closed Slots */}
          {closedSlots.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Currently Blocked Slots ({closedSlots.length})</h4>
              {closedSlots.map((slot) => (
                <div
                  key={slot.dateTime}
                  className="flex items-start justify-between p-3 bg-white dark:bg-card rounded-lg border border-orange-200 dark:border-orange-900/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <p className="font-medium text-foreground">{slot.dateTime}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Reason: {slot.reason}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveClosedSlot(slot.dateTime)}
                    className="ml-4 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
