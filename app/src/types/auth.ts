export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  displayName?: string
}