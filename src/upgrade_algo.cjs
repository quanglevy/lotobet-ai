const fs = require('fs');

let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

// The simplest way to overwrite the file without breaking is to just append the new functions at the end and rename the old ones, or completely recreate the file. 
// Since statistics.js has a lot of utility functions like checkTXCL, predictTXCL, generateReversibleSet, etc., we can just replace the specific functions.

// Replacing analyzeSingleDigits
code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, `export const analyzeSingleDigits = (data) => {
  if (data.length === 0) return [];
  const ascData = [...data].reverse();
  const stats = {};
  for (let i = 0; i < 10; i++) {
    stats[i.toString()] = { number: i.toString(), score: 0, reason: [], countAll: 0 };
  }

  if (ascData.length === 0) return Object.values(stats);

  const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
  const bongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);
  
  const lastDraw = ascData[ascData.length - 1].Result;
  
  const addScore = (numStr, pts, rsn) => {
      if (stats[numStr]) {
          stats[numStr].score += pts;
          if (!stats[numStr].reason.includes(rsn)) stats[numStr].reason.push(rsn);
      }
  };

  // 1. Cầu Tam Giác Ma Trận (Vàng)
  const tg1 = (parseInt(lastDraw[0]) + parseInt(lastDraw[2]) + parseInt(lastDraw[4])) % 10;
  const tg2 = (parseInt(lastDraw[1]) + parseInt(lastDraw[3])) % 10;
  addScore(tg1.toString(), 50, "Tam Giác Vàng");
  addScore(tg2.toString(), 50, "Tam Giác Vàng");
  addScore(bongDuong(tg1.toString()), 30, "Bóng Tam Giác");
  addScore(bongDuong(tg2.toString()), 30, "Bóng Tam Giác");

  // 2. Cầu Pascal
  const getPascal = (str) => {
      let current = str;
      while (current.length > 2) {
          let next = "";
          for (let i = 0; i < current.length - 1; i++) {
              next += ((parseInt(current[i]) + parseInt(current[i+1])) % 10).toString();
          }
          current = next;
      }
      return current;
  };
  const pascal = getPascal(lastDraw);
  addScore(pascal[0], 40, "Cầu Pascal");
  if (pascal[1] !== pascal[0]) addScore(pascal[1], 40, "Cầu Pascal");

  // 3. Cầu Tổng Ngũ Hành
  const sumAll = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
  const sumStr = sumAll.toString();
  addScore(sumStr[sumStr.length - 1], 35, "Tổng Ngũ Hành");

  // 4. Lô Rơi (Nhịp Hậu Nhị)
  const hauNhi = lastDraw.slice(-2);
  addScore(hauNhi[0], 20, "Nhịp Rơi");
  addScore(hauNhi[1], 20, "Nhịp Rơi");
  addScore(bongDuong(hauNhi[0]), 15, "Bóng Rơi");

  // Trừ điểm
  const uniqueLast = [...new Set(lastDraw.split(''))];
  uniqueLast.forEach(d => {
      stats[d].score -= 10; 
  });

  return Object.values(stats).map(s => ({
      ...s,
      reason: s.reason.slice(0, 2).join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`);

