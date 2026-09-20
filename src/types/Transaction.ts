export interface Transaction {
  id: number
  date: Date
  description: string
  amount: number
}

export type TransactionJSON = Omit<Transaction, 'date'> & { date: string }

export type CreateTransactionInput = Omit<TransactionJSON, 'id'>
