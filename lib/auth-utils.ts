// Authentication utilities for railway concession system
import { StudentProfile } from './types'

export interface StudentSession extends StudentProfile {}

export interface AuthoritySession {
  authorityName: string
  authorityEmail: string
  authorityLoggedIn: boolean
}

export const validateEmail = (email: string): boolean => {
  return email.endsWith('@pvppcoe.ac.in')
}

export const saveStudentSession = (profile: StudentSession): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('studentSession', JSON.stringify(profile))
  }
}

export const saveAuthoritySession = (name: string, email: string): void => {
  if (typeof window !== 'undefined') {
    const session: AuthoritySession = {
      authorityName: name,
      authorityEmail: email,
      authorityLoggedIn: true,
    }
    sessionStorage.setItem('authoritySession', JSON.stringify(session))
  }
}

export const getStudentSession = (): StudentSession | null => {
  if (typeof window === 'undefined') return null
  const session = sessionStorage.getItem('studentSession')
  return session ? JSON.parse(session) : null
}

export const getAuthoritySession = (): AuthoritySession | null => {
  if (typeof window === 'undefined') return null
  const session = sessionStorage.getItem('authoritySession')
  return session ? JSON.parse(session) : null
}

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('studentSession')
    sessionStorage.removeItem('authoritySession')
  }
}

export const isStudentAuthenticated = (): boolean => {
  return getStudentSession() !== null
}

export const isAuthorityAuthenticated = (): boolean => {
  const session = getAuthoritySession()
  return session !== null && session.authorityLoggedIn === true
}

export const generateApplicationId = (): string => {
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `RC${randomNum}`
}