// Replacing analyzeTong
code = code.replace(/export const analyzeTong = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.sort\(\(a, b\) => \{[\s\S]*?\}\);\n\};/, `export const analyzeTong = (data) => {
  if (data.length === 0) return [];
  const ascData = [...data].reverse();
  const stats = {};
  
  for(let i = 0; i < 10; i++) {
    stats[i] = { tong: i, score: 0, reason: [] };
  }

  if (ascData.length === 0) return Object.values(stats);
  const lastDraw = ascData[ascData.length - 1].Result;

  const addScore = (t, pts, rsn) => {
      const ts = (t % 10).toString();
      if (stats[ts]) {
          stats[ts].score += pts;
          if (!stats[ts].reason.includes(rsn)) stats[ts].reason.push(rsn);
      }
  };

  const tg1 = (parseInt(lastDraw[0]) + parseInt(lastDraw[2]) + parseInt(lastDraw[4])) % 10;
  const tg2 = (parseInt(lastDraw[1]) + parseInt(lastDraw[3])) % 10;
  addScore((tg1 + tg2) % 10, 50, "Tổng Tam Giác");

  const tDD = (parseInt(lastDraw[0]) + parseInt(lastDraw[4])) % 10;
  addScore(tDD, 40, "Tổng Đầu Đuôi");

  const hauNhi = lastDraw.slice(-2);
  const tHau = (parseInt(hauNhi[0]) + parseInt(hauNhi[1])) % 10;
  addScore(tHau, 30, "Bệt Tổng Hậu");

  const bongDuong = d => ({'0':5,'5':0,'1':6,'6':1,'2':7,'7':2,'3':8,'8':3,'4':9,'9':4}[d]);
  addScore(bongDuong(tDD.toString()), 20, "Bóng Tổng ĐĐ");
  
  return Object.values(stats).sort((a, b) => b.score - a.score);
};`);


// Replace calculateCauScore
code = code.replace(/export const calculateCauScore = \(statsArray, scoredTongs = \[\], scoredSingles = \[\]\) => \{[\s\S]*?return statsArray\.map\(stat => \{[\s\S]*?\}\);\n\};/, `export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = []) => {
    const topTong1 = scoredTongs.length > 0 ? scoredTongs[0].tong.toString() : null;
    const topTong2 = scoredTongs.length > 1 ? scoredTongs[1].tong.toString() : null;
    const topTong3 = scoredTongs.length > 2 ? scoredTongs[2].tong.toString() : null;
    
    const topCham1 = scoredSingles.length > 0 ? scoredSingles[0].number : null;
    const topCham2 = scoredSingles.length > 1 ? scoredSingles[1].number : null;
    const topCham3 = scoredSingles.length > 2 ? scoredSingles[2].number : null;
  
    return statsArray.map(stat => {
      let score = 0;
      let reasons = [];
  
      // ENSEMBLE: Chạm Boost (Heavily prioritize top Chạm to concentrate picks)
      if (topCham1 && stat.number.includes(topCham1)) { score += 60; reasons.push("Chạm cứng (Top 1)"); }
      if (topCham2 && stat.number.includes(topCham2)) { score += 40; reasons.push("Chạm cứng (Top 2)"); }
      if (topCham3 && stat.number.includes(topCham3)) { score += 20; reasons.push("Chạm lót (Top 3)"); }
  
      // Cầu Báo Kép (Double Boost)
      if (stat.number[0] === stat.number[1]) {
         score += 15; reasons.push("Hệ Kép");
      }
      if (Math.abs(parseInt(stat.number[0]) - parseInt(stat.number[1])) === 1) {
         score += 10; reasons.push("Hệ Sát Kép");
      }

      // ENSEMBLE: Tổng Boost
      const tong = ((parseInt(stat.number[0]) + parseInt(stat.number[1])) % 10).toString();
      if (tong === topTong1) { score += 50; reasons.push("Tổng đẹp (Top 1)"); }
      if (tong === topTong2) { score += 30; reasons.push("Tổng đẹp (Top 2)"); }
      if (tong === topTong3) { score += 15; reasons.push("Tổng lót (Top 3)"); }
  
      if (stat.isBongDuong) { score += 15; reasons.push("Bóng Dương"); }
      if (stat.isBongAm) { score += 10; reasons.push("Bóng Âm"); }
      if (stat.isCauLat) { score += 15; reasons.push("Cầu Lộn"); }
  
      return {
        ...stat,
        cauScore: score,
        reasons: reasons
      };
    }).sort((a, b) => b.cauScore - a.cauScore);
  };`);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded Algorithm!");
