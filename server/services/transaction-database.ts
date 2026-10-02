import { DatabaseSync } from 'node:sqlite'

const database = new DatabaseSync('./database/ledger.db')

export function dbGetTransactions(): Transaction[] {
  const sqlQuery = database.prepare(`
    SELECT 
      t.*,
      c.name as category,
      sc.name as subcategory
    FROM transactions t 
      LEFT JOIN categories c
        ON t.category_id = c.id
      LEFT JOIN subcategories sc 
        ON t.subcategory_id = sc.id 
    ORDER BY date
  `)

  const data = sqlQuery.all()

  return data
}

export function dbCreateTransaction(input: NewTransactionInput): TransactionId {
  const sqlInsert = database.prepare(`
    INSERT INTO
      transactions (
        date, 
        category_id,
        subcategory_id,
        description,
        payee,
        amount,
        account,
        hasInvoice
      )
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const { changes, lastInsertRowid } = sqlInsert.run(
    input.date,
    input.categoryId,
    input.subcategoryId,
    input.description,
    input.payee,
    input.amount,
    input.account,
    input.hasInvoice,
  )

  if (changes !== 1) {
    throw new Error('Database error while creating transaction')
  }

  return lastInsertRowid
}

export function dbDeleteTransaction(id: TransactionId) {
  const sqlDelete = database.prepare(`
    DELETE FROM 
      transactions 
    WHERE 
      id = (?)
  `)

  const { changes } = sqlDelete.run(id)

  if (changes !== 1) {
    throw id
  }
}
