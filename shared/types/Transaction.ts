import { type Category, type CategoryId, type Subcategory, type SubcategoryId } from './Category.js'
import type { Account, AccountId } from './Account.ts'

export interface Transaction {
  id: number
  date: Date
  category: Category
  subcategory?: Subcategory
  description: string
  payee?: string
  amount: number
  account: Account
  hasInvoice: boolean
}

export type TransactionId = Transaction['id']

export type NewTransactionInput = Omit<
  Transaction,
  'id' | 'date' | 'category' | 'subcategory' | 'account'
> & {
  date: string
  category: Category | undefined
  subcategory: Subcategory | undefined
  account: Account | undefined
}

export function createEmptyTransactionInput(): NewTransactionInput {
  return {
    date: '',
    category: undefined,
    subcategory: undefined,
    description: '',
    amount: 0,
    account: undefined,
    hasInvoice: false,
  }
}

export function isValidTransaction(transaction: NewTransactionInput): boolean {
  return (
    transaction.date.length > 0 &&
    transaction.category !== undefined &&
    transaction.description.length > 0 &&
    transaction.amount !== 0 &&
    transaction.account !== undefined
  )
}
