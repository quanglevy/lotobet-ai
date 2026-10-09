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
  
  const addScore = (numStr, pts, rsn) => {
      if (stats[numStr]) {
          stats[numStr].score += pts;
          if (!stats[numStr].reason.includes(rsn)) stats[numStr].reason.push(rsn);
      }
  };

  const lastDraw = ascData[ascData.length - 1]?.Result || "";
  const drawN2 = ascData.length >= 2 ? ascData[ascData.length - 2].Result : "";
  const drawN3 = ascData.length >= 3 ? ascData[ascData.length - 3].Result : "";

  // --- SIÊU MA TRẬN BẮT NHỊP CẦU RƠI CHẬM (DELAYED MARKOV CHAIN) ---
  // Dựa trên phân tích thực tế: Kết quả đang bị delay (trễ nhịp) từ 1 đến 2 kỳ.
  // Nghĩa là kỳ N thường được lấy giống với kỳ N-2 hoặc N-3 chứ không phải N-1.

  const countDigits = (draw) => {
      const counts = {};
      if(draw) for (let char of draw) counts[char] = (counts[char] || 0) + 1;
      return counts;
  };

  const countsN1 = countDigits(lastDraw);
  const countsN2 = countDigits(drawN2);
  const countsN3 = countDigits(drawN3);

  for (let i = 0; i < 10; i++) {
      const str = i.toString();
      let score = 0;
      let rsn = [];

      // 1. CHUYÊN GIA KỲ N-2 (TRỄ 1 KỲ) -> TRỌNG SỐ CỰC ĐẠI
      if (countsN2[str]) {
          score += 250 * countsN2[str];
          rsn.push("Cầu Trễ N-2");
      }
      // Bắt Bóng của kỳ N-2 để đề phòng đảo số
      const am = bongAm(str);
      const duong = bongDuong(str);
      if (countsN2[am]) { score += 120; rsn.push("Bóng Âm Trễ"); }
      if (countsN2[duong]) { score += 120; rsn.push("Bóng Dương Trễ"); }

      // 2. CHUYÊN GIA KỲ N-3 (TRỄ 2 KỲ) -> TRỌNG SỐ CAO
      if (countsN3[str]) {
          score += 150 * countsN3[str];
          if (!rsn.includes("Cầu Trễ N-2")) rsn.push("Cầu Trễ N-3");
      }

      // 3. CHUYÊN GIA KỲ N-1 (TRỰC TIẾP) -> Giữ nền tảng
      if (countsN1[str]) {
          score += 100 * countsN1[str];
          if (countsN1[str] >= 2) score += 80; // Kép
          rsn.push("Cầu Trực Tiếp");
      }

      // 4. SIÊU ĐIỂM GIAO THOA (Báo hiệu Lô Bệt)
      // Nếu 1 số xuất hiện ở cả N-1 và N-2 thì tỷ lệ rớt tiếp N rất cao
      if (countsN1[str] && countsN2[str]) {
          score += 200;
          rsn.push("Giao Thoa Bệt");
      }
      
      if (score > 0) {
          stats[str].score += score;
          stats[str].reason.push(...rsn);
      }
  }

  // 5. CHUYÊN GIA TỔNG HẠT NHÂN (Sử dụng tổng N-1)
  if (lastDraw) {
      const sumAll = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
      const sumDigit = (sumAll % 10).toString();
      addScore(sumDigit, 120, "Tổng Trục");
      addScore(bongDuong(sumDigit), 90, "Bóng Tổng");
  }

  return Object.values(stats).map(s => ({
      ...s,
      reason: [...new Set(s.reason)].slice(0, 2).join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`;

code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, newAnalyzeSingleDigits);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded analyzeSingleDigits to Delayed Drop Markov Matrix!");
