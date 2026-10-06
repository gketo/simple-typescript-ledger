INSERT INTO accounts (name)
VALUES
('Compte Courant'),
('Compte Pro');


INSERT INTO transactions (
    date,
    category_id,
    subcategory_id,
    description,
    payee,
    amount_cents,
    account_id,
    has_invoice
)
VALUES
(
    '2026-09-01',
    (SELECT id FROM categories WHERE name = 'Frais de fonctionnement'),
    (SELECT id FROM subcategories WHERE name = 'Hébergement web'),
    'Abonnement hébergement annuel',
    'OVH',
    8900,
    (SELECT id FROM accounts WHERE name = 'Compte Courant'),
    1
),
(
    '2026-09-03',
    (SELECT id FROM categories WHERE name = 'Déplacements'),
    (SELECT id FROM subcategories WHERE name = 'Carburant'),
    'Plein de carburant',
    'TotalEnergies',
    7250,
    (SELECT id FROM accounts WHERE name = 'Compte Courant'),
    1
),
(
    '2026-09-05',
    (SELECT id FROM categories WHERE name = 'Matériel'),
    (SELECT id FROM subcategories WHERE name = 'Matériel professionnel'),
    'Écran professionnel',
    'Dell',
    34999,
    (SELECT id FROM accounts WHERE name = 'Compte Courant'),
    1
),
(
    '2026-09-08',
    (SELECT id FROM categories WHERE name = 'Charges sociales'),
    (SELECT id FROM subcategories WHERE name = 'URSSAF'),
    'Cotisations sociales',
    'URSSAF',
    125000,
    (SELECT id FROM accounts WHERE name = 'Compte Courant'),
    1
),
(
    '2026-09-10',
    (SELECT id FROM categories WHERE name = 'Frais de fonctionnement'),
    (SELECT id FROM subcategories WHERE name = 'Téléphonie & Internet'),
    'Abonnement Internet',
    'Orange',
    3999,
    (SELECT id FROM accounts WHERE name = 'Compte Courant'),
    1
),
(
    '2026-09-12',
    (SELECT id FROM categories WHERE name = 'Déplacements'),
    -- (SELECT id FROM subcategories WHERE name = 'Péages'),
    NULL,
    'Péage déplacement client',
    'Vinci Autoroutes',
    1480,
    (SELECT id FROM accounts WHERE name = 'Compte Pro'),
    0
),
(
    '2026-09-15',
    (SELECT id FROM categories WHERE name = 'Rémunération'),
    -- (SELECT id FROM subcategories WHERE name = 'Rémunération personnelle'),
    NULL,
    'Rémunération septembre',
    NULL,
    180000,
    (SELECT id FROM accounts WHERE name = 'Compte Pro'),
    0
);
