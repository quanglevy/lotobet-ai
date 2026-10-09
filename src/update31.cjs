const fs = require('fs');
let c = fs.readFileSync('src/utils/statistics.js', 'utf8');

// --- Replace analyzeSingleDigits ---
const newAnalyzeSingle = `export const analyzeSingleDigits = (data) => {
  if (data.length === 0) return [];
  const ascData = [...data].reverse();
  const stats = {};
  for (let i = 0; i < 10; i++) {
    stats[i.toString()] = { number: i.toString(), score: 0, reason: [], countAll: 0 };
  }

  if (ascData.length < 2) return Object.values(stats);

  const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
  const bongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);

  const rules = [
    { id: "Cầu Tổng 5 Số", fn: (h, i) => (h[i-1].Result.split('').reduce((a,b)=>a+parseInt(b),0)%10).toString(), type: 'tong' },
    { id: "Bóng Tổng 5 Số", fn: (h, i) => bongDuong((h[i-1].Result.split('').reduce((a,b)=>a+parseInt(b),0)%10).toString()), type: 'tong' },
    { id: "Tổng Tiền Nhị", fn: (h, i) => ((parseInt(h[i-1].Result[0])+parseInt(h[i-1].Result[1]))%10).toString(), type: 'tien' },
    { id: "Bóng Tiền Nhị", fn: (h, i) => bongDuong(((parseInt(h[i-1].Result[0])+parseInt(h[i-1].Result[1]))%10).toString()), type: 'tien' },
    { id: "Tổng Hậu Nhị", fn: (h, i) => ((parseInt(h[i-1].Result[3])+parseInt(h[i-1].Result[4]))%10).toString(), type: 'hau' },
    { id: "Bóng Hậu Nhị", fn: (h, i) => bongDuong(((parseInt(h[i-1].Result[3])+parseInt(h[i-1].Result[4]))%10).toString()), type: 'hau' },
    { id: "Tổng Đầu Đuôi", fn: (h, i) => ((parseInt(h[i-1].Result[0])+parseInt(h[i-1].Result[4]))%10).toString(), type: 'dauduoi' },
    { id: "Bóng Đầu Đuôi", fn: (h, i) => bongDuong(((parseInt(h[i-1].Result[0])+parseInt(h[i-1].Result[4]))%10).toString()), type: 'dauduoi' },
    { id: "Bóng Dương Tâm", fn: (h, i) => bongDuong(h[i-1].Result[2]), type: 'tam' },
    { id: "Bóng Âm Tâm", fn: (h, i) => bongAm(h[i-1].Result[2]), type: 'tam' },
    { id: "Rơi Đầu", fn: (h, i) => h[i-1].Result[0], type: 'roi' },
    { id: "Rơi Đuôi", fn: (h, i) => h[i-1].Result[4], type: 'roi' }
  ];

  rules.forEach(rule => {
     rule.hits = 0; rule.streak = 0;
     for (let i = 2; i < ascData.length; i++) {
        const pred = rule.fn(ascData, i);
        if (pred && ascData[i].Result.includes(pred)) { rule.hits++; rule.streak++; } 
        else { rule.streak = 0; }
     }
  });

  rules.sort((a, b) => b.hits - a.hits || b.streak - a.streak);

  const currIdx = ascData.length;
  let rank = 1;
  let roiCount = 0;

  for (let rule of rules) {
     if (rule.type === 'roi' && roiCount >= 1) continue; 
     const nextPred = rule.fn(ascData, currIdx);
     if (nextPred && stats[nextPred]) {
        if (rule.type === 'roi') roiCount++;
        const ruleScore = (rule.hits * 30) + (rule.streak * 10) + Math.max(0, 50 - rank*5);
        if (ruleScore > 0) {
            stats[nextPred].score += ruleScore;
            if (stats[nextPred].reason.length < 2 && rule.hits > 0) {
               stats[nextPred].reason.push(\`\${rule.id} (Ăn \${rule.hits})\`);
            }
        }
     }
     rank++;
  }
  
  return Object.values(stats).map(s => ({
     ...s, reason: s.reason.join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`;

