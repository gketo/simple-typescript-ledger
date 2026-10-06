import type { Category, Subcategory } from '@shared/types//Category'

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('http://localhost:3000/categories')

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const data = await response.json()

  return data.categories
}

export async function fetchSubcategories(): Promise<Subcategory[]> {
  const response = await fetch('http://localhost:3000/subcategories')

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const data = await response.json()

  return data.subcategories
}
