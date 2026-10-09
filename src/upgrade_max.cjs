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

  // =========================================================================
  // --- SIÊU THUẬT TOÁN MAX LEVEL: TENSOR CASCADING (LƯỚI QUÉT ĐA TẦNG) ---
  // Mục tiêu: Ôm trọn 3-4 số trong kết quả 5 tinh bằng lưới bọc lót.
  // =========================================================================

  const lastDraw = ascData[ascData.length - 1].Result;

  // 1. TẦNG 1: CẦU TỔNG VẠN - ĐƠN (Tuyệt kỹ bạc nhớ)
  // Tổng của số Vạn và Đơn kỳ trước thường rớt lại làm 1 chạm ở kỳ sau.
  const van = parseInt(lastDraw[0]);
  const don = parseInt(lastDraw[4]);
  const tongVanDon = (van + don) % 10;
  addScore(tongVanDon.toString(), 800, "Tổng Vạn-Đơn");
  addScore(bongDuong(tongVanDon.toString()), 400, "Bóng Vạn-Đơn");

  // 2. TẦNG 2: CẦU KẸP (SANDWICH BRIDGE) - Bắt số bị kẹp giữa 2 số giống nhau
  // Ví dụ: 5 8 5 1 2 -> Số 8 bị kẹp giữa 2 số 5 -> Rất dễ nổ.
  for (let i = 1; i < 4; i++) {
      if (lastDraw[i-1] === lastDraw[i+1]) {
          addScore(lastDraw[i], 900, \`Cầu Kẹp (\${lastDraw[i-1]}\${lastDraw[i]}\${lastDraw[i+1]})\`);
      }
  }

  // Cầu Kẹp kép (Ví dụ: 1 1 5 1 2 -> Số 5 bị kẹp)
  for (let i = 2; i < 5; i++) {
      if (lastDraw[i-2] === lastDraw[i] && lastDraw[i-1] !== lastDraw[i]) {
         // Pattern A B A
         addScore(lastDraw[i-1], 700, "Cầu Quả Trám");
      }
  }

  // 3. TẦNG 3: VI PHÂN BƯỚC NHẢY (DELTA STEP) CHO TỪNG VỊ TRÍ
  // Đo khoảng cách rơi của từng vị trí trong 3 kỳ gần nhất.
  if (ascData.length >= 3) {
      const draw1 = ascData[ascData.length - 3].Result;
      const draw2 = ascData[ascData.length - 2].Result;
      const draw3 = ascData[ascData.length - 1].Result; // lastDraw

      for (let pos = 0; pos < 5; pos++) {
          const d1 = parseInt(draw1[pos]);
          const d2 = parseInt(draw2[pos]);
          const d3 = parseInt(draw3[pos]);

          // Gia tốc: delta2 - delta1
          const delta1 = (d2 - d1 + 10) % 10;
          const delta2 = (d3 - d2 + 10) % 10;

          // Nếu gia tốc ổn định (tịnh tiến đều)
          if (delta1 === delta2) {
              const predicted = (d3 + delta2) % 10;
              const posName = ['Vạn', 'Thiên', 'Bách', 'Thập', 'Đơn'][pos];
              addScore(predicted.toString(), 600, \`Vi phân \${posName}\`);
          }
      }
  }

  // 4. TẦNG 4: LÔ RƠI (MÔMEN ĐỘNG LƯỢNG)
  // Các con số đang xuất hiện >= 2 lần trong kỳ vừa rồi có xu hướng rơi lại rất mạnh.
  const freqLastDraw = {};
  for(let char of lastDraw) {
      freqLastDraw[char] = (freqLastDraw[char] || 0) + 1;
  }
  for (let char in freqLastDraw) {
      if (freqLastDraw[char] >= 2) {
          addScore(char, 500, "Lô Rơi Nhiều Nháy");
      }
  }

  // 5. TẦNG 5: BỌC LÓT LÔ GAN THEO VỊ TRÍ (Đảo chiều)
  // Tính tần suất 15 kỳ gần nhất. Số nào xuất hiện ít nhất sẽ có 1 slot để chống "bẻ cầu".
  const window = Math.min(15, ascData.length);
  const recentDraws = ascData.slice(-window).map(d => d.Result);
  const freq15 = {};
  for (let i = 0; i < 10; i++) freq15[i.toString()] = 0;
  recentDraws.forEach(draw => {
      for (let char of draw) freq15[char]++;
  });
  
  let minFreq = 999;
  let coldDigit = '0';
  for (let i = 0; i < 10; i++) {
      if (freq15[i.toString()] < minFreq) {
          minFreq = freq15[i.toString()];
          coldDigit = i.toString();
      }
  }
  addScore(coldDigit, 450, "Ép Gan Max");

  return Object.values(stats).sort((a, b) => b.score - a.score);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded to MAX LEVEL Tensor Cascading!');
