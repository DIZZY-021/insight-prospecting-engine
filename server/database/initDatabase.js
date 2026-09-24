import db from './database.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    country TEXT NOT NULL,
    city TEXT NOT NULL,
    business_type TEXT NOT NULL,
    result_limit INTEGER NOT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    search_id INTEGER,

    osm_id INTEGER,
    name TEXT,
    category TEXT,
    location TEXT,

    phone TEXT,
    email TEXT,
    website TEXT,

    instagram TEXT,
    facebook TEXT,
    whatsapp TEXT,

    rating REAL,
    reviews INTEGER,

    opening_hours TEXT,
    cuisine TEXT,
    brand TEXT,
    operator TEXT,
    description TEXT,

    wheelchair TEXT,
    payment_methods TEXT,

    stars TEXT,
    rooms TEXT,

    address TEXT,
    street TEXT,
    suburb TEXT,
    city TEXT,
    postcode TEXT,

    google_maps TEXT,
    osm_url TEXT,

    latitude REAL,
    longitude REAL,

    digital_presence TEXT,
    website_analysis TEXT,

    opportunity_score REAL,
    opportunity_level TEXT,

    digital_problems TEXT,
    recommended_services TEXT,
    opportunity_summary TEXT,

    source TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (search_id) REFERENCES searches(id)
  );
`);

console.log('Tabelas do banco criadas/verificadas!');