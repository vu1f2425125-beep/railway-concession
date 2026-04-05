'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { validateEmail, saveAuthoritySession } from '@/lib/auth-utils'
import { ShieldCheck } from 'lucide-react'

export function AuthorityLoginForm() {
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
      const users = JSON.parse(localStorage.getItem('authorityUsers') || '[]')
      const user = users.find(
        (u: any) => u.email === formData.email.trim() && u.password === formData.password
      )

      if (!user) {
        setErrors({ password: 'Invalid email or password' })
        setIsLoading(false)
        return
      }

      saveAuthoritySession(user.name, user.email)
      toast({
        title: 'Success',
        description: `Welcome, ${user.name}! You have been logged in as an authority.`,
      })
      router.push('/authority/dashboard')
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
          <div className="rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 p-3 shadow-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
          Authority Login
        </CardTitle>
        <CardDescription className="text-base">
          Access the authority management dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              Official Email
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
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
