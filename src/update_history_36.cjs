const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace DÀN 20 with DÀN 36 in the history list (data.slice(0, 10))
const oldListHTML = `<span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🛡️ DÀN 20:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD20, true, hist.resultHau, hist.resultTien)}
                          </div>
                          {renderCopyButton(hist.pD20, \`Dan 20 S? (K? \${hist.drawId.slice(-3)})\`)}`;

const newListHTML = `<span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🛡️ DÀN 36:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD36, true, hist.resultHau, hist.resultTien)}
                          </div>
                          {renderCopyButton(hist.pD36, \`Dàn 36 Số (Kỳ \${hist.drawId.slice(-3)})\`)}`;

// Regex based replacement due to potential whitespace or encoding variations
code = code.replace(/<span.*?DAN 20:[\s\S]*?\{renderBalls\(hist\.pD20[\s\S]*?\{renderCopyButton\(hist\.pD20, .*?\)\}/m, newListHTML);
code = code.replace(/<span.*?DÀN 20:[\s\S]*?\{renderBalls\(hist\.pD20[\s\S]*?\{renderCopyButton\(hist\.pD20, .*?\)\}/m, newListHTML);

// Since I fixed "DAN" to "DÀN" and "S?" to "SỐ", I'll also double check the DÀN 10 copy string
code = code.replace(/Dan 10 S\? \(K\?/g, 'Dàn 10 Số (Kỳ');
code = code.replace(/Dan 20 S\? \(K\?/g, 'Dàn 20 Số (Kỳ');

// Make sure the unified UI is clean
// We want to completely remove analyzeTienNhi and analyzeHauNhi from App.jsx so it only uses calculateCauScore
code = code.replace(/const scoreTien = analyzeTienNhi\(dataSlice\);[\s\S]*?const pHau20 = generateReversibleSetFromDan\(pHau36, scoreHau, 20\);/m, '');

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Successfully updated History List to Dàn 36!');
