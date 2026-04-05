'use client'

import { useState, useEffect } from 'react'
import { AuthorityNotice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, AlertCircle, Bell } from 'lucide-react'

interface NoticeManagerProps {
  onNoticeChange?: (notice: AuthorityNotice | null) => void
}

export function NoticeManager({ onNoticeChange }: NoticeManagerProps) {
  const [notice, setNotice] = useState<AuthorityNotice | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Load notice from localStorage on mount
  useEffect(() => {
    const savedNotice = localStorage.getItem('authorityNotice')
    if (savedNotice) {
      const parsedNotice = JSON.parse(savedNotice)
      setNotice(parsedNotice)
    }
  }, [])

  const handlePostNotice = () => {
    if (!messageInput.trim()) {
      alert('Please enter a notice message')
      return
    }

    const newNotice: AuthorityNotice = {
      id: `NOTICE-${Date.now()}`,
      message: messageInput.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    setNotice(newNotice)
    localStorage.setItem('authorityNotice', JSON.stringify(newNotice))
    setMessageInput('')
    onNoticeChange?.(newNotice)
  }

  const handleRemoveNotice = () => {
    setNotice(null)
    localStorage.removeItem('authorityNotice')
    onNoticeChange?.(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Post Notice to Students</CardTitle>
              <CardDescription>Inform students about your availability</CardDescription>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:underline"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notice Message *
            </label>
            <textarea
              placeholder="e.g., I am not available today to collect concession forms. Please visit tomorrow."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePostNotice} className="flex-1">
              Post Notice
            </Button>
            {notice && (
              <Button onClick={handleRemoveNotice} variant="outline" className="flex-1">
                Clear Notice
              </Button>
            )}
          </div>

          {notice && (
            <div className="flex gap-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  Active Notice
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {notice.message}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
