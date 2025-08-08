export interface ChatMessage {
  id: string
  input: string
  output: string
  timestamp: Date
  userId?: string
}

export interface UsageLimit {
  anonymous: number
  authenticated: number
}

export interface AppSettings {
  darkMode: boolean
  language: 'en' | 'es'
  theme: 'light' | 'dark' | 'system'
}

export interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}