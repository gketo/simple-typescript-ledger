import { DatabaseSync } from 'node:sqlite'

const database = new DatabaseSync('./database/ledger.db')

export function dbGetCategories(): Category[] {
  const sqlQuery = database.prepare(`
    SELECT 
      *
    FROM
      categories
  `)

  const data = sqlQuery.all()

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

  const data = sqlQuery.all()

  return data
}
