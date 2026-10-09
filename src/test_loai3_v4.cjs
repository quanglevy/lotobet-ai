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

function getLoai3SoHauNhiV4(historySlice) {
  if (!historySlice || historySlice.length === 0) {
    return { loai3: ['1', '7', '9'], giu7: ['0', '2', '3', '4', '5', '6', '8'], dan49: [] };
  }

  const lastDraw = historySlice[historySlice.length - 1];
  const d = lastDraw.split('');

  const scores = {};
  for (let i = 0; i < 10; i++) scores[i.toString()] = 0;

  // 1. Lô rơi cả 5 vị trí
  d.forEach(num => { scores[num] += 40; });

  // 2. Bộ Số Trả Nhau Kubet (Hàng trăm & Đơn vị)
  scores[BO_TRA_NHAU[d[2]]] += 60;
  scores[BO_TRA_NHAU[d[4]]] += 60;

  // 3. Cầu Pascal
  const p = getPascalPeak(lastDraw);
  scores[p] += 50;
  scores[getBongDuong(p)] += 35;

  // 4. Bóng Âm & Bóng Dương của 2 số Hậu Nhị kỳ trước
  const h1 = d[3]; const h2 = d[4];
  scores[getBongDuong(h1)] += 35;
  scores[getBongDuong(h2)] += 35;
  if (getBongAm(h1)) scores[getBongAm(h1)] += 30;
  if (getBongAm(h2)) scores[getBongAm(h2)] += 30;

  // 5. Cầu Tổng Đối Xứng
  scores[((parseInt(d[0]) + parseInt(d[4])) % 10).toString()] += 30;
  scores[((parseInt(d[1]) + parseInt(d[3])) % 10).toString()] += 30;

  // 6. Kiểm tra nhịp gan Hậu Nhị (5 kỳ gần nhất)
  const window5 = Math.min(5, historySlice.length);
  const recent = historySlice.slice(-window5);
  const hauCount = {};
  for (let i = 0; i < 10; i++) hauCount[i.toString()] = 0;
  recent.forEach(r => {
    hauCount[r[3]]++; hauCount[r[4]]++;
  });

  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    scores[s] += hauCount[s] * 10;
  }

  // 3 Số điểm THẤP NHẤT là 3 số LOẠI
  const sorted = Object.keys(scores).sort((a, b) => scores[a] - scores[b]);
  const loai3 = sorted.slice(0, 3);
  const giu7 = sorted.slice(3).sort((a, b) => a - b);

  const dan49 = [];
  for (const d1 of giu7) {
    for (const d2 of giu7) {
      dan49.push(d1 + d2);
    }
  }

  return { loai3, giu7, dan49, scores };
}

console.log("=== KIỂM THỬ THUẬT TOÁN LOẠI 3 SỐ HẬU NHỊ V4 ===");
let winCount = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7 } = getLoai3SoHauNhiV4(past);

  const isD1Giu = giu7.includes(actualHau[0]);
  const isD2Giu = giu7.includes(actualHau[1]);
  const isWin = isD1Giu && isD2Giu;

  if (isWin) winCount++;

  console.log(`Kỳ ${i} (${nextDraw}) - Hậu Nhị về: [${actualHau}]`);
  console.log(`   - ❌ Loại 3 số: [${loai3.join(', ')}]`);
  console.log(`   - ✅ Giữ 7 số:  [${giu7.join(', ')}]`);
  console.log(`   - Kết quả:      ${isWin ? '🎯 THẮNG (Ăn dàn 49s)' : '❌ THUA (dính số ' + (isD1Giu ? actualHau[1] : actualHau[0]) + ')'}\n`);
}
console.log(`=> TỔNG TỶ LỆ THẮNG LOẠI 3 SỐ: ${winCount}/${history.length - 1} (${((winCount/(history.length - 1))*100).toFixed(1)}%)`);
