const https = require('https');

const API_KEY = '579b464db66ec23bdd0000015b2d3b7e6f394dcf25dfd31c7be3f11d';
const RESOURCE_ID = '6cae4b3c-ed02-4186-8b8b-5de3f0d5efd9';

const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=5`;

https.get(url, (res) => {
  let body = '';
  res.on('data', c => { body += c; });
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
      console.log('Body:', body);
    }
  });
}).on('error', (e) => {
  console.error('Error fetching:', e.message);
});
