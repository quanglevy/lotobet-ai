const fs = require('fs');

let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const startIndex = code.indexOf('export const calculateCauScore = (statsArray');
const endIndex = code.indexOf('export const generateReversibleSet =');

if (startIndex !== -1 && endIndex !== -1) {
  const newFunction = `export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = []) => {
  const topTongs = scoredTongs.slice(0, 3).map(t => t.tong.toString());
  const topChams = scoredSingles.slice(0, 5).map(s => s.number);

  return statsArray.map(stat => {
    let score = 0;
    let reasons = [];

    const d1 = stat.number[0];
    const d2 = stat.number[1];

    // 1. PHÂN BỔ DÀN CHẠM (Mở rộng biên độ để tăng tỷ lệ nổ Dàn 10, 20)
    // Thay vì ép 2 số phải nằm trong top, ta cộng điểm lớn cho bất kỳ số nào có chứa Chạm VIP
    if (d1 === topChams[0] || d2 === topChams[0]) { score += 120; reasons.push("Chạm VIP 1"); }
    if (d1 === topChams[1] || d2 === topChams[1]) { score += 90; reasons.push("Chạm VIP 2"); }
    if (d1 === topChams[2] || d2 === topChams[2]) { score += 70; reasons.push("Chạm VIP 3"); }
    if (d1 === topChams[3] || d2 === topChams[3]) { score += 40; }
    
    // Nếu cả 2 số đều nằm trong Top 3 (Bạch thủ, Tứ thủ)
    if (topChams.slice(0, 3).includes(d1) && topChams.slice(0, 3).includes(d2)) {
        score += 150; 
        reasons.push("Song Kiếm VIP");
    }

    // 2. ENSEMBLE: Tổng Boost
    const tong = ((parseInt(d1) + parseInt(d2)) % 10).toString();
    if (tong === topTongs[0]) { score += 100; reasons.push("Tổng VIP 1"); }
    else if (tong === topTongs[1]) { score += 60; reasons.push("Tổng VIP 2"); }
    else if (tong === topTongs[2]) { score += 30; }

    // 3. Cầu Báo Kép (Double Boost)
    if (d1 === d2) {
       score += 35; reasons.push("Kép");
    } else if (Math.abs(parseInt(d1) - parseInt(d2)) === 1) {
       score += 25; reasons.push("Sát Kép");
    }

    if (stat.isBongDuong) { score += 20; reasons.push("Bóng Dương"); }
    if (stat.isBongAm) { score += 15; reasons.push("Bóng Âm"); }
    if (stat.isCauLat) { score += 20; reasons.push("Cầu Lộn"); }

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
  console.log("Upgraded calculateCauScore to Spread Array Coverage!");
} else {
  console.log("Could not find boundaries.");
}
