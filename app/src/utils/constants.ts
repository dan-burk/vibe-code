export const USAGE_LIMITS = {
  ANONYMOUS: 2,
  AUTHENTICATED: 50, // Per day or per month
} as const

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
} as const

export const STORAGE_KEYS = {
  USAGE_COUNT: 'usage_count',
  THEME: 'theme',
  LANGUAGE: 'language',
  CHAT_HISTORY: 'chat_history',
} as const

export const API_ENDPOINTS = {
  ASK_AI: '/api/ask-ai',
  AUTH: '/api/auth',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
} as const