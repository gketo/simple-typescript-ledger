export interface Category {
  id: number
  name: string
}

export type CategoryId = Category['id']

export interface Subcategory {
  id: number
  categoryId: CategoryId
  name: string
}

export type SubcategoryId = Subcategory['id']
