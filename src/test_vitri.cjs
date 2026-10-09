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

function getLoaiTheoViTri(historySlice) {
  const lastDraw = historySlice[historySlice.length - 1];
  const d = lastDraw.split('');

  // 1. Chấm điểm riêng cho HÀNG CHỤC (d3)
  const chucScores = {};
  for (let i = 0; i < 10; i++) chucScores[i.toString()] = 0;
  chucScores[d[3]] += 50; // bệt chục
  chucScores[d[2]] += 45; // tâm càng rơi sang chục
  chucScores[BO_TRA_NHAU[d[3]]] += 45;
  chucScores[BO_TRA_NHAU[d[2]]] += 40;
  chucScores[getBongDuong(d[3])] += 35;
  chucScores[d[0]] += 20;

  // 2. Chấm điểm riêng cho HÀNG ĐƠN VỊ (d4)
  const dvScores = {};
  for (let i = 0; i < 10; i++) dvScores[i.toString()] = 0;
  dvScores[d[4]] += 55; // bệt đơn vị
  dvScores[BO_TRA_NHAU[d[4]]] += 50;
  dvScores[getBongDuong(d[4])] += 40;
  dvScores[BO_TRA_NHAU[d[2]]] += 35;
  dvScores[d[2]] += 30;

  const sortedChuc = Object.keys(chucScores).sort((a, b) => chucScores[a] - chucScores[b]);
  const loai3Chuc = sortedChuc.slice(0, 3).sort((a, b) => a - b);
  const giu7Chuc = sortedChuc.slice(3).sort((a, b) => a - b);

  const sortedDv = Object.keys(dvScores).sort((a, b) => dvScores[a] - dvScores[b]);
  const loai3Dv = sortedDv.slice(0, 3).sort((a, b) => a - b);
  const giu7Dv = sortedDv.slice(3).sort((a, b) => a - b);

  return { loai3Chuc, giu7Chuc, loai3Dv, giu7Dv };
}

console.log("=== KIỂM THỬ ĐÁNH LOẠI THEO TỪNG VỊ TRÍ (HÀNG CHỤC & ĐƠN VỊ) ===");
let hitChuc = 0;
let hitDv = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualChuc = nextDraw[3];
  const actualDv = nextDraw[4];
  const { loai3Chuc, giu7Chuc, loai3Dv, giu7Dv } = getLoaiTheoViTri(past);

  const isChucWin = giu7Chuc.includes(actualChuc);
  const isDvWin = giu7Dv.includes(actualDv);

  if (isChucWin) hitChuc++;
  if (isDvWin) hitDv++;

  console.log(`Kỳ ${i} (${nextDraw}): Chục [${actualChuc}] - Đơn Vị [${actualDv}]`);
  console.log(`   - Hàng Chục:   ❌ Bỏ [${loai3Chuc.join(',')}] 👉 ✅ Đánh 7 số [${giu7Chuc.join(',')}] : ${isChucWin ? '🎯 ĂN' : '❌ TRƯỢT'}`);
  console.log(`   - Hàng Đơn Vị: ❌ Bỏ [${loai3Dv.join(',')}] 👉 ✅ Đánh 7 số [${giu7Dv.join(',')}] : ${isDvWin ? '🎯 ĂN' : '❌ TRƯỢT'}\n`);
}
console.log(`=> TỔNG TỶ LỆ ĂN HÀNG CHỤC:   ${hitChuc}/${history.length - 1} (${((hitChuc/(history.length-1))*100).toFixed(1)}%)`);
console.log(`=> TỔNG TỶ LỆ ĂN HÀNG ĐƠN VỊ: ${hitDv}/${history.length - 1} (${((hitDv/(history.length-1))*100).toFixed(1)}%)`);
