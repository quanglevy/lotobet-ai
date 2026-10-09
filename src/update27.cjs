const fs = require('fs');
let c = fs.readFileSync('src/utils/statistics.js', 'utf8');

const targetFuncRegex = /export const analyzeSingleDigits = \(data\) => \{[\s\S]*?\}\)\.sort\(\(a, b\) => b\.score - a\.score\);\s*\};\s*(?=\s*export const (checkTXCL|calculateCauScore))/;

const newFunc = `export const analyzeSingleDigits = (data) => {
  if (data.length === 0) return [];
  const ascData = [...data].reverse();
  const totalDraws = ascData.length;
  const stats = {};
  const markovSingle = {};
  
  for (let i = 0; i < 10; i++) {
    stats[i.toString()] = {
      number: i.toString(), countAll: 0, recentCount5: 0, recentCount15: 0, 
      lastSeenIdx: -1, isBongDuong: false, isBongAm: false, markovScore: 0, gapHistory: []
    };
    markovSingle[i.toString()] = {};
  }

  let prevDigits = [];
  ascData.forEach((draw, idx) => {
    const digits = [...new Set(draw.Result.split(''))];
    
    digits.forEach(d => {
      stats[d].countAll++;
      if (stats[d].lastSeenIdx !== -1) {
        stats[d].gapHistory.push(idx - stats[d].lastSeenIdx - 1);
      }
      stats[d].lastSeenIdx = idx;
      if (idx >= totalDraws - 5) stats[d].recentCount5++;
      if (idx >= totalDraws - 15) stats[d].recentCount15++;
      
      prevDigits.forEach(p => {
        markovSingle[p][d] = (markovSingle[p][d] || 0) + 1;
      });
    });
    prevDigits = digits;
  });

  const lastDraw = data[0];
  if (lastDraw && lastDraw.Result.length === 5) {
    const lastDigits = [...new Set(lastDraw.Result.split(''))];
    const bongDuongMap = { '0':'5', '5':'0', '1':'6', '6':'1', '2':'7', '7':'2', '3':'8', '8':'3', '4':'9', '9':'4' };
    const bongAmMap = { '0':'7', '7':'0', '1':'4', '4':'1', '2':'9', '9':'2', '3':'6', '6':'3', '5':'8', '8':'5' };
    
    lastDigits.forEach(d => {
      const bd = bongDuongMap[d];
      if (bd && stats[bd]) stats[bd].isBongDuong = true;
      const ba = bongAmMap[d];
      if (ba && stats[ba]) stats[ba].isBongAm = true;
      
      for (let target = 0; target < 10; target++) {
         const tStr = target.toString();
         if (markovSingle[d][tStr]) {
            stats[tStr].markovScore += markovSingle[d][tStr];
         }
      }
    });
  }

  let maxMarkov = Math.max(...Object.values(stats).map(s => s.markovScore), 1);

  return Object.values(stats).map(stat => {
    let score = 0;
    let reasons = [];
    const currentGap = stat.lastSeenIdx !== -1 ? (totalDraws - 1 - stat.lastSeenIdx) : 999;
    
    if (stat.isBongDuong) { score += 20; reasons.push("Bóng Dương Kép"); }
    if (stat.isBongAm) { score += 15; reasons.push("Bóng Âm Tương Sinh"); }
    
    const mScore = Math.round((stat.markovScore / maxMarkov) * 35);
    if (mScore > 10) { score += mScore; reasons.push(\`Bạc Nhớ Cầu (\${mScore}đ)\`); }
    
    if (currentGap === 0) { score += 15; reasons.push("Rơi Lại (Bệt)"); }
    else if (currentGap === 1) { score += 25; reasons.push("Nhịp 1-1 Khung Đẹp"); }
    else if (currentGap === 2) { score += 20; reasons.push("Nhịp Nghỉ 2"); }
    
    if (stat.gapHistory.length > 0) {
      const recentGaps = stat.gapHistory.slice(-5);
      if (recentGaps.includes(currentGap) && currentGap > 0) {
         score += 25; reasons.push(\`Trùng Nhịp Quen (\${currentGap})\`);
      }
    }
    
    if (stat.recentCount5 >= 3) { score += 25; reasons.push("Đang Rất Nóng"); }
    else if (stat.recentCount15 >= 7) { score += 15; reasons.push("Tần Suất Cao"); }
    
    if (currentGap >= 4 && currentGap <= 6) { score -= 20; reasons.push("Đang Ngậm Gan"); } 
    else if (currentGap > 6) { score -= 40; reasons.push("Lô Gan Sâu (Tránh)"); }

    return { ...stat, score, currentGap, reason: reasons.join(', ') || 'Cơ bản' };
  }).sort((a, b) => b.score - a.score);
};`;

if (targetFuncRegex.test(c)) {
   c = c.replace(targetFuncRegex, newFunc);
   fs.writeFileSync('src/utils/statistics.js', c, 'utf8');
   console.log("Success");
} else {
   console.log("Regex didn't match. Will write manual replacer.");
   // fallback manual split
   const parts = c.split('export const analyzeSingleDigits = (data) => {');
   if (parts.length > 1) {
       const tail = parts[1].split(/export const (?:checkTXCL|calculateCauScore)/);
       if (tail.length > 1) {
           const before = parts[0];
           const after = "export const " + (c.includes("export const checkTXCL") ? "checkTXCL" : "calculateCauScore") + tail[1];
           fs.writeFileSync('src/utils/statistics.js', before + newFunc + "\n\n" + after, 'utf8');
           console.log("Success via fallback");
       }
   }
}
