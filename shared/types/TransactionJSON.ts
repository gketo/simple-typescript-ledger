import type { Account } from './Account'
import type { Category } from './Category'
import type { Subcategory } from './Subcategory.js'

export type TransactionJSON = {
  id: number
  date: string
  category: Category
  subcategory?: Subcategory
  description: string
  payee?: string
  amountInCents: number
  account: Account
  hasInvoice: boolean
}
