// backend/utils/translate.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // or global fetch on newer Node

const CACHE_DIR = path.join(__dirname, '..', 'translations_cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// Config: set LIBRE_URL or GOOGLE_API_KEY via env
const LIBRE_URL = process.env.LIBRE_URL || 'http://127.0.0.1:5000'; // default local libre
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || null;

async function callLibreTranslate(text, source = 'auto', target = 'hi') {
  const res = await fetch(`${LIBRE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ q: text, source, target, format: 'text' })
  });
  const j = await res.json();
  return j.translatedText;
}

// Simple cache key
function cacheKey(itemId, lang, field) {
  return path.join(CACHE_DIR, `${itemId}__${lang}__${field}.json`);
}

async function translateField(itemId, fieldName, text, targetLang) {
  if (!text) return '';
  const ck = cacheKey(itemId, targetLang, fieldName);
  if (fs.existsSync(ck)) {
    try { return JSON.parse(fs.readFileSync(ck,'utf8')).value; } catch(e){ /* ignore */ }
  }
  // choose engine: prefer LibreTranslate (local, zero-cost). Fallback to text itself
  let translated = text;
  try {
    if (GOOGLE_API_KEY) {
      // Use Google Translate REST (note: paid)
      const resp = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ q: text, target: targetLang })
      });
      const body = await resp.json();
      if (body && body.data && body.data.translations && body.data.translations[0]) {
        translated = body.data.translations[0].translatedText;
      }
    } else {
      translated = await callLibreTranslate(text, 'auto', targetLang);
    }
  } catch(err) {
    console.warn('Translate failed', err.message || err);
    translated = text; // fallback to original
  }
  try { fs.writeFileSync(ck, JSON.stringify({ value: translated }), 'utf8'); } catch(e){/* ignore */}
  return translated;
}

module.exports = { translateField };
