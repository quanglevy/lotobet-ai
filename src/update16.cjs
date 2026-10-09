const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update getPredictionsForData to include resultTien
const oldGetPredictionsRegex = /const getPredictionsForData = \(dataToAnalyze, actualDraw\) => \{\s*const hau = actualDraw\.Result\.substring\(3, 5\);/m;
const newGetPredictions = `const getPredictionsForData = (dataToAnalyze, actualDraw) => {
      const hau = actualDraw.Result.substring(3, 5);
      const tien = actualDraw.Result.substring(0, 2);`;
content = content.replace(oldGetPredictionsRegex, newGetPredictions);

const oldReturnPredictionsRegex = /resultHau: hau,\s*fullResult: actualDraw\.Result,/m;
const newReturnPredictions = `resultHau: hau,
        resultTien: tien,
        fullResult: actualDraw.Result,`;
content = content.replace(oldReturnPredictionsRegex, newReturnPredictions);

// 2. Update renderBalls signature and isWinner logic
const oldRenderBallsRegex = /const renderBalls = \(balls, isHistory = false, resultHau = null\) => \{\s*return balls\.map\(s => \{\s*const num = typeof s === 'object' \? s\.number : s;\s*const isWinner = isHistory && resultHau && num === resultHau;/m;
const newRenderBalls = `const renderBalls = (balls, isHistory = false, resultHau = null, resultTien = null) => {
      return balls.map(s => {
        const num = typeof s === 'object' ? s.number : s;
        const isWinner = isHistory && (num === resultHau || num === resultTien);`;
content = content.replace(oldRenderBallsRegex, newRenderBalls);

// 3. Update all renderBalls calls in ExecutiveDashboard to pass resultTien
// KẾT QUẢ KỲ QUAY VỪA XONG
content = content.replace(
  /renderBalls\(historyCheck\.pD2, true, historyCheck\.resultHau\)/g,
  'renderBalls(historyCheck.pD2, true, historyCheck.resultHau, historyCheck.resultTien)'
);
content = content.replace(
  /renderBalls\(historyCheck\.pD4, true, historyCheck\.resultHau\)/g,
  'renderBalls(historyCheck.pD4, true, historyCheck.resultHau, historyCheck.resultTien)'
);
content = content.replace(
  /renderBalls\(historyCheck\.pD10, true, historyCheck\.resultHau\)/g,
  'renderBalls(historyCheck.pD10, true, historyCheck.resultHau, historyCheck.resultTien)'
);
content = content.replace(
  /renderBalls\(historyCheck\.pD20, true, historyCheck\.resultHau\)/g,
  'renderBalls(historyCheck.pD20, true, historyCheck.resultHau, historyCheck.resultTien)'
);

// LỊCH SỬ 3 KỲ QUAY
content = content.replace(
  /renderBalls\(hist\.pD10, true, hist\.resultHau\)/g,
  'renderBalls(hist.pD10, true, hist.resultHau, hist.resultTien)'
);
content = content.replace(
  /renderBalls\(hist\.pD20, true, hist\.resultHau\)/g,
  'renderBalls(hist.pD20, true, hist.resultHau, hist.resultTien)'
);

// 4. Update the display text in LỊCH SỬ 3 KỲ QUAY
content = content.replace(
  /Đề về: <span style=\{\{ color: '#facc15', fontWeight: 'bold' \}\}>\{hist\.resultHau\}<\/span>/g,
  'Đề về: <span style={{ color: "#facc15", fontWeight: "bold" }}>{hist.resultTien} và {hist.resultHau}</span>'
);

fs.writeFileSync('src/App.jsx', content, 'utf8');
