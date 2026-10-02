import type { NewTransactionInput, TransactionId, Transaction } from '@/types/Transaction'

export async function createTransaction(transaction: NewTransactionInput): Promise<Transaction> {
  const response = await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })

  if (!response.ok) {
    throw response.status
  }

  const newTransaction: Transaction = await response.json()

  return {
    ...newTransaction,
    date: new Date(newTransaction.date),
  }
}

export async function removeTransaction(id: TransactionId): Promise<TransactionId> {
  const response = await fetch(`http://localhost:3000/transactions/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw response.status
  }

  const data = await response.json()
  return data.id
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch('http://localhost:3000/transactions')

  if (!response.ok) {
    throw response.status
  }

  const data = await response.json()

  const transactionsJSON: Transaction[] = data.transactions

  const transactions = transactionsJSON.map((transactionJSON) => ({
    ...transactionJSON,
    date: new Date(transactionJSON.date),
  }))

  return transactions
}
