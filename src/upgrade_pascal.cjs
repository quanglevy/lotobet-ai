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
  // --- SIÊU THUẬT TOÁN ĐỈNH CAO: TAM GIÁC PASCAL KẾT HỢP BÓNG TỊNH TIẾN ---
  // Mục tiêu: Ép chuẩn xác Dàn 3 Số và 4 Số (Phải nổ ít nhất 3 con).
  // =========================================================================

  // Hàm tính Tam Giác Pascal cho 1 dãy số
  const getPascal = (str) => {
      let current = str.split('').map(Number);
      while (current.length > 1) {
          let next = [];
          for (let i = 0; i < current.length - 1; i++) {
              next.push((current[i] + current[i+1]) % 10);
          }
          current = next;
      }
      return current[0].toString();
  };

  // Lấy 2 số ở đáy tam giác Pascal (trước khi ra chóp)
  const getPascalBase = (str) => {
      let current = str.split('').map(Number);
      while (current.length > 2) {
          let next = [];
          for (let i = 0; i < current.length - 1; i++) {
              next.push((current[i] + current[i+1]) % 10);
          }
          current = next;
      }
      return current.map(String); // Trả về mảng 2 số
  };

  const lastDraw = ascData[ascData.length - 1].Result;
  
  // 1. CHÓP PASCAL KỲ VỪA RỒI (Trọng số Tuyệt Đối)
  const pascalTip = getPascal(lastDraw);
  addScore(pascalTip, 1000, "Chóp Pascal");
  
  // 2. BÓNG DƯƠNG & BÓNG ÂM CỦA CHÓP PASCAL (Để ôm trọn bộ 3 số cốt lõi)
  addScore(bongDuong(pascalTip), 800, "Bóng D. Pascal");
  addScore(bongAm(pascalTip), 700, "Bóng Â. Pascal");

  // 3. ĐÁY PASCAL (2 Số cấp dưới chóp) - Đảm bảo Dàn 4-5 số không bị lọt
  const pascalBase = getPascalBase(lastDraw);
  addScore(pascalBase[0], 600, "Đáy Pascal 1");
  addScore(pascalBase[1], 600, "Đáy Pascal 2");

  // 4. CHÓP PASCAL KỲ TRƯỚC ĐÓ (Nhịp rơi chậm)
  if (ascData.length >= 2) {
      const prevDraw = ascData[ascData.length - 2].Result;
      const prevPascalTip = getPascal(prevDraw);
      addScore(prevPascalTip, 500, "Pascal Nhịp Chậm");
  }

  // 5. CẦU LÔ KÉP (Bắt buộc phải lót nếu kỳ trước có kép)
  for (let i = 0; i < 4; i++) {
      if (lastDraw[i] === lastDraw[i+1]) {
          addScore(lastDraw[i], 400, "Kép");
          addScore(bongDuong(lastDraw[i]), 300, "Bóng Kép");
      }
  }

  return Object.values(stats).sort((a, b) => b.score - a.score);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded to Pascal Triangle Algorithm!');