const parts1 = c.split('export const analyzeSingleDigits = (data) => {');
const tail1 = parts1[1].split(/export const (?:checkTXCL|calculateCauScore)/);
c = parts1[0] + newAnalyzeSingle + "\n\nexport const " + (c.includes("export const checkTXCL") ? "checkTXCL" : "calculateCauScore") + tail1[1];


// --- Replace predictTXCL ---
const newPredictTXCL = `export const predictTXCL = (data) => {
  if (data.length < 2) return { tx: 'TÀI', cl: 'CHẴN' };
  const ascData = [...data].reverse();
  
  const check = (str) => {
     const sum = str.split('').reduce((a, b) => a + parseInt(b), 0);
     return { tx: sum >= 23 ? 'TÀI' : 'XỈU', cl: sum % 2 === 0 ? 'CHẴN' : 'LẺ' };
  };

  const txHistory = ascData.map(d => check(d.Result).tx);
  const clHistory = ascData.map(d => check(d.Result).cl);

  const txRules = [
    { id: 'Bám Bệt', fn: (hist, i) => hist[i-1] },
    { id: 'Đảo Cầu', fn: (hist, i) => hist[i-1] === 'TÀI' ? 'XỈU' : 'TÀI' },
    { id: 'Thuận Nghịch (Đầu Đuôi)', fn: (hist, i, raw) => {
        const sum = parseInt(raw[i-1].Result[0]) + parseInt(raw[i-1].Result[4]);
        return sum % 2 === 0 ? hist[i-1] : (hist[i-1] === 'TÀI' ? 'XỈU' : 'TÀI');
    }},
    { id: 'Thuận Nghịch (Tâm)', fn: (hist, i, raw) => {
        const mid = parseInt(raw[i-1].Result[2]);
        return mid % 2 === 0 ? hist[i-1] : (hist[i-1] === 'TÀI' ? 'XỈU' : 'TÀI');
    }}
  ];

  const clRules = [
    { id: 'Bám Bệt', fn: (hist, i) => hist[i-1] },
    { id: 'Đảo Cầu', fn: (hist, i) => hist[i-1] === 'CHẴN' ? 'LẺ' : 'CHẴN' },
    { id: 'Thuận Nghịch (Đầu Đuôi)', fn: (hist, i, raw) => {
        const sum = parseInt(raw[i-1].Result[0]) + parseInt(raw[i-1].Result[4]);
        return sum % 2 === 0 ? hist[i-1] : (hist[i-1] === 'CHẴN' ? 'LẺ' : 'CHẴN');
    }},
    { id: 'Thuận Nghịch (Tâm)', fn: (hist, i, raw) => {
        const mid = parseInt(raw[i-1].Result[2]);
        return mid % 2 === 0 ? hist[i-1] : (hist[i-1] === 'CHẴN' ? 'LẺ' : 'CHẴN');
    }}
  ];

  const evalRules = (rules, history, raw) => {
     rules.forEach(r => {
        r.hits = 0;
        for (let i = 2; i < history.length; i++) {
           if (r.fn(history, i, raw) === history[i]) r.hits++;
        }
     });
     return [...rules].sort((a, b) => b.hits - a.hits)[0];
  };

  return { 
     tx: evalRules(txRules, txHistory, ascData).fn(txHistory, ascData.length, ascData), 
     cl: evalRules(clRules, clHistory, ascData).fn(clHistory, ascData.length, ascData)
  };
};`;

const oldTxclRegex = /export const predictTXCL = \(data\) => \{[\s\S]*?return \{ tx: predTx, cl: predCl \};\s*\};/;
c = c.replace(oldTxclRegex, newPredictTXCL);

fs.writeFileSync('src/utils/statistics.js', c, 'utf8');
