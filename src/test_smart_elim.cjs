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

function getSmartElimination(historySlice) {
  const lastDraw = historySlice[historySlice.length - 1];
  const d = lastDraw.split('');

  // Chấm điểm xác suất nổ ở HẬU NHỊ (Hàng chục & Đơn vị)
  const pScore = {};
  for (let i = 0; i < 10; i++) pScore[i.toString()] = 0;

  // 1. Trọng tâm #1: Hàng Trăm, Hàng Chục, Hàng Đơn Vị (3 vị trí vàng)
  pScore[d[4]] += 55; // Rơi đơn vị
  pScore[d[3]] += 50; // Rơi chục
  pScore[d[2]] += 45; // Rơi tâm càng

  // 2. Trọng tâm #2: Bộ Trả Nhau của 3 vị trí vàng
  pScore[BO_TRA_NHAU[d[4]]] += 50;
  pScore[BO_TRA_NHAU[d[2]]] += 45;
  pScore[BO_TRA_NHAU[d[3]]] += 40;

  // 3. Trọng tâm #3: Cầu Pascal Đỉnh & Bóng
  const p = getPascalPeak(lastDraw);
  pScore[p] += 40;
  pScore[getBongDuong(p)] += 30;

  // 4. Trọng tâm #4: Bóng Dương của Hậu Nhị
  pScore[getBongDuong(d[4])] += 35;
  pScore[getBongDuong(d[3])] += 30;

  // 5. Trọng tâm #5: Vị trí Vạn & Ngàn (Trọng số phụ)
  pScore[d[0]] += 15;
  pScore[d[1]] += 15;
  pScore[BO_TRA_NHAU[d[0]]] += 15;
  pScore[BO_TRA_NHAU[d[1]]] += 15;

  // 6. Nhịp Bệt Hậu Nhị trong 3 kỳ gần nhất
  const win3 = Math.min(3, historySlice.length);
  const rec3 = historySlice.slice(-win3);
  rec3.forEach((dr, idx) => {
    const w = (idx + 1) * 8;
    pScore[dr[3]] += w;
    pScore[dr[4]] += w;
  });

  // Sắp xếp tăng dần: 3 số điểm thấp nhất -> LOẠI
  const sorted = Object.keys(pScore).sort((a, b) => pScore[a] - pScore[b]);

  const loai3 = sorted.slice(0, 3).sort((a, b) => a - b);
  const giu7 = sorted.slice(3).sort((a, b) => a - b);

  const loai4 = sorted.slice(0, 4).sort((a, b) => a - b);
  const giu6 = sorted.slice(4).sort((a, b) => a - b);

  return { loai3, giu7, loai4, giu6, pScore };
}

console.log("=== KIỂM THỬ SMART ELIMINATION MODEL ===");
let w3 = 0, w4 = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7, loai4, giu6, pScore } = getSmartElimination(past);

  const isWin3 = giu7.includes(actualHau[0]) && giu7.includes(actualHau[1]);
  const isWin4 = giu6.includes(actualHau[0]) && giu6.includes(actualHau[1]);

  if (isWin3) w3++;
  if (isWin4) w4++;

  console.log(`Kỳ ${i} (${nextDraw}) - Hậu Nhị: [${actualHau}]`);
  console.log(`   - Kèo Loại 3: ❌ Bỏ [${loai3.join(', ')}] 👉 ✅ Đánh 7 số [${giu7.join(', ')}] : ${isWin3 ? '🎯 ĂN' : '❌ TRƯỢT'}`);
  console.log(`   - Kèo Loại 4: ❌ Bỏ [${loai4.join(', ')}] 👉 ✅ Đánh 6 số [${giu6.join(', ')}] : ${isWin4 ? '🎯 ĂN' : '❌ TRƯỢT'}\n`);
}
console.log(`=> TỔNG TỶ LỆ ĂN KÈO LOẠI 3 SỐ: ${w3}/${history.length - 1} (${((w3/(history.length-1))*100).toFixed(1)}%)`);
console.log(`=> TỔNG TỶ LỆ ĂN KÈO LOẠI 4 SỐ: ${w4}/${history.length - 1} (${((w4/(history.length-1))*100).toFixed(1)}%)`);
