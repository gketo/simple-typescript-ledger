import { database } from './database.js'

import type {
  Transaction,
  NewTransactionInput,
  TransactionId,
} from '../../shared/types/Transaction.js'

type SQLTransaction = {
  id: number
  date: string
  category: string
  subcategory: string | null
  description: string
  payee: string | null
  amount: number
  account: string
  hasInvoice: number
}

const queryTransactions = database.prepare(
  `
    SELECT 
      trans.id,
      trans.date,
      trans.description,
      trans.payee,
      trans.amount,
      trans.has_invoice AS hasInvoice,
      json_object(
        'id', cat.id, 
        'name', cat.name
      ) as category,
      CASE 
        WHEN trans.subcategory_id IS NULL
          THEN NULL
        ELSE
          json_object(
            'id', subcat.id, 
            'name', subcat.name
          ) 
      END subcategory,
      json_object(
        'id', acc.id, 
        'name', acc.name
      ) as account
    FROM transactions trans
      LEFT JOIN categories cat
        ON trans.category_id = cat.id
      LEFT JOIN subcategories subcat
        ON trans.subcategory_id = subcat.id
      LEFT JOIN accounts acc 
        ON trans.account_id = acc.id 
    ORDER BY date
  `,
)

export function dbGetTransactions(): Transaction[] {
  const data = queryTransactions.all() as unknown as SQLTransaction[]

  const transactions: Transaction[] = data.map((transactionSql) => {
    const temp: Transaction = {
      id: transactionSql.id,
      date: new Date(transactionSql.date),
      category: JSON.parse(transactionSql.category),
      description: transactionSql.description,
      amount: transactionSql.amount,
      account: JSON.parse(transactionSql.account),
      hasInvoice: transactionSql.hasInvoice === 1,
    }

    if (transactionSql.subcategory !== null) {
      temp.subcategory = JSON.parse(transactionSql.subcategory)
    }
    if (transactionSql.payee !== null) {
      temp.payee = transactionSql.payee
    }

    return temp
  })

  return transactions
}

const insertTransaction = database.prepare(
  `
    INSERT INTO
      transactions (
        date, 
        category_id,
        subcategory_id,
        description,
        payee,
        amount,
        account_id,
        has_invoice
      )
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?)
  `,
)

export function dbCreateTransaction(input: NewTransactionInput): TransactionId {
  if (input.category === undefined) {
    throw new Error('Category is required')
  } else {
    const { changes, lastInsertRowid } = insertTransaction.run(
      input.date,
      input.category.id,
      input.subcategory ? input.subcategory.id : null,
      input.description,
      input.payee ?? null,
      input.amount,
      input.account ? input.account.id : null,
      input.hasInvoice ? 1 : 0,
    )

    if (changes !== 1) {
      throw new Error('Database: Error inserting new transaction')
    }

    return Number(lastInsertRowid)
  }
}

const deleteTransaction = database.prepare(
  `
    DELETE FROM 
      transactions 
    WHERE 
      id = (?)
  `,
)

export function dbDeleteTransaction(id: TransactionId) {
  const { changes } = deleteTransaction.run(id)

  if (changes !== 1) {
    throw id
  }
}
