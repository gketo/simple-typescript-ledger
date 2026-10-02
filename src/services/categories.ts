import type { Category, Subcategory } from '@/types/Category'

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('http://localhost:3000/categories')

  if (!response.ok) {
    throw response.status
  }

  const data = await response.json()

  return data.categories
}

export async function fetchSubcategories(): Promise<Subcategory[]> {
  const response = await fetch('http://localhost:3000/subcategories')

  if (!response.ok) {
    throw response.status
  }

  const data = await response.json()

  return data.subcategories
}
