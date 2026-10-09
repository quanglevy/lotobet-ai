const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace(/const scoredSingles = analyzeSingleDigits\(rawData\);`n      const scored2D = calculateCauScore\(stats2D, scoredTongs, scoredSingles\);/, 'const scoredSingles = analyzeSingleDigits(rawData);\n      const scored2D = calculateCauScore(stats2D, scoredTongs, scoredSingles);');

// Also, the second stray one is still there, let's remove it!
c = c.replace(/const d2 = generateReversibleSetFromDan\(d4, scored2D, 2\); \r?\n\r?\n    const scoredSingles = analyzeSingleDigits\(rawData\);/, 'const d2 = generateReversibleSetFromDan(d4, scored2D, 2);');

fs.writeFileSync('src/App.jsx', c, 'utf8');
