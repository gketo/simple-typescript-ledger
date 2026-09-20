import type { Transaction, TransactionJSON, CreateTransactionInput } from '@/types/Transaction'

export async function createTransaction(transaction: CreateTransactionInput): Promise<Transaction> {
  const response = await fetch('http://localhost:3000/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })

  if (!response.ok) {
    throw response.status
  }

  const newTransactionJSON: TransactionJSON = await response.json()

  return {
    ...newTransactionJSON,
    date: new Date(newTransactionJSON.date),
  }
}

export async function removeTransaction(id: number): Promise<number> {
  const response = await fetch(`http://localhost:3000/transaction/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw response.status
  }

  return id
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch('http://localhost:3000/transaction')

  if (!response.ok) {
    throw response.status
  }

  const data = await response.json()

  const transactionsJSON: TransactionJSON[] = data.transactions

  const transactions = transactionsJSON.map((transactionJSON) => ({
    ...transactionJSON,
    date: new Date(transactionJSON.date),
  }))

  return transactions
}
