// export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  // password: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export interface Game {
  id: string
  title: string
  description: string | null
  image_url: string | null
  release_date: Date | null
  created_at: Date
  updated_at: Date
}

export interface Vote {
  id: string
  user_id: string
  game_id: string
  category_id: string
  created_at: Date
}
