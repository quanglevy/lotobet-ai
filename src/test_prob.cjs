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

function calculateHitProbability(historySlice) {
  const lastDraw = historySlice[historySlice.length - 1];
  const d = lastDraw.split('');
  
  const probScores = {};
  for (let i = 0; i < 10; i++) probScores[i.toString()] = 0;

  // 1. Cầu Bạc Nhớ Đối Ứng (Trọng số 45)
  probScores[BO_TRA_NHAU[d[2]]] += 45; // Hàng trăm trả
  probScores[BO_TRA_NHAU[d[4]]] += 45; // Hàng đơn vị trả
  probScores[BO_TRA_NHAU[d[3]]] += 30; // Hàng chục trả

  // 2. Lô rơi từ Hậu Nhị & Tâm càng (Trọng số 40)
  probScores[d[4]] += 40; // Đơn vị kỳ trước
  probScores[d[3]] += 35; // Chục kỳ trước
  probScores[d[2]] += 30; // Tâm càng

  // 3. Cầu Pascal Đỉnh & Bóng (Trọng số 35)
  const p = getPascalPeak(lastDraw);
  probScores[p] += 35;
  probScores[getBongDuong(p)] += 25;

  // 4. Bóng Dương & Bóng Âm Hậu Nhị (Trọng số 30)
  probScores[getBongDuong(d[4])] += 30;
  probScores[getBongDuong(d[3])] += 25;
  if (getBongAm(d[4])) probScores[getBongAm(d[4])] += 20;

  // 5. Cả 5 vị trí kỳ trước xuất hiện (Trọng số 20)
  d.forEach(num => { probScores[num] += 15; });

  // 6. Tổng Đối Xứng (Trọng số 20)
  const t1 = ((parseInt(d[0]) + parseInt(d[4])) % 10).toString();
  const t2 = ((parseInt(d[1]) + parseInt(d[3])) % 10).toString();
  probScores[t1] += 20;
  probScores[t2] += 20;

  // 7. Tần suất Hậu Nhị 5 kỳ gần nhất
  const window5 = Math.min(5, historySlice.length);
  const recent = historySlice.slice(-window5);
  recent.forEach(r => {
    probScores[r[3]] += 10;
    probScores[r[4]] += 12;
  });

  // Sắp xếp tăng dần theo Điểm Xác Suất (Điểm thấp nhất = Xác suất về thấp nhất = LOẠI BỎ)
  const sorted = Object.keys(probScores).sort((a, b) => probScores[a] - probScores[b]);

  const loai3 = sorted.slice(0, 3).sort((a, b) => a - b);
  const giu7 = sorted.slice(3).sort((a, b) => a - b);

  const loai4 = sorted.slice(0, 4).sort((a, b) => a - b);
  const giu6 = sorted.slice(4).sort((a, b) => a - b);

  return { loai3, giu7, loai4, giu6, probScores };
}

console.log("=== KIỂM THỬ XÁC SUẤT NỔ HẬU NHỊ CHUẨN ===");
let win3 = 0;
let win4 = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7, loai4, giu6 } = calculateHitProbability(past);

  const isWin3 = giu7.includes(actualHau[0]) && giu7.includes(actualHau[1]);
  const isWin4 = giu6.includes(actualHau[0]) && giu6.includes(actualHau[1]);

  if (isWin3) win3++;
  if (isWin4) win4++;

  console.log(`Kỳ ${i} (${nextDraw}) - Hậu Nhị: [${actualHau}]`);
  console.log(`   - Kèo Loại 3: ❌ Bỏ [${loai3.join(', ')}] 👉 ✅ Đánh 7 số [${giu7.join(', ')}] : ${isWin3 ? '🎯 ĂN (TRÚNG)' : '❌ TRƯỢT'}`);
  console.log(`   - Kèo Loại 4: ❌ Bỏ [${loai4.join(', ')}] 👉 ✅ Đánh 6 số [${giu6.join(', ')}] : ${isWin4 ? '🎯 ĂN (TRÚNG)' : '❌ TRƯỢT'}\n`);
}
console.log(`=> TỔNG TỶ LỆ ĂN KÈO LOẠI 3 SỐ: ${win3}/${history.length - 1} (${((win3/(history.length-1))*100).toFixed(1)}%)`);
console.log(`=> TỔNG TỶ LỆ ĂN KÈO LOẠI 4 SỐ: ${win4}/${history.length - 1} (${((win4/(history.length-1))*100).toFixed(1)}%)`);
