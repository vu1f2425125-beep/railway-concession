'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { validateEmail } from '@/lib/auth-utils'
import { Branch, Year } from '@/lib/types'
import { Train, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const BRANCHES: Branch[] = ['Computer Engineering', 'Information Technology']
const YEARS: Year[] = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const DIVISIONS = ['A', 'B', 'C']

export function StudentSignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: '' as Branch | '',
    year: '' as Year | '',
    division: '',
    mobileNumber: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must end with @pvppcoe.ac.in'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.branch) {
      newErrors.branch = 'Branch is required'
    }

    if (!formData.year) {
      newErrors.year = 'Year is required'
    }

    if (!formData.division) {
      newErrors.division = 'Division is required'
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      // Store user credentials in localStorage
      const users = JSON.parse(localStorage.getItem('studentUsers') || '[]')
      
      // Check if email already exists
      if (users.some((user: any) => user.email === formData.email)) {
        setErrors({ email: 'This email is already registered' })
        setIsLoading(false)
        return
      }

      users.push({
        id: Date.now().toString(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password, // In production, this should be hashed
        branch: formData.branch,
        year: formData.year,
        division: formData.division,
        mobileNumber: formData.mobileNumber.trim(),
        createdAt: new Date().toISOString(),
      })

      localStorage.setItem('studentUsers', JSON.stringify(users))

      toast({
        title: 'Success',
        description: 'Account created successfully! You can now login.',
      })

      router.push('/student/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-3">
            <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-3 shadow-lg">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join the railway concession system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full Name *
              </label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                College Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@pvppcoe.ac.in"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 chars (uppercase, lowercase, number)"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password *
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Branch and Year */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="branch" className="text-sm font-medium text-foreground">
                  Branch *
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    errors.branch ? 'border-destructive' : ''
                  }`}
                >
                  <option value="">Select Branch</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-xs text-destructive">{errors.branch}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium text-foreground">
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    errors.year ? 'border-destructive' : ''
                  }`}
                >
                  <option value="">Select Year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="text-xs text-destructive">{errors.year}</p>
                )}
              </div>
            </div>

            {/* Division and Mobile */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="division" className="text-sm font-medium text-foreground">
                  Division *
                </label>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    errors.division ? 'border-destructive' : ''
                  }`}
                >
                  <option value="">Select Division</option>
                  {DIVISIONS.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                {errors.division && (
                  <p className="text-xs text-destructive">{errors.division}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="mobileNumber" className="text-sm font-medium text-foreground">
                  Mobile Number *
                </label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="10-digit number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.mobileNumber ? 'border-destructive' : ''}
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-destructive">{errors.mobileNumber}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading} size="lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/student/login" className="text-primary hover:underline font-semibold">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
