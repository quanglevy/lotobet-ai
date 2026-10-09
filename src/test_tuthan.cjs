const history = [
  "93169", // 0 -> Hau: 69
  "35080", // 1 -> Hau: 80
  "43084", // 2 -> Hau: 84
  "82448", // 3 -> Hau: 48
  "64866", // 4 -> Hau: 66
  "79953", // 5 -> Hau: 53
  "53508", // 6 -> Hau: 08
  "39241", // 7 -> Hau: 41
  "39241", // 8 -> Hau: 41
  "21094"  // 9 -> Hau: 94
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

// THUẬT TOÁN TỬ THẦN 2026: QUÉT TOÀN DIỆN VỊ TRÍ HẬU NHỊ
function getLoai3SoTuThan(historySlice) {
  const lastDraw = historySlice[historySlice.length - 1];
  const d = lastDraw.split('');
  const lastHau = [d[3], d[4]];
  const lastTien = [d[0], d[1]];

  // Điểm TỬ THẦN (Càng cao thì CÀNG CHẮC CHẮN KHÔNG VỀ -> NÊN LOẠI)
  const deadScores = {};
  for (let i = 0; i < 10; i++) deadScores[i.toString()] = 0;

  // 1. CÁC SỐ BẢO VỆ TUYỆT ĐỐI (Điểm tử thần âm cực lớn -> KHÔNG BAO GIỜ BỊ LOẠI)
  const protectList = new Set();

  // - Bộ số trả nhau Hàng Trăm & Đơn Vị (Bạc nhớ Kubet)
  protectList.add(BO_TRA_NHAU[d[2]]);
  protectList.add(BO_TRA_NHAU[d[4]]);
  protectList.add(BO_TRA_NHAU[d[3]]);

  // - Cầu Pascal Đỉnh & Bóng
  const p = getPascalPeak(lastDraw);
  protectList.add(p);
  protectList.add(getBongDuong(p));

  // - Lô rơi từ Hàng Trăm và 2 số Hậu Nhị
  protectList.add(d[2]); // Tâm càng
  protectList.add(d[3]); // Hàng chục
  protectList.add(d[4]); // Hàng đơn vị

  // - Bóng dương của Hậu Nhị
  protectList.add(getBongDuong(d[3]));
  protectList.add(getBongDuong(d[4]));

  // - Tổng đối xứng
  protectList.add(((parseInt(d[0]) + parseInt(d[4])) % 10).toString());
  protectList.add(((parseInt(d[1]) + parseInt(d[3])) % 10).toString());

  // Đánh dấu bảo vệ
  protectList.forEach(num => {
    if (deadScores[num] !== undefined) deadScores[num] -= 1000;
  });

  // 2. TÌM CÁC CON SỐ CÓ XÁC SUẤT CHẾT CAO NHẤT (CỘNG ĐIỂM TỬ THẦN)
  
  // (A) Số quá tải năng lượng (Burnout): Đã nổ liên tiếp >= 3 lần trong 2 kỳ gần nhất
  const countInLast2 = {};
  for (let i = 0; i < 10; i++) countInLast2[i.toString()] = 0;
  const last2Slice = historySlice.slice(-2);
  last2Slice.forEach(drawStr => {
    for (const c of drawStr) countInLast2[c]++;
  });
  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    if (countInLast2[s] >= 3 && !protectList.has(s)) {
      deadScores[s] += 80; // Quá tải -> Cực kỳ khó về tiếp ở Hậu Nhị
    }
  }

  // (B) Số Lệch Cầu Hoàn Toàn (Zero Connection): Không liên kết với 5 số của kỳ vừa rồi
  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    const isInDraw = d.includes(s);
    const isTraNhau = d.some(c => BO_TRA_NHAU[c] === s);
    const isBong = d.some(c => getBongDuong(c) === s || getBongAm(c) === s);
    if (!isInDraw && !isTraNhau && !isBong) {
      deadScores[s] += 120; // Số hoàn toàn cô lập -> Xác suất chết cực cao!
    }
  }

  // (C) Số Ngủ Đông Sâu (Deep Gan): Không xuất hiện ở Hậu Nhị trong 5 kỳ và không có cầu báo
  const recent5 = historySlice.slice(-5);
  const hauFreq5 = {};
  for (let i = 0; i < 10; i++) hauFreq5[i.toString()] = 0;
  recent5.forEach(r => {
    hauFreq5[r[3]]++; hauFreq5[r[4]]++;
  });
  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    if (hauFreq5[s] === 0 && !protectList.has(s)) {
      deadScores[s] += 90;
    }
  }

  // Sắp xếp theo ĐIỂM TỬ THẦN GIẢM DẦN (Điểm cao nhất = Chắc chắn chết nhất = LOẠI ĐẦU TIÊN)
  const sortedDead = Object.keys(deadScores).sort((a, b) => deadScores[b] - deadScores[a]);

  const loai3 = sortedDead.slice(0, 3).sort((a, b) => a - b);
  const giu7 = sortedDead.slice(3).sort((a, b) => a - b);

  const loai4 = sortedDead.slice(0, 4).sort((a, b) => a - b);
  const giu6 = sortedDead.slice(4).sort((a, b) => a - b);

  return { loai3, giu7, loai4, giu6, deadScores };
}

console.log("=== KIỂM THỬ THUẬT TOÁN TỬ THẦN 2026 TRÊN 10 KỲ THỰC TẾ ===");
let hit3 = 0;
let hit4 = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7, loai4, giu6 } = getLoai3SoTuThan(past);

  const isWin3 = giu7.includes(actualHau[0]) && giu7.includes(actualHau[1]);
  const isWin4 = giu6.includes(actualHau[0]) && giu6.includes(actualHau[1]);

  if (isWin3) hit3++;
  if (isWin4) hit4++;

  console.log(`Kỳ ${i} (${nextDraw}) - Hậu Nhị về: [${actualHau}]`);
  console.log(`   - Kèo Loại 3: ❌ Bỏ [${loai3.join(', ')}] 👉 ✅ Đánh 7 số [${giu7.join(', ')}] : ${isWin3 ? '🎯 ĂN (TRÚNG)' : '❌ TRƯỢT'}`);
  console.log(`   - Kèo Loại 4: ❌ Bỏ [${loai4.join(', ')}] 👉 ✅ Đánh 6 số [${giu6.join(', ')}] : ${isWin4 ? '🎯 ĂN (TRÚNG)' : '❌ TRƯỢT'}\n`);
}
console.log(`=> TỔNG TỶ LỆ TRÚNG LOẠI 3 SỐ: ${hit3}/${history.length - 1} (${((hit3/(history.length-1))*100).toFixed(1)}%)`);
console.log(`=> TỔNG TỶ LỆ TRÚNG LOẠI 4 SỐ: ${hit4}/${history.length - 1} (${((hit4/(history.length-1))*100).toFixed(1)}%)`);
