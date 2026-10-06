import { type Category, type CategoryId, type Subcategory } from './Category.js'
import type { Account } from './Account.ts'

export interface Transaction {
  id: number
  date: Date
  category: Category
  subcategory?: Subcategory
  description: string
  payee?: string
  amountInCents: number
  account: Account
  hasInvoice: boolean
}

export type TransactionId = Transaction['id']

export type TransactionJSON = {
  id: number
  date: string
  category: Category
  subcategory?: Subcategory
  description: string
  payee?: string
  amountInCents: number
  account: Account
  hasInvoice: number
}
