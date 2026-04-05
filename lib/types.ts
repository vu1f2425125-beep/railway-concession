// Type definitions for railway concession system

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected'
export type TravelClass = 'First' | 'Second'
export type Duration = '1 Month' | '2 Months' | '3 Months'
export type Branch = 'Computer Engineering' | 'Information Technology'
export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year'

export interface StudentProfile {
  fullName: string
  email: string
  branch: Branch
  year: Year
  division: string
  mobileNumber: string
  idCardUrl?: string
}

export interface CollectionSlot {
  dateTime: string // Format: "YYYY-MM-DD HH:mm"
  isAssigned: boolean
}

export interface Application {
  id: string
  studentName: string
  studentEmail: string
  rollNumber: string
  course: string
  year: string
  fromStation: string
  toStation: string
  travelClass: TravelClass
  duration: Duration
  startDate: string
  endDate: string
  purposeOfTravel: string
  status: ApplicationStatus
  assignedSlot?: string
  offlineFormCollectionDateTime?: string // Format: "YYYY-MM-DD HH:mm"
  offlineFormSubmitted?: boolean
  isCollected?: boolean // Mark if student collected the physical form
  collectionDeadline?: string // Format: "YYYY-MM-DD HH:mm" - auto-expiry time
  expiryDateTime?: string // Format: "YYYY-MM-DD HH:mm" - when application expires if not collected
  remarks?: string
  timestamp: string
}

export interface ClosedSlot {
  dateTime: string // Format: "YYYY-MM-DD HH:mm"
  reason: string
  createdAt: string
}

export interface StudentFormData {
  rollNumber: string
  course: string
  year: string
  fromStation: string
  toStation: string
  travelClass: TravelClass
  duration: Duration
  startDate: Date
  endDate: Date
  purposeOfTravel: string
}

export interface AuthorityNotice {
  id: string
  message: string
  isActive: boolean
  createdAt: string
}
