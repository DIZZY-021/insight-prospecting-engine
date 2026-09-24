import Database from 'better-sqlite3';

const db = new Database('insight.db');

db.pragma('journal_mode = WAL');

console.log(' Banco SQLite conectado!');

export default db;