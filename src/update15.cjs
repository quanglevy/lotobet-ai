const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix ExecutiveDashboard signature
content = content.replace(
  /const ExecutiveDashboard = \(\{ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = \[\] \}\) => \{/,
  'const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = [], handleCopy }) => {\n\n    const renderCopyButton = (balls, label) => (\n      <button \n        onClick={() => handleCopy(balls, label)}\n        style={{ \n          display: "flex", alignItems: "center", gap: "4px", \n          backgroundColor: "#1f2937", color: "#9ca3af", \n          border: "none", borderRadius: "4px", padding: "2px 8px", \n          fontSize: "10px", cursor: "pointer", marginTop: "4px", width: "fit-content" \n        }}\n      >\n        <Copy size={12} /> COPY\n      </button>\n    );'
);

// 2. Add copy buttons to Column 1 (DỰ ĐOÁN KỲ TỚI)
content = content.replace(
  /(\{renderBalls\(dan2\)\}\s*<\/div>)/g,
  '$1\n              {renderCopyButton(dan2, "Hạ Dàn 2 Số")}'
);
content = content.replace(
  /(\{renderBalls\(dan4\)\}\s*<\/div>)/g,
  '$1\n              {renderCopyButton(dan4, "Hạ Dàn 4 Số")}'
);
content = content.replace(
  /(\{renderBalls\(dan10\)\}\s*<\/div>)/g,
  '$1\n              {renderCopyButton(dan10, "Dàn 10 Số")}'
);
content = content.replace(
  /(\{renderBalls\(dan20\)\}\s*<\/div>)/g,
  '$1\n              {renderCopyButton(dan20, "Dàn 20 Số")}'
);

// 3. Add copy buttons to Column 2 (KẾT QUẢ KỲ VỪA XONG)
content = content.replace(
  /(\{renderBalls\(historyCheck\.pD2, true, historyCheck\.resultHau\)\}\s*<\/div>)/g,
  '$1\n                  {renderCopyButton(historyCheck.pD2, "Hạ Dàn 2 Số (Kỳ Trước)")}'
);
content = content.replace(
  /(\{renderBalls\(historyCheck\.pD4, true, historyCheck\.resultHau\)\}\s*<\/div>)/g,
  '$1\n                  {renderCopyButton(historyCheck.pD4, "Hạ Dàn 4 Số (Kỳ Trước)")}'
);
content = content.replace(
  /(\{renderBalls\(historyCheck\.pD10, true, historyCheck\.resultHau\)\}\s*<\/div>)/g,
  '$1\n                  {renderCopyButton(historyCheck.pD10, "Dàn 10 Số (Kỳ Trước)")}'
);
content = content.replace(
  /(\{renderBalls\(historyCheck\.pD20, true, historyCheck\.resultHau\)\}\s*<\/div>)/g,
  '$1\n                  {renderCopyButton(historyCheck.pD20, "Dàn 20 Số (Kỳ Trước)")}'
);

// 4. Add copy buttons to Column 3 (LỊCH SỬ 3 KỲ QUAY)
content = content.replace(
  /(\{renderBalls\(hist\.pD10, true, hist\.resultHau\)\}\s*<\/div>)/g,
  '$1\n                             {renderCopyButton(hist.pD10, `Dàn 10 Số (Kỳ ${hist.drawId.slice(-3)})`)}'
);
content = content.replace(
  /(\{renderBalls\(hist\.pD20, true, hist\.resultHau\)\}\s*<\/div>)/g,
  '$1\n                             {renderCopyButton(hist.pD20, `Dàn 20 Số (Kỳ ${hist.drawId.slice(-3)})`)}'
);

fs.writeFileSync('src/App.jsx', content, 'utf8');
