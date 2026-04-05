'use client'

import { Application } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock, CheckCircle2 } from 'lucide-react'

interface DashboardCardsProps {
  applications: Application[]
}

export function DashboardCards({ applications }: DashboardCardsProps) {
  const totalApplications = applications.length
  const pendingApplications = applications.filter((app) => app.status === 'Pending').length
  const approvedApplications = applications.filter((app) => app.status === 'Approved').length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            {totalApplications === 1 ? '1 submission' : `${totalApplications} submissions`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingApplications}</div>
          <p className="text-xs text-muted-foreground">
            {pendingApplications === 1 ? '1 awaiting' : `${pendingApplications} awaiting`} approval
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedApplications}</div>
          <p className="text-xs text-muted-foreground">
            {approvedApplications === 1 ? '1 approved' : `${approvedApplications} approved`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
