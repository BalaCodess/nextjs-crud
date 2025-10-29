import { appConfig } from "./config"

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required"
  if (name.length < appConfig.nameMinChars) return `Name must be at least ${appConfig.nameMinChars} characters`
  if (name.length > appConfig.nameMaxChars) return `Name must not exceed ${appConfig.nameMaxChars} characters`
  return null
}

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Invalid email format"
  return null
}

export const validateLinkedInUrl = (url: string): string | null => {
  if (!url.trim()) return "LinkedIn URL is required"
  if (!appConfig.urlPattern.test(url)) return "Invalid URL format"
  if (!url.includes("linkedin.com")) return "Must be a LinkedIn URL"
  return null
}

export const validatePin = (pin: string): string | null => {
  if (!pin.trim()) return "PIN is required"
  if (!appConfig.pinPattern.test(pin)) return "PIN must be 6 digits"
  return null
}

export const validateGender = (gender: string): string | null => {
  if (!gender) return "Gender is required"
  return null
}

export const validateAddressLine = (line: string, fieldName: string): string | null => {
  if (!line.trim()) return `${fieldName} is required`
  return null
}

export const validateState = (state: string): string | null => {
  if (!state) return "State is required"
  return null
}

export const validateCity = (city: string): string | null => {
  if (!city) return "City is required"
  return null
}
