const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  'const d20 = generateReversibleSet(scored2D, 20);',
  `const top5Digits = scoredSingles.slice(0, 5).map(s => s.number.toString());
      const filteredScored2D = scored2D.filter(item => top5Digits.includes(item.number[0]) && top5Digits.includes(item.number[1]));
      const pool20 = filteredScored2D.length >= 20 ? filteredScored2D : scored2D;
      const d20 = generateReversibleSet(pool20, 20);`
);

c = c.replace(
  'const pD20 = generateReversibleSet(pScored2D, 20);',
  `const pTop5Digits = pScoredSingles.slice(0, 5).map(s => s.number.toString());
          const pFilteredScored2D = pScored2D.filter(item => pTop5Digits.includes(item.number[0]) && pTop5Digits.includes(item.number[1]));
          const pPool20 = pFilteredScored2D.length >= 20 ? pFilteredScored2D : pScored2D;
          const pD20 = generateReversibleSet(pPool20, 20);`
);

fs.writeFileSync('src/App.jsx', c, 'utf8');
