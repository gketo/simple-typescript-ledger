import type { CategoryId } from './Category'

export interface Subcategory {
  id: number
  categoryId: CategoryId
  name: string
}

export type SubcategoryId = Subcategory['id']
