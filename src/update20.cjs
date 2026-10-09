const fs = require('fs');

// 1. Fix App.jsx render3s5t (UI display of wins)
let appContent = fs.readFileSync('src/App.jsx', 'utf8');
appContent = appContent.replace(
  /const resultDigits = fullResult\.substring\(0,2\) \+ fullResult\.substring\(3,5\);/g,
  'const resultDigits = fullResult; // 5 Tinh means check all 5 digits'
);
fs.writeFileSync('src/App.jsx', appContent, 'utf8');

// 2. Fix statistics.js analyzeSingleDigits (AI learning data)
let statsContent = fs.readFileSync('src/utils/statistics.js', 'utf8');
statsContent = statsContent.replace(
  /const digits = \[\.\.\.new Set\(draw\.Result\.substring\(0, 2\)\.split\(''\)\.concat\(draw\.Result\.substring\(3, 5\)\.split\(''\)\)\)\];/g,
  "const digits = [...new Set(draw.Result.split(''))]; // 5 Tinh learns from all 5 digits"
);

// There is also a second instance of this in the lastDraw logic in statistics.js
statsContent = statsContent.replace(
  /const lastDigits = \[\.\.\.new Set\(lastDraw\.Result\.substring\(0, 2\)\.split\(''\)\.concat\(lastDraw\.Result\.substring\(3, 5\)\.split\(''\)\)\)\];/g,
  "const lastDigits = [...new Set(lastDraw.Result.split(''))];"
);
fs.writeFileSync('src/utils/statistics.js', statsContent, 'utf8');
