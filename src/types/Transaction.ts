import { type Category, type CategoryId, type Subcategory, type SubcategoryId } from './Category.ts'

export interface Transaction {
  id: number
  date: Date
  category: Category
  subcategory?: Subcategory
  description: string
  payee?: string
  amount: number
  account: string
  hasInvoice: boolean
}

export type TransactionId = Transaction['id']

export type TransactionAsJSON = Omit<Transaction, 'date'> & { date: string }

export type NewTransactionInput = Omit<TransactionAsJSON, 'id' | 'category' | 'subcategory'> & {
  categoryId: CategoryId | undefined
  subcategoryId: SubcategoryId | undefined
}

export function createEmptyTransactionInput(): NewTransactionInput {
  return {
    date: '',
    categoryId: undefined,
    subcategoryId: undefined,
    description: '',
    amount: 0,
    account: '',
    hasInvoice: false,
  }
}

export function isValidTransaction(transaction: NewTransactionInput): boolean {
  return (
    transaction.date.length > 0 &&
    transaction.categoryId !== undefined &&
    transaction.description.length > 0 &&
    transaction.amount !== 0 &&
    transaction.account.length > 0
  )
}
