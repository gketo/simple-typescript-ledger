INSERT INTO transactions (
    date,
    category_id,
    subcategory_id,
    description,
    payee,
    amount,
    account,
    has_invoice
)
VALUES
(
    '2026-09-01',
    (SELECT id FROM categories WHERE name = 'Frais de fonctionnement'),
    (SELECT id FROM subcategories WHERE name = 'Hébergement web'),
    'Abonnement hébergement annuel',
    'OVH',
    89.00,
    'Compte courant',
    1
),
(
    '2026-09-03',
    (SELECT id FROM categories WHERE name = 'Déplacements'),
    (SELECT id FROM subcategories WHERE name = 'Carburant'),
    'Plein de carburant',
    'TotalEnergies',
    72.50,
    'Compte courant',
    1
),
(
    '2026-09-05',
    (SELECT id FROM categories WHERE name = 'Matériel'),
    (SELECT id FROM subcategories WHERE name = 'Matériel professionnel'),
    'Écran professionnel',
    'Dell',
    349.99,
    'Compte courant',
    1
),
(
    '2026-09-08',
    (SELECT id FROM categories WHERE name = 'Charges sociales'),
    (SELECT id FROM subcategories WHERE name = 'URSSAF'),
    'Cotisations sociales',
    'URSSAF',
    1250.00,
    'Compte courant',
    1
),
(
    '2026-09-10',
    (SELECT id FROM categories WHERE name = 'Frais de fonctionnement'),
    (SELECT id FROM subcategories WHERE name = 'Téléphonie & Internet'),
    'Abonnement Internet',
    'Orange',
    39.99,
    'Compte courant',
    1
),
(
    '2026-09-12',
    (SELECT id FROM categories WHERE name = 'Déplacements'),
    (SELECT id FROM subcategories WHERE name = 'Péages'),
    'Péage déplacement client',
    'Vinci Autoroutes',
    14.80,
    'Compte courant',
    0
),
(
    '2026-09-15',
    (SELECT id FROM categories WHERE name = 'Rémunération'),
    (SELECT id FROM subcategories WHERE name = 'Rémunération personnelle'),
    'Rémunération septembre',
    NULL,
    1800.00,
    'Compte courant',
    0
);
