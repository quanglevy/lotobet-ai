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

  const addScore = (numStr, pts, rsn) => {
      if (stats[numStr]) {
          stats[numStr].score += pts;
          if (!stats[numStr].reason.includes(rsn)) stats[numStr].reason.push(rsn);
      }
  };

  const lastDraw = ascData[ascData.length - 1]?.Result || "";

  // --- SIÊU THUẬT TOÁN HỌC MÁY (MARKOV CHAIN AI) ---
  // Hủy bỏ hoàn toàn các cầu cứng (Bóng, Đạo hàm, Tổng) vì máy chủ đang bẻ cầu liên tục.
  // Giải pháp duy nhất: Cho AI tự động quét lại TOÀN BỘ lịch sử của phiên hiện tại,
  // học xem máy chủ thường nhả ra số gì SAU KHI xuất hiện các con số giống kỳ vừa rồi.
  
  if (ascData.length >= 2) {
      // 1. Khởi tạo bộ nhớ AI
      const transitionCounts = {};
      for (let i = 0; i < 10; i++) transitionCounts[i] = 0;
      
      const uniqueLastDraw = [...new Set(lastDraw.split(''))];

      // 2. Quét toàn bộ lịch sử để tìm quy luật
      for (let i = 0; i < ascData.length - 1; i++) {
          const drawA = ascData[i].Result;
          const drawB = ascData[i + 1].Result; // Kết quả theo sau drawA
          
          if (!drawA || !drawB) continue;

          // Chấm điểm độ tương đồng của drawA với lastDraw hiện tại
          let matchCount = 0;
          for (let char of uniqueLastDraw) {
              if (drawA.includes(char)) matchCount++;
          }
          
          // Nếu drawA giống lastDraw, các con số của drawB sẽ được AI lưu vào bộ nhớ
          if (matchCount > 0) {
              // Trọng số thời gian (Càng gần hiện tại, quy luật càng chính xác)
              const recencyWeight = (i / ascData.length) * 2; 
              
              for (let char of drawB) {
                  // Điểm = Độ tương đồng * Hệ số thời gian
                  transitionCounts[char] += (matchCount * 50 * recencyWeight);
              }
          }
      }

      // 3. Đổ dữ liệu từ bộ nhớ AI vào bảng điểm
      for (let i = 0; i < 10; i++) {
          if (transitionCounts[i] > 0) {
              addScore(i.toString(), transitionCounts[i], "AI Quét Lịch Sử");
          }
      }
  }

  // 4. Bọc lót an toàn: Lô Rơi (Vì bản chất Lotobet vẫn luôn có lô rơi)
  const currentCounts = {};
  for (let char of lastDraw) currentCounts[char] = (currentCounts[char] || 0) + 1;
  Object.keys(currentCounts).forEach(d => {
      addScore(d, 120 * currentCounts[d], "Lô Rơi Hạt Nhân");
  });

  return Object.values(stats).map(s => ({
      ...s,
      reason: [...new Set(s.reason)].slice(0, 2).join(', ') || 'AI Dự Đoán'
  })).sort((a, b) => b.score - a.score);
};`;

code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, newAnalyzeSingleDigits);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded analyzeSingleDigits to ML Markov Chain!");
