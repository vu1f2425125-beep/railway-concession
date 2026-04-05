'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { validateEmail, saveStudentSession } from '@/lib/auth-utils'
import { StudentSession, Branch, Year } from '@/lib/types'
import { Train } from 'lucide-react'

const BRANCHES: Branch[] = ['Computer Engineering', 'Information Technology']
const YEARS: Year[] = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export function StudentLoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must end with @pvppcoe.ac.in'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Check credentials against stored users
      const users = JSON.parse(localStorage.getItem('studentUsers') || '[]')
      const user = users.find(
        (u: any) => u.email === formData.email.trim() && u.password === formData.password
      )

      if (!user) {
        setErrors({ password: 'Invalid email or password' })
        setIsLoading(false)
        return
      }

      const session: StudentSession = {
        fullName: user.fullName,
        email: user.email,
        branch: user.branch,
        year: user.year,
        division: user.division,
        mobileNumber: user.mobileNumber,
      }

      saveStudentSession(session)
      toast({
        title: 'Success',
        description: `Welcome, ${user.fullName}! You have been logged in.`,
      })
      router.push('/student/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card className="w-full border-0 shadow-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="flex justify-center mb-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-3 shadow-lg">
            <Train className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Student Login
        </CardTitle>
        <CardDescription className="text-base">
          Access your railway concession account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              College Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@pvppcoe.ac.in"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`h-11 ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`h-11 ${errors.password ? 'border-destructive' : ''}`}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
