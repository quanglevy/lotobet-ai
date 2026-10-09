const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  /const top5Digits = scoredSingles\.slice\(0, 5\)\.map\(s => s\.number\.toString\(\)\);\s*const filteredScored2D = scored2D\.filter\(item => top5Digits\.includes\(item\.number\[0\]\) && top5Digits\.includes\(item\.number\[1\]\)\);/,
  `const top3Digits = scoredSingles.slice(0, 3).map(s => s.number.toString());
      const filteredScored2D = scored2D.filter(item => top3Digits.includes(item.number[0]) || top3Digits.includes(item.number[1]));`
);

c = c.replace(
  /const pTop5Digits = pScoredSingles\.slice\(0, 5\)\.map\(s => s\.number\.toString\(\)\);\s*const pFilteredScored2D = pScored2D\.filter\(item => pTop5Digits\.includes\(item\.number\[0\]\) && pTop5Digits\.includes\(item\.number\[1\]\)\);/,
  `const pTop3Digits = pScoredSingles.slice(0, 3).map(s => s.number.toString());
          const pFilteredScored2D = pScored2D.filter(item => pTop3Digits.includes(item.number[0]) || pTop3Digits.includes(item.number[1]));`
);

fs.writeFileSync('src/App.jsx', c, 'utf8');
