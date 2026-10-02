INSERT INTO categories (name)
VALUES 
    ('Charges sociales'),
    ('Rémunération'),
    ('Frais de fonctionnement'),
    ('Matériel'),
    ('Déplacements'),
    ('Autres');

INSERT INTO subcategories (category_id, name)
VALUES
    ((SELECT id FROM categories WHERE name = 'Charges sociales'), 'URSSAF'),
    ((SELECT id FROM categories WHERE name = 'Charges sociales'), 'CFP'),
    ((SELECT id FROM categories WHERE name = 'Charges sociales'), 'Impôts'),
    ((SELECT id FROM categories WHERE name = 'Charges sociales'), 'Autres cotisations');

INSERT INTO subcategories (category_id, name)
VALUES
    ((SELECT id FROM categories WHERE name = 'Rémunération'), 'Rémunération personnelle');

INSERT INTO subcategories (category_id, name)
VALUES
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Licenses & abonnements'),
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Hébergement web'),
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Domiciliation'),
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Assurance'),
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Téléphonie & Internet'),
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Frais bancaires'),
    ((SELECT id FROM categories WHERE name = 'Frais de fonctionnement'), 'Frais administratifs');

INSERT INTO subcategories (category_id, name)
VALUES
    ((SELECT id FROM categories WHERE name = 'Matériel'), 'Matériel professionnel'),
    ((SELECT id FROM categories WHERE name = 'Matériel'), 'Consommables'),
    ((SELECT id FROM categories WHERE name = 'Matériel'), 'Entretien & réparation');

INSERT INTO subcategories (category_id, name)
VALUES
    ((SELECT id FROM categories WHERE name = 'Déplacements'), 'Carburant'),
    ((SELECT id FROM categories WHERE name = 'Déplacements'), 'Péages'),
    ((SELECT id FROM categories WHERE name = 'Déplacements'), 'Stationnement'),
    ((SELECT id FROM categories WHERE name = 'Déplacements'), 'Transports en commun');
