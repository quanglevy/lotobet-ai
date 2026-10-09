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

  // --- SIÊU THUẬT TOÁN BÓNG MA TRẬN 5 TINH ---
  
  // 1. CHẠM TỔNG HẠT NHÂN (Sức mạnh 250)
  const sumAll = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
  const sumDigit = (sumAll % 10).toString();
  addScore(sumDigit, 250, "Tổng Hạt Nhân");

  // 2. PHÂN TÍCH TẦN SUẤT & BÓNG KÉP
  const digitCounts = {};
  for (let char of lastDraw) digitCounts[char] = (digitCounts[char] || 0) + 1;
  
  Object.keys(digitCounts).forEach(d => {
      const count = digitCounts[d];
      if (count >= 2) {
          // Bất kỳ số nào xuất hiện từ 2 lần trở lên -> Bóng Dương của nó là SIÊU CẦU (+300)
          addScore(bongDuong(d), 300, "Bóng Siêu Kép");
          addScore(bongAm(d), 150, "Bóng Âm Kép");
      }
      // Lô rơi cơ bản (+100)
      addScore(d, 100, "Lô Rơi");
      // Bóng âm toàn tập (+80)
      addScore(bongAm(d), 80, "Bóng Âm Mảng");
      // Bóng dương toàn tập (+60)
      addScore(bongDuong(d), 60, "Bóng Dương Mảng");
  });

  // 3. CẦU ĐẦU - ĐUÔI (Sức mạnh 200)
  const head = lastDraw[0];
  const tail = lastDraw[4];
  addScore(bongDuong(head), 200, "Bóng Dương Đầu");
  addScore(bongDuong(tail), 200, "Bóng Dương Đuôi");

  // 4. BẠC NHỚ TIỀN NHỊ / HẬU NHỊ (Phụ trợ)
  const hNhi = lastDraw.substring(3, 5);
  addScore(bongDuong(hNhi[0]), 50, "Bóng Hậu");
  addScore(bongDuong(hNhi[1]), 50, "Bóng Hậu");

  return Object.values(stats).map(s => ({
      ...s,
      reason: s.reason.slice(0, 2).join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`;

code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, newAnalyzeSingleDigits);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded analyzeSingleDigits to Hyper Matrix!");
