// mobile_expo/src/api.js
import { ENDPOINTS } from './config';

// small timeout wrapper around fetch
function fetchWithTimeout(url, options = {}, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
}

async function postJson(url, body, opts = {}) {
  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      body: JSON.stringify(body),
    }, opts.timeout || 10000);

    if (!res.ok) {
      let json = null;
      try { json = await res.json(); } catch (e) { /* ignore */ }
      const message = (json && (json.error || json.message)) || `HTTP ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.body = json;
      throw err;
    }

    return await res.json();
  } catch (err) {
    if (err.message === 'timeout' || err.name === 'TypeError') {
      const e2 = new Error('Network Error');
      e2.code = 'NETWORK_ERROR';
      throw e2;
    }
    throw err;
  }
}

// specific AI query call
export async function aiQuery(query, opts = {}) {
  if (!query || typeof query !== 'string') {
    throw new Error('query required');
  }
  return await postJson(ENDPOINTS.AI_QUERY, { query }, { timeout: opts.timeout || 15000 });
}

export default {
  aiQuery
};
