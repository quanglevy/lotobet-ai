const fs = require('fs');

let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

// The function starts with: "export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = []) => {"
// Let's find the start and end of this function.
const startIndex = code.indexOf('export const calculateCauScore = (statsArray');

// We know the next exported function is checkTXCL or predictTXCL, let's find the end.
const endIndex = code.indexOf('export const checkTXCL =');

if (startIndex !== -1 && endIndex !== -1) {
  const newFunction = `export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = []) => {
    const topTongs = scoredTongs.slice(0, 3).map(t => t.tong.toString());
    const top3Chams = scoredSingles.slice(0, 3).map(s => s.number);
    const top5Chams = scoredSingles.slice(0, 5).map(s => s.number);
  
    return statsArray.map(stat => {
      let score = 0;
      let reasons = [];
  
      const d1 = stat.number[0];
      const d2 = stat.number[1];

      // 1. SIÊU ƯU TIÊN: GHÉP TRONG DÀN 5 VÀ DÀN 3 (ĐÁP ỨNG YÊU CẦU CỦA USER)
      // Nếu 2 con số đều nằm trong Top 5 Chạm tinh túy nhất -> Thưởng điểm khổng lồ
      if (top3Chams.includes(d1) && top3Chams.includes(d2)) {
          score += 200; 
          reasons.push("Ghép Dàn 3 VIP");
      } else if (top5Chams.includes(d1) && top5Chams.includes(d2)) {
          score += 100;
          reasons.push("Ghép Dàn 5");
      } else if (top3Chams.includes(d1) || top3Chams.includes(d2)) {
          score += 40;
          reasons.push("Có Chạm Top 3");
      } else if (top5Chams.includes(d1) || top5Chams.includes(d2)) {
          score += 20;
      }
  
      // 2. ENSEMBLE: Tổng Boost
      const tong = ((parseInt(d1) + parseInt(d2)) % 10).toString();
      if (tong === topTongs[0]) { score += 50; reasons.push("Tổng VIP"); }
      else if (tong === topTongs[1]) { score += 30; reasons.push("Tổng Đẹp"); }
      else if (tong === topTongs[2]) { score += 15; }
  
      // 3. Cầu Báo Kép (Double Boost)
      if (d1 === d2) {
         score += 15; reasons.push("Hệ Kép");
      } else if (Math.abs(parseInt(d1) - parseInt(d2)) === 1) {
         score += 10; reasons.push("Hệ Sát Kép");
      }
  
      if (stat.isBongDuong) { score += 15; reasons.push("Bóng Dương"); }
      if (stat.isBongAm) { score += 10; reasons.push("Bóng Âm"); }
      if (stat.isCauLat) { score += 15; reasons.push("Cầu Lộn"); }
  
      return {
        ...stat,
        cauScore: score,
        reasons: reasons
      };
    }).sort((a, b) => b.cauScore - a.cauScore);
  };
  
  `;
  
  const modifiedCode = code.slice(0, startIndex) + newFunction + code.slice(endIndex);
  fs.writeFileSync('src/utils/statistics.js', modifiedCode, 'utf8');
  console.log("Successfully fixed calculateCauScore!");
} else {
  console.log("Could not find boundaries.");
}
