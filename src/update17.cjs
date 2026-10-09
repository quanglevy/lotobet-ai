const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add import
content = content.replace(
  /import \{ analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, \r?\ngenerateDanByTong \} from '\.\/utils\/statistics';/m,
  'import { analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, generateDanByTong, generateReversibleSetFromDan } from "./utils/statistics";'
);
// Fallback if formatting was slightly different:
content = content.replace(
  /generateDanByTong \} from '\.\/utils\/statistics';/m,
  'generateDanByTong, generateReversibleSetFromDan } from "./utils/statistics";'
);

// 2. Update Current Predictions logic
const oldCurrentRegex = /const stats2D = analyzeUnified2D\(rawData\);\s*const scored2D = calculateCauScore\(stats2D\);\s*const d2 = generateReversibleSet\(scored2D, 2\);\s*const d4 = generateReversibleSet\(scored2D, 4\);\s*const scoredTongs = analyzeTong\(rawData\);\s*const d10 = generateDanByTong\(scoredTongs\.slice\(0, 1\)\);\s*const d20 = generateDanByTong\(scoredTongs\.slice\(0, 2\)\);/m;

const newCurrent = `const stats2D = analyzeUnified2D(rawData);
      const scored2D = calculateCauScore(stats2D);
      
      const scoredTongs = analyzeTong(rawData);
      const d10 = generateDanByTong(scoredTongs.slice(0, 1)); 
      const d20 = generateDanByTong(scoredTongs.slice(0, 2)); 

      const d2 = generateReversibleSetFromDan(d10, scored2D, 2);
      const d4 = generateReversibleSetFromDan(d10, scored2D, 4);`;

content = content.replace(oldCurrentRegex, newCurrent);

// 3. Update getPredictionsForData logic
const oldHistoryRegex = /const pStats2D = analyzeUnified2D\(dataToAnalyze\);\s*const pScored2D = calculateCauScore\(pStats2D\);\s*const pD2 = generateReversibleSet\(pScored2D, 2\);\s*const pD4 = generateReversibleSet\(pScored2D, 4\);\s*const pScoredTongs = analyzeTong\(dataToAnalyze\);\s*const pD10 = generateDanByTong\(pScoredTongs\.slice\(0, 1\)\);\s*const pD20 = generateDanByTong\(pScoredTongs\.slice\(0, 2\)\);/m;

const newHistory = `const pStats2D = analyzeUnified2D(dataToAnalyze);
        const pScored2D = calculateCauScore(pStats2D);
        const pScoredTongs = analyzeTong(dataToAnalyze);
        const pD10 = generateDanByTong(pScoredTongs.slice(0, 1));
        const pD20 = generateDanByTong(pScoredTongs.slice(0, 2));

        const pD2 = generateReversibleSetFromDan(pD10, pScored2D, 2);
        const pD4 = generateReversibleSetFromDan(pD10, pScored2D, 4);`;

content = content.replace(oldHistoryRegex, newHistory);

fs.writeFileSync('src/App.jsx', content, 'utf8');
