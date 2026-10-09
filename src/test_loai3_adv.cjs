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
const getBongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);

function getPascalPeak(draw) {
  let row = draw.split('').map(Number);
  while (row.length > 1) {
    let nextRow = [];
    for (let i = 0; i < row.length - 1; i++) {
      nextRow.push((row[i] + row[i+1]) % 10);
    }
    row = nextRow;
  }
  return row[0].toString();
}

function getLoai3SoHauNhiAdvanced(historySlice) {
  if (!historySlice || historySlice.length === 0) {
    return { loai3: ['1', '7', '9'], giu7: ['0', '2', '3', '4', '5', '6', '8'], dan49: [] };
  }

  const lastDraw = historySlice[historySlice.length - 1];
  const lastHau = lastDraw.substring(3, 5); // 2 số cuối (chục & đơn vị)
  const lastTien = lastDraw.substring(0, 2);

  const scores = {};
  for (let i = 0; i < 10; i++) scores[i.toString()] = 0;

  // 1. Tuyệt đối bảo vệ các số có CẦU DẪN (Không được phép loại)
  // - Bộ số trả nhau (Hàng trăm & Đơn vị)
  const traTram = BO_TRA_NHAU[lastDraw[2]];
  const traDonVi = BO_TRA_NHAU[lastDraw[4]];
  scores[traTram] += 100;
  scores[traDonVi] += 100;

  // - Cầu Pascal
  const p = getPascalPeak(lastDraw);
  scores[p] += 80;
  scores[getBongDuong(p)] += 60;

  // - Lô rơi Hậu Nhị (Bệt 1 trong 2 con cuối)
  scores[lastHau[0]] += 70;
  scores[lastHau[1]] += 70;

  // - Bóng Dương và Bóng Âm của Hậu Nhị
  scores[getBongDuong(lastHau[0])] += 50;
  scores[getBongDuong(lastHau[1])] += 50;
  scores[getBongAm(lastHau[0])] += 40;
  scores[getBongAm(lastHau[1])] += 40;

  // - Tổng đối xứng & Càng
  scores[((parseInt(lastDraw[0]) + parseInt(lastDraw[4])) % 10).toString()] += 40;
  scores[((parseInt(lastDraw[1]) + parseInt(lastDraw[3])) % 10).toString()] += 40;

  // 2. Điểm trừ cho số không hề có liên kết nào và có chu kỳ nghỉ
  const window8 = Math.min(8, historySlice.length);
  const recentSlice = historySlice.slice(-window8);
  const freq = {};
  for (let i = 0; i < 10; i++) freq[i.toString()] = 0;
  recentSlice.forEach(d => {
    freq[d[3]]++; freq[d[4]]++;
  });

  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    // Nếu quá 6 kỳ không về Hậu Nhị và không có cầu bóng -> Trừ điểm nặng
    if (freq[s] === 0) scores[s] -= 60;
  }

  // Sắp xếp tăng dần theo điểm
  const sorted = Object.keys(scores).sort((a, b) => scores[a] - scores[b]);
  
  // 3 Số điểm THẤP NHẤT là 3 số LOẠI
  const loai3 = sorted.slice(0, 3);
  // 7 Số còn lại là 7 số GIỮ
  const giu7 = sorted.slice(3).sort((a, b) => a - b);

  const dan49 = [];
  for (const d1 of giu7) {
    for (const d2 of giu7) {
      dan49.push(d1 + d2);
    }
  }

  return { loai3, giu7, dan49, scores };
}

console.log("=== KIỂM THỬ THUẬT TOÁN LOẠI 3 SỐ HẬU NHỊ NÂNG CAO ===");
let winCount = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7, dan49 } = getLoai3SoHauNhiAdvanced(past);

  const isD1Giu = giu7.includes(actualHau[0]);
  const isD2Giu = giu7.includes(actualHau[1]);
  const isWin = isD1Giu && isD2Giu;

  if (isWin) winCount++;

  console.log(`Kỳ ${i} (${nextDraw}) - Hậu Nhị: [${actualHau}]`);
  console.log(`   - ❌ Loại 3 số: [${loai3.join(', ')}]`);
  console.log(`   - ✅ Giữ 7 số:  [${giu7.join(', ')}]`);
  console.log(`   - Kết quả:      ${isWin ? '🎯 THẮNG (Ăn dàn 49s)' : '❌ THUA (dính số ' + (isD1Giu ? actualHau[1] : actualHau[0]) + ')'}\n`);
}
console.log(`=> TỔNG TỶ LỆ THẮNG LOẠI 3 SỐ: ${winCount}/${history.length - 1} (${((winCount/(history.length - 1))*100).toFixed(1)}%)`);
