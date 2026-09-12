const API_BASE = 'http://192.168.1.5:4000';

async function aiQuery(query) {
  const res = await fetch(`${API_BASE}/ai/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'AI request failed');
  }

  return data;
}

export default { aiQuery };
