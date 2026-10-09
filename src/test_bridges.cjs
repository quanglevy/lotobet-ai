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

function getBridges(draw) {
  const d = draw.split('').map(Number);
  // 1. Cầu Bạc Nhớ Đối Ứng (Hàng trăm + Đơn vị)
  const b1 = [BO_TRA_NHAU[d[2].toString()], BO_TRA_NHAU[d[4].toString()]];
  
  // 2. Cầu Pascal Đỉnh Ma Trận
  const pPeak = getPascalPeak(draw);
  const b2 = [pPeak, getBongDuong(pPeak)];

  // 3. Cầu Bệt Rơi Tâm Càng & Đơn Vị
  const b3 = [d[2].toString(), d[4].toString()];

  // 4. Cầu Tổng Đối Xứng (Vạn + Đơn vị, Ngàn + Chục)
  const b4 = [((d[0] + d[4]) % 10).toString(), ((d[1] + d[3]) % 10).toString()];

  // 5. Cầu Bóng Dương Tâm & Đầu
  const b5 = [getBongDuong(d[0].toString()), getBongDuong(d[2].toString())];

  return {
    "Bạc Nhớ Đối Ứng": b1,
    "Pascal Đỉnh Ma Trận": b2,
    "Bệt Rơi Tâm Càng": b3,
    "Tổng Đối Xứng": b4,
    "Bóng Dương Cực Đại": b5
  };
}

console.log("=== BACKTEST CÁC CẦU 3 SỐ 5 TINH TRÊN 10 KỲ THỰC TẾ ===");
for (let i = 0; i < history.length - 1; i++) {
  const curr = history[i];
  const next = history[i+1];
  const bridges = getBridges(curr);
  console.log(`\nKỳ ${i} (${curr}) -> Kỳ ${i+1} (${next}):`);
  for (const [name, nums] of Object.entries(bridges)) {
    const hit = nums.filter(n => next.includes(n));
    console.log(`  - ${name} [${nums.join(',')}]: ${hit.length > 0 ? 'TRÚNG (' + hit.join(',') + ')' : 'Trượt'}`);
  }
}
