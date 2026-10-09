const fs = require('fs');

let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const newAnalyzeSingleDigits = `export const analyzeSingleDigits = (data) => {
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

  // --- HỆ THỐNG ENSEMBLE AI (5 CHUYÊN GIA BẦU CHỌN ĐỘC LẬP) ---
  
  // 1. CHUYÊN GIA LÔ RƠI & BÓNG ÂM DƯƠNG
  const counts = {};
  for (let char of lastDraw) counts[char] = (counts[char] || 0) + 1;
  Object.keys(counts).forEach(d => {
      addScore(d, 100 * counts[d], "Lô Rơi");
      addScore(bongAm(d), 70, "Bóng Âm");
      if (counts[d] >= 2) {
          addScore(bongDuong(d), 110, "Bóng Kép");
      }
  });

  // 2. CHUYÊN GIA TỔNG HẠT NHÂN
  const sumAll = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
  const sumDigit = (sumAll % 10).toString();
  addScore(sumDigit, 120, "Tổng Trục");
  addScore(bongDuong(sumDigit), 90, "Bóng Tổng");
  addScore(bongAm(sumDigit), 70, "Bóng Âm Tổng");

  // 3. CHUYÊN GIA PASCAL
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
  addScore(pascal[0], 110, "Pascal");
  addScore(pascal[1], 110, "Pascal");
  addScore(bongDuong(pascal[0]), 60, "Bóng Pascal");
  addScore(bongDuong(pascal[1]), 60, "Bóng Pascal");

  // 4. CHUYÊN GIA TAM GIÁC VÀNG
  const tg1 = (parseInt(lastDraw[0]) + parseInt(lastDraw[2]) + parseInt(lastDraw[4])) % 10;
  const tg2 = (parseInt(lastDraw[1]) + parseInt(lastDraw[3])) % 10;
  addScore(tg1.toString(), 100, "Tam Giác 1");
  addScore(tg2.toString(), 100, "Tam Giác 2");
  addScore(bongDuong(tg1.toString()), 50, "Bóng TG");
  addScore(bongDuong(tg2.toString()), 50, "Bóng TG");

  // 5. CHUYÊN GIA TIỀN NHỊ / HẬU NHỊ (Đặc trị Lô Rơi Đuôi)
  addScore(lastDraw[3], 90, "Hậu Nhị");
  addScore(lastDraw[4], 90, "Hậu Nhị");
  addScore(bongDuong(lastDraw[0]), 70, "Bóng Đầu");
  addScore(bongDuong(lastDraw[4]), 70, "Bóng Đuôi");

  return Object.values(stats).map(s => ({
      ...s,
      reason: s.reason.slice(0, 2).join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`;

code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, newAnalyzeSingleDigits);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded analyzeSingleDigits to 5-Expert Ensemble!");
