import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "audit.db");

export interface AuditEntry {
  id?: number;
  timestamp: string;
  request: string;
  scenario: string;
  decision: string;
  disclosedClaims: string;
  proofHash: string | null;
  txHash: string | null;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        request TEXT NOT NULL,
        scenario TEXT NOT NULL DEFAULT '',
        decision TEXT NOT NULL,
        disclosedClaims TEXT NOT NULL DEFAULT '',
        proofHash TEXT,
        txHash TEXT
      )
    `);
  }
  return db;
}

export function insertEntry(entry: Omit<AuditEntry, "id">): AuditEntry {
  const stmt = getDb().prepare(`
    INSERT INTO audit (timestamp, request, scenario, decision, disclosedClaims, proofHash, txHash)
    VALUES (@timestamp, @request, @scenario, @decision, @disclosedClaims, @proofHash, @txHash)
  `);
  const result = stmt.run(entry);
  return { id: Number(result.lastInsertRowid), ...entry };
}

export function getAllEntries(): AuditEntry[] {
  return getDb().prepare("SELECT * FROM audit ORDER BY id DESC").all() as AuditEntry[];
}

export function clearEntries(): void {
  getDb().prepare("DELETE FROM audit").run();
}
