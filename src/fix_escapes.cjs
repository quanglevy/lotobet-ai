const fs = require('fs');
let c = fs.readFileSync('src/utils/statistics.js', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync('src/utils/statistics.js', c, 'utf8');
