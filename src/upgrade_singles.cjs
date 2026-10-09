const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/m;

const newCode = `export const analyzeSingleDigits = (data) => {
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

  const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
  const bongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);

  // --- SIÊU THUẬT TOÁN MA TRẬN VỊ TRÍ (POSITIONAL MATRIX) ---
  // Mục tiêu: Bắt chuẩn 3-4 số trong dàn 5 tinh.
  // Cách làm: Tách biệt 5 vị trí (Vạn, Thiên, Bách, Thập, Đơn). 
  // Dùng chuỗi Markov độc lập cho từng vị trí để tìm ra con số có xác suất rơi cao nhất ở vị trí đó trong kỳ tiếp theo.
  
  const lastDraw = ascData[ascData.length - 1].Result;

  for (let pos = 0; pos < 5; pos++) {
      const targetDigit = lastDraw[pos];
      const nextDigitFreq = {};
      
      // Khởi tạo
      for (let i = 0; i < 10; i++) nextDigitFreq[i.toString()] = 0;

      // Quét lịch sử (bỏ qua kỳ cuối cùng vì chưa có kỳ tiếp theo)
      for (let i = 0; i < ascData.length - 1; i++) {
          if (ascData[i].Result[pos] === targetDigit) {
              const nextDigit = ascData[i+1].Result[pos];
              nextDigitFreq[nextDigit]++;
          }
      }

      // Xếp hạng các con số dễ rơi tiếp theo ở vị trí pos
      const sortedFreq = Object.keys(nextDigitFreq).sort((a, b) => nextDigitFreq[b] - nextDigitFreq[a]);
      
      const top1 = sortedFreq[0];
      const top2 = sortedFreq[1];

      const posName = ['Vạn', 'Thiên', 'Bách', 'Thập', 'Đơn'][pos];

      if (nextDigitFreq[top1] > 0) {
          addScore(top1, 500, \`Markov \${posName}\`);
          
          // Bóng của top1 cũng có tỉ lệ rơi rất cao (nhà cái hay bẻ bóng)
          addScore(bongDuong(top1), 200, \`Bóng Dương \${posName}\`);
          addScore(bongAm(top1), 100, \`Bóng Âm \${posName}\`);
      }
      if (nextDigitFreq[top2] > 0) {
          addScore(top2, 300, \`Lót \${posName}\`);
      }
  }

  // Phân tích Nhịp Rơi Tự Do (Free-fall Trend)
  // Các con số xuất hiện nhiều nhất trong 3 kỳ gần đây (đang có đà rơi)
  const window = Math.min(3, ascData.length);
  const recentDraws = ascData.slice(-window).map(d => d.Result);
  const recentFreq = {};
  for (let i = 0; i < 10; i++) recentFreq[i.toString()] = 0;
  recentDraws.forEach(draw => {
      for (let char of draw) recentFreq[char]++;
  });
  
  for (let i = 0; i < 10; i++) {
      if (recentFreq[i.toString()] >= 2) {
          addScore(i.toString(), 150, "Đà Rơi (Hot)");
      }
  }

  return Object.values(stats).sort((a, b) => b.score - a.score);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded analyzeSingleDigits!');
