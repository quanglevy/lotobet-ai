const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Use simple string replacement
const target1 = `    const pFilteredScored2D = pCauScore.filter(item => pTop3Digits.includes(item.number[0]) || pTop3Digits.includes(item.number[1]));
    const pPool20 = pFilteredScored2D.length >= 20 ? pFilteredScored2D : pCauScore;
    const pD20 = generateReversibleSet(pPool20, 20);`;
    
const replacement1 = `    const pD20 = generateReversibleSet(pCauScore, 20);`;

const target2 = `  const filteredScored2D = cauScore.filter(item => top3Digits.includes(item.number[0]) || top3Digits.includes(item.number[1]));
  const pool20 = filteredScored2D.length >= 20 ? filteredScored2D : cauScore;
  const dan20 = generateReversibleSet(pool20, 20);`;

const replacement2 = `  const dan20 = generateReversibleSet(cauScore, 20);`;

// Regex alternative that ignores whitespace
code = code.replace(/const pFilteredScored2D[\s\S]*?generateReversibleSet\(pPool20, 20\);/g, replacement1);
code = code.replace(/const filteredScored2D[\s\S]*?generateReversibleSet\(pool20, 20\);/g, replacement2);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Forced removal of filters!");
