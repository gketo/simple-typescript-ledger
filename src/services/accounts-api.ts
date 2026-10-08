import type { Account } from '@shared/types/Account'

export async function fetchAccounts(): Promise<Account[]> {
  const response = await fetch('http://localhost:3000/accounts')

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const data = await response.json()

  return data.accounts
}
