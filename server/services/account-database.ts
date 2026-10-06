import { database } from './database.ts'

import type { Account } from '../../shared/types/Account.ts'

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
