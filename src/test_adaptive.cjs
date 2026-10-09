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
  return {
    "Bạc Nhớ Đối Ứng": [BO_TRA_NHAU[d[2].toString()], BO_TRA_NHAU[d[4].toString()]],
    "Pascal Ma Trận": [getPascalPeak(draw), getBongDuong(getPascalPeak(draw))],
    "Bệt Rơi Tâm Càng": [d[2].toString(), d[4].toString()],
    "Tổng Đối Xứng": [((d[0] + d[4]) % 10).toString(), ((d[1] + d[3]) % 10).toString()],
    "Bóng Dương Tâm": [getBongDuong(d[0].toString()), getBongDuong(d[2].toString())]
  };
}

function predictAdaptive3So5Tinh(historySlice) {
  const lastDraw = historySlice[historySlice.length - 1];
  const lastBridges = getBridges(lastDraw);

  if (historySlice.length < 2) {
    const d3 = [...new Set([...lastBridges["Bạc Nhớ Đối Ứng"], ...lastBridges["Pascal Ma Trận"]])].slice(0, 3);
    return { dan3: d3, dan4: d3, dan5: d3, topBridge: "Khởi tạo" };
  }

  // Backtest 4 kỳ gần nhất để xếp hạng cầu đang ăn thông
  const bridgeScores = { "Bạc Nhớ Đối Ứng": 0, "Pascal Ma Trận": 0, "Bệt Rơi Tâm Càng": 0, "Tổng Đối Xứng": 0, "Bóng Dương Tâm": 0 };
  const checkWindow = Math.min(4, historySlice.length - 1);
  const startIdx = historySlice.length - 1 - checkWindow;

  for (let i = startIdx; i < historySlice.length - 1; i++) {
    const curr = historySlice[i];
    const next = historySlice[i+1];
    const bridges = getBridges(curr);
    
    // Kỳ càng gần thì trọng số ăn thông càng cao
    const weight = (i - startIdx + 1) * 3;
    
    for (const [name, nums] of Object.entries(bridges)) {
      if (nums.some(n => next.includes(n))) {
        bridgeScores[name] += weight;
      }
    }
  }

  // Sắp xếp các cầu đang ăn thông mạnh nhất
  const sortedBridges = Object.keys(bridgeScores).sort((a, b) => bridgeScores[b] - bridgeScores[a]);

  const digitPoints = {};
  for (let i = 0; i < 10; i++) digitPoints[i.toString()] = 0;

  sortedBridges.forEach((bName, rank) => {
    const pts = (5 - rank) * 15;
    lastBridges[bName].forEach(num => {
      digitPoints[num] += pts;
    });
  });

  const sortedDigits = Object.keys(digitPoints).sort((a, b) => digitPoints[b] - digitPoints[a]);
  const dan3 = sortedDigits.slice(0, 3);
  const dan4 = sortedDigits.slice(0, 4);
  const dan5 = sortedDigits.slice(0, 5);

  return {
    dan3, dan4, dan5,
    topBridge: sortedBridges[0],
    scores: bridgeScores
  };
}

console.log("=== KIỂM THỬ THUẬT TOÁN ĐA CẦU TỰ THÍCH ỨNG (ADAPTIVE 3 SỐ 5 TINH) ===");
let totalHits = 0;
for (let i = 1; i < history.length; i++) {
  const past = history.slice(0, i);
  const actual = history[i];
  const pred = predictAdaptive3So5Tinh(past);
  const isHit = pred.dan3.some(n => actual.includes(n));
  if (isHit) totalHits++;
  const hitDigits = pred.dan3.filter(n => actual.includes(n));
  console.log(`Kỳ ${i} (${actual}) - Dự đoán Dàn 3 [${pred.dan3.join(',')}]: ${isHit ? '✅ TRÚNG (' + hitDigits.join(',') + ')' : '❌ TRƯỢT'} (Cầu chủ đạo: ${pred.topBridge})`);
}
console.log(`\n=> TỔNG TỶ LỆ TRÚNG DÀN 3 SỐ: ${totalHits}/${history.length - 1} (${((totalHits/(history.length - 1))*100).toFixed(1)}%)`);
