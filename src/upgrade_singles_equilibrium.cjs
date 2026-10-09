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

  const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
  const bongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);

  // --- SIÊU THUẬT TOÁN 3 ĐỘNG LỰC CÂN BẰNG (THE CASINO CRACKER) ---
  // Khi máy chủ lừa người chơi, nó luôn dùng công thức: 1 Số Đang Hot + 1 Số Đang Gan + 1 Số Bóng.
  // Ta sẽ bắt chính xác 3 Động Lực này để đập nát hệ thống cân bằng của máy chủ!

  // 1. Phân tích Tần Suất 4 kỳ gần nhất
  const window = Math.min(4, ascData.length);
  const recentDraws = ascData.slice(-window).map(d => d.Result);
  
  const freq = {};
  for(let i=0; i<10; i++) freq[i.toString()] = 0;

  let lastDraw = "";
  recentDraws.forEach((draw, idx) => {
      if (idx === recentDraws.length - 1) lastDraw = draw;
      for (let char of draw) {
          freq[char]++;
      }
  });

  // Tìm Lô HOT (Xuất hiện nhiều nhất)
  let maxFreq = -1;
  let hotDigits = [];
  for (let i = 0; i < 10; i++) {
      if (freq[i.toString()] > maxFreq) {
          maxFreq = freq[i.toString()];
          hotDigits = [i.toString()];
      } else if (freq[i.toString()] === maxFreq) {
          hotDigits.push(i.toString());
      }
  }
  // Ưu tiên số Hot nằm trong kỳ vừa rồi
  let bestHot = hotDigits.find(d => lastDraw.includes(d)) || hotDigits[0];

  // Tìm Lô GAN (Ít xuất hiện nhất)
  let minFreq = 999;
  let coldDigits = [];
  for (let i = 0; i < 10; i++) {
      if (freq[i.toString()] < minFreq) {
          minFreq = freq[i.toString()];
          coldDigits = [i.toString()];
      } else if (freq[i.toString()] === minFreq) {
          coldDigits.push(i.toString());
      }
  }
  let bestCold = coldDigits[0];

  // BƠM ĐIỂM CHO 3 ĐỘNG LỰC CỐT LÕI (Ép Dàn 3 Số phải chứa đủ 3 hệ này)
  
  // Động lực 1: Lô HOT
  if (bestHot) addScore(bestHot, 1000, "Lô Bệt (Hot)");

  // Động lực 2: Lô GAN (Điểm mù của máy chủ)
  if (bestCold) addScore(bestCold, 900, "Lô Gan (Điểm Mù)");

  // Động lực 3: ĐỘT BIẾN BÓNG của Lô Hot (Máy chủ luôn dùng bóng để bù trừ)
  if (bestHot) {
      addScore(bongAm(bestHot), 800, "Bóng Âm Trừ Điểm");
      addScore(bongDuong(bestHot), 700, "Bóng Dương Bù Trừ");
  }

  // Động lực 4: Lô rơi từ Tiền Nhị & Hậu Nhị kỳ trước (Vớt rác)
  if (lastDraw) {
      addScore(lastDraw[0], 600, "Đầu Rơi");
      addScore(lastDraw[4], 500, "Đuôi Rơi");
  }

  return Object.values(stats).map(s => ({
      ...s,
      reason: [...new Set(s.reason)].slice(0, 2).join(', ') || 'Cân Bằng Động'
  })).sort((a, b) => b.score - a.score);
};`;

code = code.replace(/export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.map\(s => \(\{[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/, newAnalyzeSingleDigits);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log("Upgraded analyzeSingleDigits to 3-Force Equilibrium!");
