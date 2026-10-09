const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Remove pFilteredScored2D
code = code.replace(
  /const pFilteredScored2D = pCauScore\.filter\(item => pTop3Digits\.includes\(item\.number\[0\]\) \|\| pTop3Digits\.includes\(item\.number\[1\]\)\);\n\s*const pPool20 = pFilteredScored2D\.length >= 20 \? pFilteredScored2D : pCauScore;\n\s*const pD20 = generateReversibleSet\(pPool20, 20\);/g,
  "const pD20 = generateReversibleSet(pCauScore, 20);"
);

// Remove filteredScored2D
code = code.replace(
  /const filteredScored2D = cauScore\.filter\(item => top3Digits\.includes\(item\.number\[0\]\) \|\| top3Digits\.includes\(item\.number\[1\]\)\);\n\s*const pool20 = filteredScored2D\.length >= 20 \? filteredScored2D : cauScore;\n\s*const dan20 = generateReversibleSet\(pool20, 20\);/g,
  "const dan20 = generateReversibleSet(cauScore, 20);"
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Removed restrictive filters in App.jsx");
