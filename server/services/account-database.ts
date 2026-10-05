import { database } from './database'

import { Account } from '../../src/types/Account'

const queryAccounts = database.prepare(
  `
    SELECT 
      *
    FROM
      accounts
  `,
)

export function dbGetAccounts(): Account[] {
  const data = queryAccounts.all() as unknown as Account[]

  return data
}
