export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  googleId?: string
  createdAt?: string
  lastLogin?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    name: string
    avatar_url?: string
    google_id?: string
    created_at?: string
    last_login?: string
  }
}
