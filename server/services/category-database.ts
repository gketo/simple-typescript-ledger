import { database } from './database.js'

import type { Category } from '@shared/types/Category.js'
import type { Subcategory } from '@shared/types/Subcategory.js'

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
