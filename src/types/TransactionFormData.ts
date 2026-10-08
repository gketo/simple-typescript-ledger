import type { Account } from '@shared/types/Account'
import type { Category } from '@shared/types/Category'
import type { Subcategory } from '@shared/types/Subcategory.js'

export interface TransactionFormData {
  date: string
  category: Category | undefined
  subcategory: Subcategory | undefined
  description: string
  payee?: string
  amountInCents: number
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
