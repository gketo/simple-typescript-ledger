reset:
	rm -f ledger.db
	sqlite3 ledger.db < schema.sql
	sqlite3 ledger.db < seed.sql
	sqlite3 ledger.db < exampleData.sql