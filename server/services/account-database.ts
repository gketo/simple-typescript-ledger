import { database } from './database.js'

import type { Account } from '@shared/types/Account.js'

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
