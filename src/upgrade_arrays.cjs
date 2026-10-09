const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add dan36 and dan64 to ExecutiveDashboard props
code = code.replace(
    /const ExecutiveDashboard = \({ data, dan2, dan4, dan10, dan20,/g,
    'const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, dan36, dan64,'
);

// 2. Add UI for DÀN 36 and DÀN 64
const dan20UI = `
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <span style={{ color: '#ef4444' }}>🔥</span> DÀN 20 SỐ 2D
              </div>
              <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>An toàn cao</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderBalls(dan20, true)}
              </div>
              {renderCopyButton(dan20, "Dàn 20 Số")}
            </div>
`;

const dan3664UI = `
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <span style={{ color: '#10b981' }}>🛡️</span> DÀN 36 SỐ 2D
              </div>
              <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Tỷ lệ thắng 36% (Đánh đều tay)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderBalls(dan36, true)}
              </div>
              {renderCopyButton(dan36, "Dàn 36 Số")}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <span style={{ color: '#8b5cf6' }}>💎</span> DÀN 64 SỐ 2D
              </div>
              <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Tỷ lệ thắng 64% (Bất bại rỉa máu)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderBalls(dan64, true)}
              </div>
              {renderCopyButton(dan64, "Dàn 64 Số")}
            </div>
`;

code = code.replace(
    /<div style=\{\{ color: '#ef4444' \}\}>🔥<\/span> DÀN 20 SỐ 2D[\s\S]*?\{renderCopyButton\(dan20, "Dan 20 S\?"\)\}\s*<\/div>/,
    dan20UI + dan3664UI
);

// Fallback if the regex doesn't match perfectly due to accents/encoding:
code = code.replace(
    /\{renderCopyButton\(dan20, "Dan 20 S\?"\)\}\s*<\/div>/,
    `{renderCopyButton(dan20, "Dàn 20 Số")}
            </div>
` + dan3664UI
);

// 3. Define dan36 and dan64 in App component
code = code.replace(
    /const dan20 = generateReversibleSet\(cauScore, 20\);/,
    `const dan64 = generateReversibleSet(cauScore, 64);
    const dan36 = generateReversibleSetFromDan(dan64, cauScore, 36);
    const dan20 = generateReversibleSetFromDan(dan36, cauScore, 20);`
);

// 4. Pass dan36 and dan64 to ExecutiveDashboard
code = code.replace(
    /<ExecutiveDashboard data=\{rawData\} dan2=\{dan2\} dan4=\{dan4\} dan10=\{dan10\} dan20=\{dan20\}/g,
    '<ExecutiveDashboard data={rawData} dan2={dan2} dan4={dan4} dan10={dan10} dan20={dan20} dan36={dan36} dan64={dan64}'
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Successfully upgraded UI with Dàn 36 and Dàn 64!');
