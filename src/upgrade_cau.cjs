const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const calculateCauScore = \(statsArray, scoredTongs = \[\], scoredSingles = \[\]\) => \{[\s\S]*?return \{\n\s*\.\.\.stat,\n\s*cauScore: score,\n\s*reasons: reasons\n\s*\};\n\s*\}\)\.sort\(\(a, b\) => b\.cauScore - a\.cauScore\);\n\};/m;

const newCode = `export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = [], rawData = []) => {
    // 1. LẤY DỮ LIỆU KỲ VỪA RỒI ĐỂ TÌM CHẠM BỆT
    const ascData = [...rawData].reverse();
    const lastDraw = ascData.length > 0 ? ascData[ascData.length - 1].Result : "00000";
    
    // Đề Đầu (Tiền) và Đề Đuôi (Hậu) kỳ trước
    const lastTien = lastDraw.substring(0, 2);
    const lastHau = lastDraw.substring(3, 5);
    
    // Các Chạm đang bệt (các chữ số vừa ra ở Đầu/Đuôi)
    const baccaratTouches = [lastTien[0], lastTien[1], lastHau[0], lastHau[1]];
    
    // Tìm Chạm Rơi Nhiều Nhất (Ví dụ 52 và 29 -> Chạm 2 xuất hiện 2 lần -> Bệt cứng)
    const touchFreq = {};
    baccaratTouches.forEach(t => touchFreq[t] = (touchFreq[t] || 0) + 1);
    const hotTouches = Object.keys(touchFreq).sort((a, b) => touchFreq[b] - touchFreq[a]);
    
    const topTongs = scoredTongs.slice(0, 3).map(t => t.tong.toString());
    const topChams = scoredSingles.slice(0, 5).map(s => s.number);
  
    return statsArray.map(stat => {
      let score = 0;
      let reasons = [];
  
      const d1 = stat.number[0];
      const d2 = stat.number[1];
      const tong = ((parseInt(d1) + parseInt(d2)) % 10).toString();

      // ==========================================
      // THUẬT TOÁN DÀN 2D THỰC CHIẾN MỨC MAX
      // ==========================================

      // 1. ÉP CHẠM BỆT (STREAK TOUCHES CỦA KỲ TRƯỚC) - Quan trọng nhất Lotobet
      // Máy chủ Lotobet có thói quen giữ lại ít nhất 1 chạm của kỳ trước
      if (d1 === hotTouches[0] || d2 === hotTouches[0]) {
          score += 300; reasons.push(\`Chạm Bệt Đỉnh (\${hotTouches[0]})\`);
      }
      if (hotTouches.length > 1 && (d1 === hotTouches[1] || d2 === hotTouches[1])) {
          score += 200; reasons.push(\`Chạm Bệt Lót (\${hotTouches[1]})\`);
      }

      // 2. CHẠM VIP TỪ THỐNG KÊ SINGLE DIGITS (Đã chuyển sang Streak Surfing)
      if (d1 === topChams[0] || d2 === topChams[0]) { score += 150; reasons.push("Chạm VIP 1"); }
      if (d1 === topChams[1] || d2 === topChams[1]) { score += 100; reasons.push("Chạm VIP 2"); }
      
      // Khóa Song Thủ (Cả 2 số đều nằm trong dàn hot)
      if ((d1 === hotTouches[0] || d2 === hotTouches[0]) && (d1 === topChams[0] || d2 === topChams[0])) {
          score += 250; reasons.push("Khóa Chạm Kép");
      }

      // 3. TỔNG BẠC NHỚ
      if (tong === topTongs[0]) { score += 180; reasons.push("Tổng VIP 1"); }
      else if (tong === topTongs[1]) { score += 120; reasons.push("Tổng VIP 2"); }
      else if (tong === topTongs[2]) { score += 60; }
  
      // 4. LÔ RƠI VÀ LỘN CỦA KỲ TRƯỚC
      if (stat.number === lastTien || stat.number === lastHau) {
          score += 50; reasons.push("Lô Rơi Nguyên Bản");
      }
      if (stat.number === lastTien.split('').reverse().join('') || stat.number === lastHau.split('').reverse().join('')) {
          score += 40; reasons.push("Lô Lộn Kỳ Trước");
      }
  
      if (stat.isBongDuong) { score += 20; reasons.push("Bóng Dương"); }
      if (stat.isBongAm) { score += 15; reasons.push("Bóng Âm"); }
  
      return {
        ...stat,
        cauScore: score,
        reasons: reasons
      };
    }).sort((a, b) => b.cauScore - a.cauScore);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded calculateCauScore to MAX LEVEL 2D!');
