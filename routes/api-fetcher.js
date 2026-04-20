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
  // Central Sector Scheme of Scholarship (Beneficiaries/Schemes)
  { id: 'b310c148-69b4-4e71-b3ab-d32a3af5cef7', type: 'Central', level: 'UG' },
  // Post Matric Scholarship Schemes for SC
  { id: 'ae2a682b-3807-44b2-a61f-0b64cdb02fb8', type: 'Central', level: 'UG' },
  // Pre-Matric, Post-Matric, and Merit-cum-Means (Allocation/Schemes)
  { id: 'bf44869a-519f-43cd-84f0-4914e32a37a8', type: 'Central', level: 'Mixed' },
  // NMMS (National Means cum Merit Scholarship)
  { id: '349d58f3-8bcc-4140-9774-4b53ef11ba18', type: 'Central', level: 'School' }
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
        // More robust name selection to avoid "random" titles
        const name =
          rec['scholarship_name'] || rec['scheme_name'] || rec['schemeName'] ||
          rec['name_of_scholarship'] || rec['Scheme'] || rec['Scholarship'] ||
          rec['Scheme Name'] || rec['title'] || '';

        // Ignore generic dataset titles or very short strings
        const nameStr = name.toString().trim();
        if (!nameStr || nameStr.length < 10 || nameStr.toLowerCase().includes('beneficiaries') || nameStr.toLowerCase().includes('dataset')) continue;

        const state = rec['state'] || rec['State'] || rec['state_name'] || rec['State/UT'] || 'All';
        const ministry = rec['ministry'] || rec['Ministry'] || rec['organization'] || rec['Department'] || 'Government of India';
        
        // Smarter guessing based on the record if available
        const actualLevel = resource.level === 'Mixed' ? guessLevel(nameStr) : resource.level;
        const classes = guessClasses(nameStr);
        const categories = guessCategories(nameStr + ' ' + (rec['category'] || ''));

        results.push({
          name: nameStr.substring(0, 200),
          type: resource.type,
          scholarship_level: actualLevel,
          eligible_classes: classes,
          eligible_categories: categories,
          eligible_gender: guessGender(nameStr),
          income_limit: 250000,
          states: state === 'All' || !state || state === 'INDIA' ? ['All'] : [state.toString().trim()],
          description: `Official ${nameStr} program. Department: ${ministry}.`,
          benefits: 'Financial assistance as per Government norms. Check NSP portal for latest amounts.',
          documents_required: ['Aadhar Card', 'Income Certificate', 'Marksheets', 'Caste Certificate (if applicable)'],
          deadline: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), // Default 5 months if unknown
          apply_link: 'https://scholarships.gov.in',
          status: 'pending',
          source: 'data.gov.in API'
        });
      }
    } catch (err) {
      console.error(`[API-Fetcher] data.gov.in ${resource.id} failed:`, err.message);
    }
  }
  console.log(`[API-Fetcher] data.gov.in total extracted: ${results.length}`);
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
    // Focus search on "List of scholarships in India" and related specific titles
    const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:scholarship%20India&utf8=1&format=json&srlimit=40';
    const raw = await fetchURL(url);
    const json = JSON.parse(raw);
    const searchResults = json.query?.search || [];

    if (searchResults.length === 0) throw new Error('No search results returned from Wikipedia API');
    console.log(`[API-Fetcher] Wikipedia API: Found ${searchResults.length} search results`);

    for (const item of searchResults) {
      const title = item.title;
      // Skip generic or meta pages
      if (
        title.toLowerCase().includes('list of') || 
        title.toLowerCase().includes('category:') || 
        title.toLowerCase().includes('education in') ||
        title.toLowerCase().includes('template:') ||
        title.length < 10
      ) continue;

      let desc = item.snippet.replace(/<\/?[^>]+(>|$)/g, "") + '...';

      results.push({
        name: title.substring(0, 200),
        type: guessType(title, desc),
        scholarship_level: guessLevel(title),
        eligible_classes: guessClasses(title),
        eligible_categories: guessCategories(title + ' ' + desc),
        eligible_gender: guessGender(title),
        income_limit: 400000,
        states: guessState(title + ' ' + desc),
        description: desc.substring(0, 500),
        benefits: 'Educational support (check Wikipedia for details)',
        documents_required: ['Identity Proof', 'Academic Transcript', 'Income Proof'],
        deadline: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        apply_link: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g,'_'))}`,
        status: 'pending',
        source: 'Wikipedia API'
      });
    }

    console.log(`[API-Fetcher] Wikipedia: ${results.length} scholarships parsed`);
  } catch (err) {
    console.error('[API-Fetcher] Wikipedia API failed:', err.message);
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
    // Specifically target fellowship programs which are high quality
    const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:fellowship%20India&utf8=1&format=json&srlimit=20';
    const raw = await fetchURL(url);
    const json = JSON.parse(raw);
    const searchResults = json.query?.search || [];

    for (const item of searchResults) {
      const title = item.title;
      if (title.toLowerCase().includes('list of') || title.toLowerCase().includes('category:')) continue;

      let desc = item.snippet.replace(/<\/?[^>]+(>|$)/g, "") + '...';

      results.push({
        name: title.substring(0, 200),
        type: 'Central',
        scholarship_level: 'Research',
        eligible_classes: ['PG'],
        eligible_categories: guessCategories(title + ' ' + desc),
        eligible_gender: guessGender(title),
        income_limit: 800000,
        states: guessState(title + ' ' + desc),
        description: desc.substring(0, 500),
        benefits: 'Research stipend and academic grants.',
        documents_required: ['Degree Certificates', 'Research Proposal', 'ID Proof'],
        deadline: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        apply_link: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g,'_'))}`,
        status: 'pending',
        source: 'Wikipedia API (Fellowships)'
      });
    }
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
  if (l.includes('state') || l.includes('govt of') || l.includes('government of')) return 'State';
  if (l.includes('private') || l.includes('foundation') || l.includes('corporate') || l.includes('trust') || l.includes('ltd') || l.includes('limited')) return 'Private';
  return 'Central';
}
function guessLevel(n='') {
  const l = n.toLowerCase();
  if (l.includes('phd') || l.includes('doctoral') || l.includes('research fellow') || l.includes('fellowship')) return 'Research';
  if (l.includes(' pg ') || l.includes("master's") || l.includes('postgrad') || l.includes('post-graduate') || l.includes('graduate')) return 'PG';
  if (l.includes('school') || l.includes('10th') || l.includes('12th') || l.includes('secondary') || l.includes('matric') || l.includes('pre-matric')) return 'School';
  return 'UG';
}
function guessClasses(n='') {
  const l = n.toLowerCase();
  if (l.includes('phd') || l.includes('research')) return ['PG'];
  if (l.includes("master's") || l.includes(' pg ')) return ['PG'];
  if (l.includes('12th') || l.includes('class 12')) return ['12th'];
  if (l.includes('11th') || l.includes('class 11')) return ['11th'];
  if (l.includes('10th') || l.includes('class 10')) return ['10th'];
  if (l.includes('matric') || l.includes('school')) return ['9th','10th','11th','12th'];
  return ['UG','PG','Diploma'];
}
function guessGender(n='') {
  const l = n.toLowerCase();
  if (l.includes(' girl') || l.includes(' woman') || l.includes(' women') || l.includes('female') || l.includes('kanya') || l.includes('beti') || l.includes('mahila')) return 'Female';
  if (l.includes(' boy') || l.includes(' male')) return 'Male';
  return 'All';
}
function guessCategories(n='') {
  const l = n.toLowerCase();
  const res = [];
  if (l.includes(' sc ') || l.includes('scheduled caste')) res.push('SC');
  if (l.includes(' st ') || l.includes('scheduled tribe')) res.push('ST');
  if (l.includes(' obc ') || l.includes('other backward')) res.push('OBC');
  if (l.includes('minority') || l.includes('muslim') || l.includes('christian') || l.includes('sikh')) res.push('Minority');
  if (l.includes('ews') || l.includes('economically weaker')) res.push('EWS');
  return res.length > 0 ? res : ['All'];
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
