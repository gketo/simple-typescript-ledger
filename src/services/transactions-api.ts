import type { TransactionId, Transaction, TransactionJSON } from '@shared/types//Transaction'

import type { TransactionFormData } from '../types/TransactionFormData.ts'

export async function createTransaction(transaction: TransactionFormData): Promise<Transaction> {
  const response = await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })

  if (!response.ok) {
    const error = await response.json()
    throw error
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
    const error = await response.json()
    throw error
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

  const transactionsJSON: TransactionJSON[] = data.transactions

  const transactions: Transaction[] = transactionsJSON.map((transactionJSON) => {
    const temp: Transaction = {
      id: transactionJSON.id,
      date: new Date(transactionJSON.date),
      category: transactionJSON.category,
      description: transactionJSON.description,
      amount: transactionJSON.amount,
      account: transactionJSON.account,
      hasInvoice: transactionJSON.hasInvoice === 1,
    }

    if (transactionJSON.subcategory !== null) {
      temp.subcategory = transactionJSON.subcategory
    }
    if (transactionJSON.payee !== null) {
      temp.payee = transactionJSON.payee
    }

    return temp
  })

  return transactions
}

export async function putTransaction(
  id: TransactionId,
  transaction: TransactionFormData,
): Promise<Transaction> {
  const response = await fetch(`http://localhost:3000/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      ...transaction,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const modified: Transaction = await response.json()

  return {
    ...modified,
    date: new Date(modified.date),
  }
}
