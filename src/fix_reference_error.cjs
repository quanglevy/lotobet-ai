const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const anchor = 'const cauScore = calculateCauScore(scored2D, scoredTongs, scoredSingles, rawData);';
const declarations = `
  const dan64 = generateReversibleSet(cauScore, 64);
  const dan36 = generateReversibleSetFromDan(dan64, cauScore, 36);
  const dan20 = generateReversibleSetFromDan(dan36, cauScore, 20);
  const dan10 = generateReversibleSetFromDan(dan20, cauScore, 10);
  const dan4 = generateReversibleSetFromDan(dan10, cauScore, 4);
  const dan2 = generateReversibleSetFromDan(dan4, cauScore, 2);
  const txcl = predictTXCL(rawData);
`;

if (code.includes(anchor) && !code.includes('const dan64 =')) {
    code = code.replace(anchor, anchor + '\n' + declarations);
    fs.writeFileSync('src/App.jsx', code, 'utf8');
    console.log('Successfully injected missing variable declarations!');
} else if (!code.includes(anchor)) {
    console.log('Error: Could not find anchor calculateCauScore in App.jsx.');
} else {
    console.log('Variables already exist.');
}
