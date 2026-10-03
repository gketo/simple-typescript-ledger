import { DatabaseSync } from 'node:sqlite'

const database = new DatabaseSync('./database/ledger.db')

import type { Category, Subcategory } from '../../src/types/Category'

export function dbGetCategories(): Category[] {
  const sqlQuery = database.prepare(`
    SELECT 
      *
    FROM
      categories
  `)

  const data = sqlQuery.all() as Category[]

  return data
}

export function dbGetSubcategories(): Subcategory[] {
  const sqlQuery = database.prepare(`
    SELECT 
      id,
      name,
      category_id AS categoryId
    FROM
      subcategories
  `)

  const data = sqlQuery.all() as Subcategory[]

  return data
}
