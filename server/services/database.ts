import { DatabaseSync } from 'node:sqlite'

export const database = new DatabaseSync('./database/ledger.db')
