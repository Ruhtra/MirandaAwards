export interface GameWithCategoriesDTO {
  id: string
  name: string
  image_url?: string | null
  description?: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  categories: CategoryDTO[]
}

export interface CategoryDTO {
  id: string
  name: string
}
