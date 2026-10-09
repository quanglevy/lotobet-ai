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

// BỘ DÒ CẦU LOẠI SIÊU CHUẨN (ELIMINATION OPTIMIZER)
// Tìm 3 con số mà xác suất về Hậu Nhị là THẤP NHẤT
function findBestDeadDigits(historySlice) {
  const lastDraw = historySlice[historySlice.length - 1];
  const d = lastDraw.split('');
  
  // 1. CÁC SỐ CHẮC CHẮN NỔ Ở HẬU NHỊ (KHÔNG BAO GIỜ ĐƯỢC LOẠI):
  // - Số vừa ra ở Hậu Nhị (bệt Hậu)
  // - Số Hàng Trăm và Đơn Vị trả nhau
  // - Số Pascal Đỉnh
  // - Số Bóng Dương của Hậu Nhị
  const mustKeep = new Set();
  mustKeep.add(d[3]);
  mustKeep.add(d[4]);
  mustKeep.add(d[2]);
  mustKeep.add(BO_TRA_NHAU[d[2]]);
  mustKeep.add(BO_TRA_NHAU[d[4]]);
  mustKeep.add(getPascalPeak(lastDraw));
  mustKeep.add(getBongDuong(d[3]));
  mustKeep.add(getBongDuong(d[4]));

  // 2. TẤT CẢ CÁC SỐ CÒN LẠI TRONG 10 SỐ (0-9)
  const candidateDead = [];
  for (let i = 0; i < 10; i++) {
    const s = i.toString();
    if (!mustKeep.has(s)) {
      candidateDead.push(s);
    }
  }

  // 3. XẾP HẠNG CÁC SỐ ỨNG VIÊN TỬ THẦN
  // Số nào càng ít xuất hiện ở toàn bộ 5 vị trí trong 4 kỳ gần nhất thì càng NÊN LOẠI
  const window4 = Math.min(4, historySlice.length);
  const recent4 = historySlice.slice(-window4);
  const freqMap = {};
  for (let i = 0; i < 10; i++) freqMap[i.toString()] = 0;
  recent4.forEach(draw => {
    for (const c of draw) freqMap[c]++;
  });

  candidateDead.sort((a, b) => freqMap[a] - freqMap[b]);

  // Lấy 3 số có tần suất thấp nhất trong nhóm candidateDead
  let loai3 = candidateDead.slice(0, 3);
  // Nếu candidateDead ít hơn 3 số, lấy thêm các số có tần suất thấp nhất trong 10 số
  if (loai3.length < 3) {
    const allSorted = Object.keys(freqMap).filter(n => !loai3.includes(n)).sort((a, b) => freqMap[a] - freqMap[b]);
    while (loai3.length < 3) {
      loai3.push(allSorted.shift());
    }
  }

  loai3 = loai3.sort((a, b) => a - b);
  const giu7 = Object.keys(freqMap).filter(n => !loai3.includes(n)).sort((a, b) => a - b);

  let loai4 = candidateDead.slice(0, 4);
  if (loai4.length < 4) {
    const allSorted4 = Object.keys(freqMap).filter(n => !loai4.includes(n)).sort((a, b) => freqMap[a] - freqMap[b]);
    while (loai4.length < 4) {
      loai4.push(allSorted4.shift());
    }
  }
  loai4 = loai4.sort((a, b) => a - b);
  const giu6 = Object.keys(freqMap).filter(n => !loai4.includes(n)).sort((a, b) => a - b);

  return { loai3, giu7, loai4, giu6 };
}

console.log("=== KIỂM THỬ BỘ DÒ CẦU LOẠI MUST-KEEP MỚI ===");
let win3 = 0;
let win4 = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const nextDraw = history[i];
  const actualHau = nextDraw.substring(3, 5);
  const { loai3, giu7, loai4, giu6 } = findBestDeadDigits(past);

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
