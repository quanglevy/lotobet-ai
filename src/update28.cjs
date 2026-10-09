const fs = require('fs');
let c = fs.readFileSync('src/utils/statistics.js', 'utf8');

const newFunc = `export const analyzeSingleDigits = (data) => {
  if (data.length === 0) return [];
  const ascData = [...data].reverse();
  const stats = {};
  for (let i = 0; i < 10; i++) {
    stats[i.toString()] = { number: i.toString(), score: 0, reason: [], countAll: 0 };
  }

  ascData.forEach(draw => {
     [...new Set(draw.Result.split(''))].forEach(d => {
        stats[d].countAll++;
     });
  });

  if (ascData.length < 2) {
     return Object.values(stats);
  }

  const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
  const bongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);

  const rules = [];

  for (let lag = 1; lag <= 2; lag++) {
    for (let pos = 0; pos < 5; pos++) {
       rules.push({
         id: \`Rơi VT \${pos+1} (Kỳ -\${lag})\`,
         fn: (history, currIdx) => history[currIdx - lag] ? history[currIdx - lag].Result[pos] : null
       });
       if (lag === 1) {
           rules.push({
             id: \`Bóng Dương VT \${pos+1}\`,
             fn: (history, currIdx) => history[currIdx - 1] ? bongDuong(history[currIdx - 1].Result[pos]) : null
           });
           rules.push({
             id: \`Bóng Âm VT \${pos+1}\`,
             fn: (history, currIdx) => history[currIdx - 1] ? bongAm(history[currIdx - 1].Result[pos]) : null
           });
       }
    }
  }

  for (let p1 = 0; p1 < 4; p1++) {
    for (let p2 = p1 + 1; p2 < 5; p2++) {
       rules.push({
         id: \`Tổng VT \${p1+1}+\${p2+1}\`,
         fn: (history, currIdx) => history[currIdx - 1] ? ((parseInt(history[currIdx - 1].Result[p1]) + parseInt(history[currIdx - 1].Result[p2])) % 10).toString() : null
       });
    }
  }

  rules.push({
     id: \`Tổng 5 Số\`,
     fn: (history, currIdx) => history[currIdx - 1] ? (history[currIdx - 1].Result.split('').reduce((a, b) => a + parseInt(b), 0) % 10).toString() : null
  });

  rules.forEach(rule => {
     rule.hits = 0;
     rule.streak = 0;
     for (let i = 2; i < ascData.length; i++) {
        const prediction = rule.fn(ascData, i);
        if (!prediction) continue;
        const actualResult = ascData[i].Result;
        if (actualResult.includes(prediction)) {
           rule.hits++;
           rule.streak++;
        } else {
           rule.streak = 0;
        }
     }
  });

  rules.sort((a, b) => {
     if (b.streak !== a.streak) return b.streak - a.streak;
     return b.hits - a.hits;
  });

  const currIdx = ascData.length;
  let rank = 1;
  for (let rule of rules) {
     const nextPred = rule.fn(ascData, currIdx);
     if (nextPred && stats[nextPred]) {
        const ruleScore = (rule.streak * 40) + (rule.hits * 15) + Math.max(0, 60 - rank*3);
        if (ruleScore > 0) {
            stats[nextPred].score += ruleScore;
            if (stats[nextPred].reason.length < 2 && (rule.streak > 0 || rule.hits > 0)) {
               stats[nextPred].reason.push(\`\${rule.id} (Ăn \${rule.hits}, Thông \${rule.streak})\`);
            }
        }
     }
     rank++;
  }

  for (let i = 0; i < 10; i++) {
     stats[i.toString()].score += stats[i.toString()].countAll;
  }

  return Object.values(stats).map(s => ({
     ...s,
     reason: s.reason.join(', ') || 'Cơ bản'
  })).sort((a, b) => b.score - a.score);
};`;

const parts = c.split('export const analyzeSingleDigits = (data) => {');
if (parts.length > 1) {
    const tail = parts[1].split(/export const (?:checkTXCL|calculateCauScore)/);
    if (tail.length > 1) {
        const before = parts[0];
        const after = "export const " + (c.includes("export const checkTXCL") ? "checkTXCL" : "calculateCauScore") + tail[1];
        fs.writeFileSync('src/utils/statistics.js', before + newFunc + "\n\n" + after, 'utf8');
        console.log("Success");
    }
}
