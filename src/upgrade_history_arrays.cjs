const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const pD20BlockRegex = /(<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '0\.25rem' \}\}>\s*<div.*?DÀN 20 SỐ 2D<\/div>\s*<div.*?>.*?<\/div>\s*<div style=\{\{ display: 'flex', flexWrap: 'wrap' \}\}>\s*\{renderBalls\(historyCheck\.pD20, true, historyCheck\.resultHau, historyCheck\.resultTien\)\}\s*<\/div>\s*<\/div>)/;

// Because of possible encoding issues with accents, let's use a safer replacement strategy based on indexOf.

const findStr = "{renderBalls(historyCheck.pD20, true, historyCheck.resultHau, historyCheck.resultTien)}\n                  </div>\n                </div>";

const replacementStr = `{renderBalls(historyCheck.pD20, true, historyCheck.resultHau, historyCheck.resultTien)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>🛡️</span> DÀN 36 SỐ 2D</div>
                  <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Tỷ lệ thắng 36%</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {renderBalls(historyCheck.pD36, true, historyCheck.resultHau, historyCheck.resultTien)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#8b5cf6' }}>💎</span> DÀN 64 SỐ 2D</div>
                  <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Tỷ lệ thắng 64%</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {renderBalls(historyCheck.pD64, true, historyCheck.resultHau, historyCheck.resultTien)}
                  </div>
                </div>`;

if (code.includes(findStr)) {
    code = code.replace(findStr, replacementStr);
    fs.writeFileSync('src/App.jsx', code, 'utf8');
    console.log('Successfully updated historyCheck UI!');
} else {
    console.log('Could not find the target string. Using regex fallback...');
    // regex fallback
    const fallbackRegex = /\{renderBalls\(historyCheck\.pD20,\s*true,\s*historyCheck\.resultHau,\s*historyCheck\.resultTien\)\}\s*<\/div>\s*<\/div>/;
    code = code.replace(fallbackRegex, replacementStr);
    fs.writeFileSync('src/App.jsx', code, 'utf8');
    console.log('Successfully updated historyCheck UI with regex fallback!');
}
