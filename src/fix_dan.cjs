const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

code = code.replace(
  /export const generateReversibleSetFromDan = \(sourceDan, scored2D, targetSize\) => \{\s*const sourceNumbers = new Set\(sourceDan\.map\(s => s\.number\)\);\s*const filteredScored = scored2D\.filter\(s => sourceNumbers\.has\(s\.number\)\);\s*return generateReversibleSet\(filteredScored, targetSize\);\s*\};/m,
  `export const generateReversibleSetFromDan = (sourceDan, scored2D, targetSize) => {
    const sourceNumbers = new Set(sourceDan.map(s => typeof s === 'string' ? s : s.number));
    const filteredScored = scored2D.filter(s => sourceNumbers.has(s.number));
    return generateReversibleSet(filteredScored, targetSize);
  };`
);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Fixed generateReversibleSetFromDan');
