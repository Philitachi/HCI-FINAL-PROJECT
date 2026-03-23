const https = require('https');

https.get('https://psgc.gitlab.io/api/barangays/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const barangays = JSON.parse(data);
    console.log('Sample barangay:', JSON.stringify(barangays[0], null, 2));
    console.log('Total:', barangays.length);
  });
});
