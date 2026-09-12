// backend/routes/schemes.routes.js (partial)
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { translateField } = require('../utils/translate');

const DB = './data/schemes.json';

function readAll() {
  return fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB,'utf8')) : [];
}

router.get('/', async (req, res) => {
  const state = (req.query.state || '').toLowerCase();
  const lang = (req.query.lang || 'en').toLowerCase();
  const list = readAll();

  // Filter by state or include central schemes
  const filtered = list.filter(s => {
    if (!state) return true;
    // accept central schemes too
    if (s.type && s.type.toLowerCase().includes('central')) return true;
    if ((s.type || '').toLowerCase().includes('state') && ((s.type || '').toLowerCase().includes(state) || (s.state || '').toLowerCase().includes(state))) return (s.state || '').toLowerCase() === state;
    // also allow scheme.state property
    return (s.state || '').toLowerCase() === state;
  });

  // Localize fields for each scheme
  const out = [];
  for (const s of filtered) {
    const item = { id: s.id, type: s.type, category: s.category, original_language: 'en' };

    // If translations exist:
    if (s.translations && s.translations[lang]) {
      const t = s.translations[lang];
      item.title = t.title || s.title;
      item.description = t.description || s.description;
      item.eligibility = t.eligibility || s.eligibility;
      item.documents = t.documents || s.documents;
      // For subsidies, map translated subsidy names if present
      item.subsidies = s.subsidies.map(sub => {
        const subT = (t.subsidies || []).find(x => x.id === sub.id);
        return { ...sub, name: subT ? subT.name : sub.name };
      });
      item.translated = !!s.translations[lang];
    } else if (lang === 'en') {
      // English, return original
      Object.assign(item, { title: s.title, description: s.description, eligibility: s.eligibility, documents: s.documents, subsidies: s.subsidies });
      item.translated = false;
    } else {
      // Auto-translate key fields on-the-fly (async)
      item.title = await translateField(s.id, 'title', s.title, lang);
      item.description = await translateField(s.id, 'description', s.description, lang);
      // eligibility array -> join, translate, split back
      const eligText = (s.eligibility || []).join(' ||| ');
      const eligTrans = await translateField(s.id, 'eligibility', eligText, lang);
      item.eligibility = eligTrans.split(' ||| ');
      item.documents = s.documents; // documents are short - could translate similarly if needed
      // subsidies: translate each subsidy.name
      item.subsidies = [];
      for (const sub of s.subsidies || []) {
        const nameTrans = await translateField(`${s.id}_${sub.id}`, 'subsidy_name', sub.name, lang);
        item.subsidies.push({ ...sub, name: nameTrans });
      }
      item.translated = true;
      item.auto_translated = true;
    }

    out.push(item);
  }

  res.json(out);
});

module.exports = router;
