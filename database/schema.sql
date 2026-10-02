PRAGMA foreign_keys = ON;

CREATE TABLE categories(
   id INTEGER PRIMARY KEY,
   name TEXT NOT NULL UNIQUE
);

CREATE TABLE subcategories
(
    id INTEGER PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL UNIQUE,
    FOREIGN KEY (category_id) 
        REFERENCES categories(id)
);

CREATE TABLE transactions(
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    description TEXT NOT NULL,
    payee TEXT,
    amount REAL NOT NULL,
    account TEXT NOT NULL,
    has_invoice BOOLEAN CHECK (has_invoice IN (0, 1)) DEFAULT FALSE,
    FOREIGN KEY (category_id)
        REFERENCES categories(id),
    FOREIGN KEY (subcategory_id)
        REFERENCES subcategories(id)
);
