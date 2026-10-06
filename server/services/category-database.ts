import { database } from './database.ts'

import type { Category, Subcategory } from '../../shared/types/Category.ts'

const queryCategories = database.prepare(
  `
    SELECT 
      *
    FROM
      categories
  `,
)

export function dbGetCategories(): Category[] {
  return queryCategories.all() as unknown as Category[]
}

const querySubcategories = database.prepare(
  `
    SELECT 
      id,
      name,
      category_id AS categoryId
    FROM
      subcategories
  `,
)

export function dbGetSubcategories(): Subcategory[] {
  return querySubcategories.all() as unknown as Subcategory[]
}
