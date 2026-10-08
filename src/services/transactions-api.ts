import type { TransactionId, Transaction, TransactionJSON } from '@shared/types//Transaction'

import type { TransactionFormData } from '../types/TransactionFormData.ts'

import { ApiError } from './ApiError.ts'

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch('http://localhost:3000/transactions')

  if (!response.ok) {
    let message = 'Failed to load transactions'

    try {
      const error = await response.json()
      message = error.message ?? message
    } catch {
      // Response wasn't JSON
    }

    throw new ApiError(message, response.status)
  }

  const data = await response.json()

  const transactionsJSON: TransactionJSON[] = data.transactions

  const transactions: Transaction[] = transactionsJSON.map((transactionJSON) => {
    const temp: Transaction = {
      id: transactionJSON.id,
      date: new Date(transactionJSON.date),
      category: transactionJSON.category,
      description: transactionJSON.description,
      amountInCents: transactionJSON.amountInCents,
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

export async function postTransaction(transaction: TransactionFormData): Promise<Transaction> {
  const response = await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })

  if (!response.ok) {
    let message = 'Failed to create transaction'

    try {
      const error = await response.json()
      message = error.message ?? message
    } catch {
      // Response wasn't JSON
    }

    throw new ApiError(message, response.status)
  }

  const newTransaction: Transaction = await response.json()

  return {
    ...newTransaction,
    date: new Date(newTransaction.date),
  }
}

export async function deleteTransaction(id: TransactionId): Promise<TransactionId> {
  const response = await fetch(`http://localhost:3000/transactions/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    let message = 'Failed to delete transaction'

    try {
      const error = await response.json()
      message = error.message ?? message
    } catch {
      // Response wasn't JSON
    }

    throw new ApiError(message, response.status)
  }

  return id
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
    let message = 'Failed to update transaction'

    try {
      const error = await response.json()
      message = error.message ?? message
    } catch {
      // Response wasn't JSON
    }

    throw new ApiError(message, response.status)
  }

  const modified: Transaction = await response.json()

  return {
    ...modified,
    date: new Date(modified.date),
  }
}
