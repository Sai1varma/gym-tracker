// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://fujosujxexzbrqygzlim.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1am9zdWp4ZXh6YnJxeWd6bGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzQ4MDgsImV4cCI6MjA5NzA1MDgwOH0.EHHWF5JBgcq7eE7vHI2rkda-qVUGzJF27H3khgD3Y8E';
const TABLE = 'gym_log';

const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'return=representation'
};

// ===== FETCH ALL ENTRIES =====
// Returns a plain object: { "YYYY-MM-DD": { type, tags, note }, ... }
async function dbLoadAll() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=date,type,tags,note`, {
    headers: HEADERS
  });
  if (!res.ok) throw new Error('Failed to load data');
  const rows = await res.json();
  const map = {};
  rows.forEach(r => { map[r.date] = { type: r.type, tags: r.tags || [], note: r.note || '' }; });
  return map;
}

// ===== UPSERT ONE ENTRY =====
// Inserts or updates (on conflict of date column)
async function dbSave(date, type, tags, note) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ date, type, tags, note })
  });
  if (!res.ok) throw new Error('Failed to save entry');
  return res.json();
}

// ===== DELETE ONE ENTRY =====
async function dbDelete(date) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?date=eq.${date}`, {
    method: 'DELETE',
    headers: HEADERS
  });
  if (!res.ok) throw new Error('Failed to delete entry');
}
