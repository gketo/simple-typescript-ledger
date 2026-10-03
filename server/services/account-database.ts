import { DatabaseSync } from 'node:sqlite'

const database = new DatabaseSync('./database/ledger.db')

export function dbGetAccounts(): Account[] {
  const sqlQuery = database.prepare(`
    SELECT 
      *
    FROM
      accounts
  `)

  const data = sqlQuery.all() as Account[]

  return data
}
