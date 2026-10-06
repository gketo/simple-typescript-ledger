import type { Category, Subcategory } from '@shared/types//Category'
import type { Account } from '@shared/types//Account'

export interface TransactionFormData {
  date: string
  category: Category | undefined
  subcategory: Subcategory | undefined
  description: string
  payee?: string
  amount: number
  account: Account | undefined
  hasInvoice: boolean
}

export function formatDateInput(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}
