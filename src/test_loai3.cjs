const history = [
  "93169", // 0
  "35080", // 1
  "43084", // 2
  "82448", // 3
  "64866", // 4
  "79953", // 5
  "53508", // 6
  "39241", // 7
  "39241", // 8
  "21094"  // 9
];

const BO_TRA_NHAU = {
  '0': '9', '9': '0', '1': '7', '7': '1', '2': '5', '5': '2', '3': '6', '6': '3', '4': '8', '8': '4'
};
const getBongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);

function getLoai3SoHauNhi(historySlice) {
  if (!historySlice || historySlice.length === 0) {
    return { loai3: ['1', '7', '9'], giu7: ['0', '2', '3', '4', '5', '6', '8'], dan49: [] };
  }

  const lastDraw = historySlice[historySlice.length - 1];
  const lastHau = lastDraw.substring(3, 5); // 2 số cuối

  // Chấm điểm xác suất xuất hiện ở HẬU NHỊ (0-9)
  const digitScores = {};
  for (let i = 0; i < 10; i++) digitScores[i.toString()] = 0;

  // 1. Số nằm trong Bộ Trả Nhau của Trăm & Đơn vị -> Điểm RẤT CAO (Không được loại)
  const tram = lastDraw[2];
  const donVi = lastDraw[4];
  digitScores[BO_TRA_NHAU[tram]] += 50;
  digitScores[BO_TRA_NHAU[donVi]] += 50;

  // 2. Số bệt Hậu Nhị (con vừa ra ở Hậu Nhị thường có xác suất rơi lại 1 con)
  digitScores[lastHau[0]] += 30;
  digitScores[lastHau[1]] += 30;

  // 3. Số bóng dương của Hậu Nhị
  digitScores[getBongDuong(lastHau[0])] += 20;
  digitScores[getBongDuong(lastHau[1])] += 20;

  // 4. Quét tần suất Hậu Nhị trong 5 kỳ gần nhất
  const window5 = Math.min(5, historySlice.length);
  const recentSlice = historySlice.slice(-window5);
  const hauFreq = {};
  for (let i = 0; i < 10; i++) hauFreq[i.toString()] = 0;
  recentSlice.forEach(d => {
    hauFreq[d[3]]++;
    hauFreq[d[4]]++;
  });

  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    // Nếu quá gan (0 lần trong 5 kỳ) mà không có cầu bóng -> Dễ bị loại
    if (hauFreq[s] === 0) {
      digitScores[s] -= 25;
    } else {
      digitScores[s] += hauFreq[s] * 10;
    }
  }

  // Sắp xếp từ ĐIỂM THẤP NHẤT đến CAO NHẤT
  const sortedAsc = Object.keys(digitScores).sort((a, b) => digitScores[a] - digitScores[b]);
  
  // 3 Số điểm THẤP NHẤT là 3 số LOẠI
  const loai3 = sortedAsc.slice(0, 3);
  // 7 Số còn lại là 7 số GIỮ
  const giu7 = sortedAsc.slice(3).sort((a, b) => a - b);

  // Tạo dàn 49 số từ 7 số giữ lại
  const dan49 = [];
  for (const d1 of giu7) {
    for (const d2 of giu7) {
      dan49.push(d1 + d2);
    }
  }

  return { loai3, giu7, dan49, digitScores };
}

console.log("=== KIỂM THỬ THUẬT TOÁN LOẠI 3 SỐ HẬU NHỊ TRÊN LỊCH SỬ THỰC TẾ ===");
let winCount = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7, dan49 } = getLoai3SoHauNhi(past);

  // Thắng khi 2 số Hậu Nhị KHÔNG CHỨA bất kỳ số nào trong 3 số loại (tức là cả 2 số đều nằm trong 7 số giữ)
  const isD1Giu = giu7.includes(actualHau[0]);
  const isD2Giu = giu7.includes(actualHau[1]);
  const isWin = isD1Giu && isD2Giu;

  if (isWin) winCount++;

  console.log(`Kỳ ${i} (${nextDraw}) - Hậu Nhị về: [${actualHau}]`);
  console.log(`   - Loại 3 số: [${loai3.join(', ')}]`);
  console.log(`   - Giữ 7 số:  [${giu7.join(', ')}]`);
  console.log(`   - Kết quả:   ${isWin ? '✅ THẮNG (Ăn dàn 49s)' : '❌ THUA (dính số ' + (isD1Giu ? actualHau[1] : actualHau[0]) + ')'}\n`);
}
console.log(`=> TỔNG TỶ LỆ THẮNG LOẠI 3 SỐ HẬU NHỊ: ${winCount}/${history.length - 1} (${((winCount/(history.length - 1))*100).toFixed(1)}%)`);
