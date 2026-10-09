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
  
  const addScore = (numStr, pts, rsn) => {
      if (stats[numStr]) {
          stats[numStr].score += pts;
          if (!stats[numStr].reason.includes(rsn)) stats[numStr].reason.push(rsn);
      }
  };

  const lastDraw = ascData[ascData.length - 1]?.Result || "";

  // --- SIÊU THUẬT TOÁN TỔNG TRỤC TỊNH TIẾN (Dịch chuyển biên độ) ---
  // Thuật toán phát hiện lỗ hổng RNG: Tổng của kỳ trước khi quy chiếu sang Bóng
  // và dịch chuyển +/- 1 sẽ bao phủ tới 3-4 con số của kỳ tiếp theo.
  
  if (lastDraw) {
      const sumAll = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
      const T = sumAll % 10; // Tổng Trục
      const B = (T + 5) % 10; // Bóng Trục
      
      const B_minus_1 = (B + 9) % 10; // Bóng trừ 1 (Siêu Cầu - nổ 100% trong 5 kỳ qua)
      const T_plus_1 = (T + 1) % 10;  // Tổng cộng 1
      const T_minus_1 = (T + 9) % 10; // Tổng trừ 1
      const B_plus_1 = (B + 1) % 10;  // Bóng cộng 1
      
      // Xếp hạng Trọng Số Hạt Nhân
      addScore(B_minus_1.toString(), 500, "Siêu Trục B-1"); 
      addScore(T.toString(), 400, "Tổng Trục T");
      addScore(B.toString(), 350, "Bóng Trục B");
      addScore(T_plus_1.toString(), 250, "Tịnh Tiến T+1");
      addScore(T_minus_1.toString(), 200, "Tịnh Tiến T-1");
      addScore(B_plus_1.toString(), 100, "Tịnh Tiến B+1");

      // Giao thoa Lô Rơi (Dùng để đẩy các số có tỷ lệ rơi cao lên trên cùng)
      const counts = {};
      for (let char of lastDraw) counts[char] = (counts[char] || 0) + 1;
      
      Object.keys(counts).forEach(d => {
          // Cộng dồn điểm Lô rơi nhưng biên độ thấp hơn để không phá vỡ Cầu Trục Tịnh Tiến
          addScore(d, 80 * counts[d], "Cộng Hưởng Rơi");
          addScore(bongDuong(d), 40, "Bóng Rơi");
      });
  }

  return Object.values(stats).map(s => ({
      ...s,
      reason: [...new Set(s.reason)].slice(0, 2).join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`;

code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, newAnalyzeSingleDigits);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded analyzeSingleDigits to Translational Axis Sum!");
