const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replace Current Predictions block
const oldCurrentRegex = /const stats2D = analyzeUnified2D\(rawData\);\s*const scored2D = calculateCauScore\(stats2D\);\s*const scoredTongs = analyzeTong\(rawData\);\s*const d10 = generateDanByTong\(scoredTongs\.slice\(0, 1\)\);\s*const d20 = generateDanByTong\(scoredTongs\.slice\(0, 2\)\);\s*const d2 = generateReversibleSetFromDan\(d10, scored2D, 2\);\s*const d4 = generateReversibleSetFromDan\(d10, scored2D, 4\);/m;

const newCurrent = `const scoredTongs = analyzeTong(rawData);
      const scoredSingles = analyzeSingleDigits(rawData);
      const stats2D = analyzeUnified2D(rawData);
      const scored2D = calculateCauScore(stats2D, scoredTongs, scoredSingles);
      
      const d20 = generateReversibleSet(scored2D, 20);
      const d10 = generateReversibleSetFromDan(d20, scored2D, 10); 
      const d4 = generateReversibleSetFromDan(d10, scored2D, 4);
      const d2 = generateReversibleSetFromDan(d4, scored2D, 2);`;
content = content.replace(oldCurrentRegex, newCurrent);

// Replace getPredictionsForData block
const oldHistoryRegex = /const pStats2D = analyzeUnified2D\(dataToAnalyze\);\s*const pScored2D = calculateCauScore\(pStats2D\);\s*const pScoredTongs = analyzeTong\(dataToAnalyze\);\s*const pD10 = generateDanByTong\(pScoredTongs\.slice\(0, 1\)\);\s*const pD20 = generateDanByTong\(pScoredTongs\.slice\(0, 2\)\);\s*const pD2 = generateReversibleSetFromDan\(pD10, pScored2D, 2\);\s*const pD4 = generateReversibleSetFromDan\(pD10, pScored2D, 4\);/m;

const newHistory = `const pScoredTongs = analyzeTong(dataToAnalyze);
        const pScoredSingles = analyzeSingleDigits(dataToAnalyze);
        const pStats2D = analyzeUnified2D(dataToAnalyze);
        const pScored2D = calculateCauScore(pStats2D, pScoredTongs, pScoredSingles);
        
        const pD20 = generateReversibleSet(pScored2D, 20);
        const pD10 = generateReversibleSetFromDan(pD20, pScored2D, 10);
        const pD4 = generateReversibleSetFromDan(pD10, pScored2D, 4);
        const pD2 = generateReversibleSetFromDan(pD4, pScored2D, 2);`;
content = content.replace(oldHistoryRegex, newHistory);

// Remove the `const scoredSingles = analyzeSingleDigits(rawData);` that was standing independently after Current Predictions
const straySinglesRegex = /const scoredSingles = analyzeSingleDigits\(rawData\);/;
content = content.replace(straySinglesRegex, '');

fs.writeFileSync('src/App.jsx', content, 'utf8');
