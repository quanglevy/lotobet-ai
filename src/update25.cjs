const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  'pD2, pD4, pD10, pD20, pCham, p5Tinh',
  'pD2, pD4, pD10, pD20, pCham, p5Tinh, pTXCL, actualTXCL'
);

fs.writeFileSync('src/App.jsx', c, 'utf8');
