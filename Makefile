reset:
	rm -f database/ledger.db
	sqlite3 database/ledger.db < database/schema.sql
	sqlite3 database/ledger.db < database/seed.sql
	sqlite3 database/ledger.db < database/exampleData.sql