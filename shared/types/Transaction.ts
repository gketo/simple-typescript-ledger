import { type Category, type CategoryId, type Subcategory, type SubcategoryId } from './Category.ts'
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
  categoryId: CategoryId | undefined
  subcategoryId: SubcategoryId | undefined
  accountId: AccountId | undefined
}

export function createEmptyTransactionInput(): NewTransactionInput {
  return {
    date: '',
    categoryId: undefined,
    subcategoryId: undefined,
    description: '',
    amount: 0,
    accountId: undefined,
    hasInvoice: false,
  }
}

export function isValidTransaction(transaction: NewTransactionInput): boolean {
  return (
    transaction.date.length > 0 &&
    transaction.categoryId !== undefined &&
    transaction.description.length > 0 &&
    transaction.amount !== 0 &&
    transaction.accountId !== undefined
  )
}
