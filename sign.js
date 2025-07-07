const crypto = require('crypto');
const fs = require('fs');
const secret = 'subwaysurf45';
const payload = fs.readFileSync('payload.json');
const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
console.log(sig); 