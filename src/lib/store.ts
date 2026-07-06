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

let memoryStore: AuditEntry[] = [];
let nextId = 1;

function isKvConfigured(): boolean {
  return !!process.env.KV_URL;
}

function getKv() {
  return import("@vercel/kv").then((m) => m.kv);
}

const KV_KEY = "audit:entries";

export async function insertEntry(entry: Omit<AuditEntry, "id">): Promise<AuditEntry> {
  const full: AuditEntry = { id: nextId++, ...entry };
  if (isKvConfigured()) {
    const kv = await getKv();
    await kv.lpush(KV_KEY, full);
  } else {
    memoryStore.unshift(full);
  }
  return full;
}

export async function getAllEntries(): Promise<AuditEntry[]> {
  if (isKvConfigured()) {
    const kv = await getKv();
    return (await kv.lrange(KV_KEY, 0, -1)) as AuditEntry[];
  }
  return [...memoryStore];
}

export async function clearEntries(): Promise<void> {
  if (isKvConfigured()) {
    const kv = await getKv();
    await kv.del(KV_KEY);
  } else {
    memoryStore = [];
    nextId = 1;
  }
}
