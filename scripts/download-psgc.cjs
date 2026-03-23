// Script to download PSGC data using bulk endpoints
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://psgc.gitlab.io/api';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(`Failed to parse: ${url}`)); }
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Fetch all regions
  console.log('Fetching regions...');
  const regions = await fetchJSON(`${BASE_URL}/regions/`);
  const regionsData = regions.map(r => ({
    code: r.code,
    name: `${r.regionName} (${r.name})`
  }));
  console.log(`  ${regionsData.length} regions`);

  // 2. Fetch all provinces (bulk)
  console.log('Fetching provinces...');
  const provincesRaw = await fetchJSON(`${BASE_URL}/provinces/`);
  
  // Also fetch districts for NCR
  console.log('Fetching NCR districts...');
  const districtsRaw = await fetchJSON(`${BASE_URL}/districts/`);
  
  // Group provinces by regionCode
  const provincesData = {};
  for (const p of provincesRaw) {
    if (!provincesData[p.regionCode]) provincesData[p.regionCode] = [];
    provincesData[p.regionCode].push({ code: p.code, name: p.name });
  }
  // Add NCR districts as "provinces"
  for (const d of districtsRaw) {
    if (!provincesData[d.regionCode]) provincesData[d.regionCode] = [];
    provincesData[d.regionCode].push({ code: d.code, name: d.name });
  }
  console.log(`  ${provincesRaw.length} provinces + ${districtsRaw.length} districts`);

  // 3. Fetch all cities/municipalities (bulk)
  console.log('Fetching cities/municipalities...');
  const citiesRaw = await fetchJSON(`${BASE_URL}/cities-municipalities/`);
  
  // Group cities by provinceCode OR districtCode
  const citiesData = {};
  for (const c of citiesRaw) {
    const parentCode = c.provinceCode || c.districtCode;
    if (!parentCode) continue;
    if (!citiesData[parentCode]) citiesData[parentCode] = [];
    citiesData[parentCode].push({ code: c.code, name: c.name });
  }
  console.log(`  ${citiesRaw.length} cities/municipalities`);

  // 4. Fetch all barangays (bulk) 
  console.log('Fetching barangays (this may take a moment)...');
  const barangaysRaw = await fetchJSON(`${BASE_URL}/barangays/`);
  
  // Group barangays by cityMunicipalityCode
  const barangaysData = {};
  for (const b of barangaysRaw) {
    const parentCode = b.cityCode || b.municipalityCode || b.subMunicipalityCode;
    if (!parentCode) continue;
    if (!barangaysData[parentCode]) barangaysData[parentCode] = [];
    barangaysData[parentCode].push({ code: b.code, name: b.name });
  }
  console.log(`  ${barangaysRaw.length} barangays`);

  // Save files
  fs.writeFileSync(path.join(OUTPUT_DIR, 'regions.json'), JSON.stringify(regionsData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'provinces.json'), JSON.stringify(provincesData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'cities.json'), JSON.stringify(citiesData, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'barangays.json'), JSON.stringify(barangaysData, null, 2));

  console.log('\nAll files saved to src/data/');
  console.log('  - regions.json');
  console.log('  - provinces.json (grouped by region)');
  console.log('  - cities.json (grouped by province)');
  console.log('  - barangays.json (grouped by city)');
}

main().catch(console.error);
