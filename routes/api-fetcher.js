const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const zlib = require('zlib');
const Scholarship = require('../models/Scholarship');
const { protect, admin } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helper — fetch JSON/text, handles gzip, follows redirects
// ─────────────────────────────────────────────────────────────────────────────
function fetchURL(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https://') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ScholarshipBot/1.0)',
        'Accept': 'application/json, application/xml, text/html, */*',
        'Accept-Encoding': 'gzip, deflate',
      },
      timeout: 15000
    }, (res) => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        if (redirectsLeft === 0) return reject(new Error('Too many redirects'));
        res.resume();
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return resolve(fetchURL(next, redirectsLeft - 1));
      }
      if (res.statusCode < 200 || res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }

      const enc = res.headers['content-encoding'];
      let stream = res;
      if (enc === 'gzip')    stream = res.pipe(zlib.createGunzip());
      if (enc === 'deflate') stream = res.pipe(zlib.createInflate());

      stream.setEncoding('utf8');
      let body = '';
      stream.on('data', c => { body += c; });
      stream.on('end', () => resolve(body));
      stream.on('error', reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
    req.on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 1 — data.gov.in API
// India's official open government data platform — FREE, no sign-up required
// Datasets: Central scholarship schemes, NSP disbursement stats, etc.
// ─────────────────────────────────────────────────────────────────────────────
const DATA_GOV_API_KEY = '579b464db66ec23bdd0000015b2d3b7e6f394dcf25dfd31c7be3f11d';

// Each entry: { resourceId, defaultType, defaultLevel }
const DATA_GOV_RESOURCES = [
  // Central scholarship disbursement data (NSP)
  { id: '6cae4b3c-ed02-4186-8b8b-5de3f0d5efd9', type: 'Central', level: 'UG' },
  // State-wise scholarship statistics
  { id: 'c7e57af5-6699-4fd3-badb-f4f5f6b71c2f', type: 'Central', level: 'School' },
  // Minority scholarship data
  { id: '9ef84268-d588-465a-a308-a864a43d0070', type: 'Central', level: 'UG' },
];

async function scrapeDataGovIn() {
  const results = [];
  for (const resource of DATA_GOV_RESOURCES) {
    try {
      const url = `https://api.data.gov.in/resource/${resource.id}?api-key=${DATA_GOV_API_KEY}&format=json&limit=100&offset=0`;
      const raw = await fetchURL(url);
      const json = JSON.parse(raw);

      const records = json.records || json.data || [];
      console.log(`[API-Fetcher] data.gov.in resource ${resource.id}: ${records.length} records`);

      for (const rec of records) {
        // The field names vary by dataset — pick whichever has scholarship name info
        const name =
          rec['scholarship_name'] || rec['scheme_name'] || rec['schemeName'] ||
          rec['name_of_scholarship'] || rec['Scholarship Name'] || rec['Scheme Name'] ||
          rec['title'] || '';

        if (!name || name.toString().trim().length < 5) continue;

        const state = rec['state'] || rec['State'] || rec['state_name'] || 'All';
        const ministry = rec['ministry'] || rec['Ministry'] || rec['organization'] || 'Government of India';

        results.push({
          name: name.toString().trim().substring(0, 200),
          type: resource.type,
          scholarship_level: resource.level,
          eligible_classes: ['UG','PG','Diploma'],
          eligible_categories: ['All'],
          eligible_gender: 'All',
          income_limit: 500000,
          states: state === 'All' || !state ? ['All'] : [state.toString().trim()],
          description: `${name}. Offered by: ${ministry}. Source: Government of India Open Data (data.gov.in).`,
          benefits: 'Financial support — check official NSP portal',
          documents_required: ['Aadhar Card','Income Certificate','Caste Certificate (if applicable)','Marksheets'],
          deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          apply_link: 'https://scholarships.gov.in',
          status: 'pending',
          source: 'data.gov.in API'
        });
      }
    } catch (err) {
      console.error(`[API-Fetcher] data.gov.in ${resource.id} failed:`, err.message);
    }
  }
  console.log(`[API-Fetcher] data.gov.in total: ${results.length}`);
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 2 — Wikipedia API (List of scholarships in India)
// Wikipedia API is completely free, no key, 100% reliable, returns JSON
// Page: https://en.wikipedia.org/wiki/List_of_scholarships_in_India
// ─────────────────────────────────────────────────────────────────────────────
async function scrapeWikipedia() {
  const results = [];
  try {
    // Use Wikipedia Search API to find real articles related to Indian Scholarships
    const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=scholarship%20in%20India&utf8=1&format=json&srlimit=30';
    const raw = await fetchURL(url);
    const json = JSON.parse(raw);
    const searchResults = json.query?.search || [];

    if (searchResults.length === 0) throw new Error('No search results returned from Wikipedia API');
    console.log(`[API-Fetcher] Wikipedia API: Found ${searchResults.length} search results`);

    for (const item of searchResults) {
      if (!item.title.toLowerCase().includes('scholarship') && !item.snippet.toLowerCase().includes('scholarship')) continue;

      let name = item.title;
      // Clean up HTML tags (like <span class="searchmatch">) from snippet
      let desc = item.snippet.replace(/<\/?[^>]+(>|$)/g, "") + '... (Read more on Wikipedia)';

      results.push({
        name: name.substring(0, 200),
        type: guessType(name, desc),
        scholarship_level: guessLevel(name),
        eligible_classes: guessClasses(name),
        eligible_categories: ['All'],
        eligible_gender: guessGender(name),
        income_limit: 600000,
        states: guessState(name + ' ' + desc),
        description: desc.substring(0, 500),
        benefits: 'Educational Support — check official portal',
        documents_required: ['Aadhar Card','Income Certificate','Marksheets'],
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        apply_link: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g,'_'))}`,
        status: 'pending',
        source: 'Wikipedia API (Search)'
      });
    }

    console.log(`[API-Fetcher] Wikipedia: ${results.length} scholarships parsed`);
  } catch (err) {
    console.error('[API-Fetcher] Wikipedia API failed:', err.message);
    throw err; // re-throw so caller marks it as failed
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 3 — Wikipedia API (List of government scholarships in India)
// A second Wikipedia article with more state-level schemes
// ─────────────────────────────────────────────────────────────────────────────
async function scrapeWikipedia2() {
  const results = [];
  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=fellowships%20in%20India&utf8=1&format=json&srlimit=20';
    const raw = await fetchURL(url);
    const json = JSON.parse(raw);
    const searchResults = json.query?.search || [];

    for (const item of searchResults) {
      if (!item.title.toLowerCase().includes('fellowship') && !item.snippet.toLowerCase().includes('fellowship')) continue;

      let name = item.title;
      let desc = item.snippet.replace(/<\/?[^>]+(>|$)/g, "") + '...';

      results.push({
        name: name.substring(0,200),
        type: 'Central',
        scholarship_level: 'Research',
        eligible_classes: ['PG'],
        eligible_categories: ['All'],
        eligible_gender: guessGender(name),
        income_limit: 600000,
        states: guessState(name + ' ' + desc),
        description: desc.substring(0, 500),
        benefits: 'Research Stipend & Grants',
        documents_required: ['Aadhar Card', 'Degree Certificates'],
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        apply_link: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g,'_'))}`,
        status: 'pending',
        source: 'Wikipedia API (Fellowships)'
      });
    }
    console.log(`[API-Fetcher] Wikipedia2: ${results.length} fellowships found`);
  } catch (err) {
    console.error('[API-Fetcher] Wikipedia2 failed:', err.message);
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIFICATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function guessType(n='', d='') {
  const l = (n + ' ' + d).toLowerCase();
  if (l.includes('state')) return 'State';
  if (l.includes('private') || l.includes('foundation') || l.includes('corporate') || l.includes('trust')) return 'Private';
  return 'Central';
}
function guessLevel(n='') {
  const l = n.toLowerCase();
  if (l.includes('phd')||l.includes('doctoral')||l.includes('research fellow')) return 'Research';
  if (l.includes(' pg ')||l.includes("master's")||l.includes('postgrad')) return 'PG';
  if (l.includes('school')||l.includes('10th')||l.includes('12th')||l.includes('secondary')||l.includes('matric')) return 'School';
  return 'UG';
}
function guessClasses(n='') {
  const l = n.toLowerCase();
  if (l.includes('phd')||l.includes('research')) return ['PG'];
  if (l.includes("master's")||l.includes(' pg ')) return ['PG'];
  if (l.includes('12th')||l.includes('class 12')) return ['11th','12th'];
  if (l.includes('10th')||l.includes('class 10')) return ['9th','10th'];
  return ['UG','PG','Diploma'];
}
function guessGender(n='') {
  const l = n.toLowerCase();
  if (l.includes(' girl')||l.includes(' woman')||l.includes(' women')||l.includes('female')||l.includes('kanya')||l.includes('beti')) return 'Female';
  return 'All';
}
function guessState(n='') {
  const l = n.toLowerCase();
  const map = {
    'maharashtra':'Maharashtra','karnataka':'Karnataka','gujarat':'Gujarat','rajasthan':'Rajasthan',
    'uttar pradesh':'Uttar Pradesh','madhya pradesh':'Madhya Pradesh','west bengal':'West Bengal',
    'odisha':'Odisha','assam':'Assam','bihar':'Bihar','kerala':'Kerala','tamil':'Tamil Nadu',
    'andhra':'Andhra Pradesh','telangana':'Telangana','punjab':'Punjab','haryana':'Haryana',
    'jharkhand':'Jharkhand','uttarakhand':'Uttarakhand','himachal':'Himachal Pradesh',
    'chhattisgarh':'Chhattisgarh','goa':'Goa','delhi':'Delhi','manipur':'Manipur',
    'meghalaya':'Meghalaya','tripura':'Tripura','jammu':'Jammu and Kashmir','sikkim':'Sikkim'
  };
  for (const [k,v] of Object.entries(map)) if (l.includes(k)) return [v];
  return ['All'];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ROUTE — POST /api/fetch/run
// ─────────────────────────────────────────────────────────────────────────────
router.post('/run', protect, admin, async (req, res) => {
  console.log('\n[API-Fetcher] ══════════ Starting API Pull ══════════');

  const sources = [
    { name: 'Wikipedia API (Main)',   fn: scrapeWikipedia },
    { name: 'Wikipedia API (Gov)',    fn: scrapeWikipedia2 },
    { name: 'data.gov.in API',        fn: scrapeDataGovIn },
  ];

  const report = [];
  let allItems = [];

  for (const src of sources) {
    try {
      const items = await src.fn();
      report.push({ name: src.name, found: items.length, error: null });
      allItems = allItems.concat(items);
    } catch (err) {
      console.error(`[API-Fetcher] ${src.name} failed:`, err.message);
      report.push({ name: src.name, found: 0, error: err.message });
    }
  }

  const BAD = new Set(['see also','references','notes','further reading','external links','click here','read more']);
  const valid = allItems.filter(s => s.name.length > 5 && !BAD.has(s.name.toLowerCase()));

  let newAdded = 0, dups = 0;
  for (const sch of valid) {
    const exists = await Scholarship.findOne({ name: sch.name });
    if (!exists) { await Scholarship.create(sch); newAdded++; }
    else dups++;
  }

  console.log(`[API-Fetcher] ══════════ Done: +${newAdded} new ══════════\n`);

  res.json({
    success: true,
    summary: `${newAdded} new scholarship${newAdded !== 1 ? 's' : ''} added to pending queue`,
    sources: report,
    totalValid: valid.length,
    newAdded,
    duplicatesSkipped: dups
  });
});

// PING health check (public)
router.get('/ping', (req, res) => res.json({ ok: true, time: new Date() }));

module.exports = router;
