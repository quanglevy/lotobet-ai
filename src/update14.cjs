const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replace useMemo logic
const oldUseMemoRegex = /\/\/ 2\. HISTORY CHECK \([\s\S]*?return \{ dan2: d2, dan4: d4, dan10: d10, dan20: d20, topSingles: scoredSingles, historyCheck \};/m;

const newUseMemo = `// 2. HISTORY CHECK & HISTORY LIST
    let historyCheck = null;
    let historyList3 = [];

    const getPredictionsForData = (dataToAnalyze, actualDraw) => {
      const hau = actualDraw.Result.substring(3, 5);
      const pStats2D = analyzeUnified2D(dataToAnalyze);
      const pScored2D = calculateCauScore(pStats2D);
      const pD2 = generateReversibleSet(pScored2D, 2);
      const pD4 = generateReversibleSet(pScored2D, 4);
      const pScoredTongs = analyzeTong(dataToAnalyze);
      const pD10 = generateDanByTong(pScoredTongs.slice(0, 1));
      const pD20 = generateDanByTong(pScoredTongs.slice(0, 2));
      const pScoredSingles = analyzeSingleDigits(dataToAnalyze);
      const pCham = pScoredSingles.slice(0, 4).map(s => s.number);
      const p5Tinh = pScoredSingles.slice(0, 5).map(s => s.number);
      return {
        drawId: actualDraw.Draw_ID,
        resultHau: hau,
        fullResult: actualDraw.Result,
        pD2, pD4, pD10, pD20, pCham, p5Tinh
      };
    };

    if (rawData.length >= 2) {
      historyCheck = getPredictionsForData(rawData.slice(1), rawData[0]);
    }

    for (let i = 1; i <= 3; i++) {
      if (rawData.length > i) {
        historyList3.push(getPredictionsForData(rawData.slice(i), rawData[i-1]));
      }
    }

    return { dan2: d2, dan4: d4, dan10: d10, dan20: d20, topSingles: scoredSingles, historyCheck, historyList3 };`;

content = content.replace(oldUseMemoRegex, newUseMemo);

// Pass historyList3 to ExecutiveDashboard component call
content = content.replace(/historyCheck=\{historyCheck\} \/>/g, 'historyCheck={historyCheck} historyList3={historyList3} />');


// Update ExecutiveDashboard signature and render logic
const dashboardSigRegex = /const ExecutiveDashboard = \(\{ data, dan2, dan4, dan10, dan20, topSingles, historyCheck \}\) => \{/;
content = content.replace(dashboardSigRegex, 'const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = [] }) => {');

const columnsEndRegex = /\{\/\* CỘT 3: 10 KỲ QUAY \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};/m;

// Find exactly where the 3 COLUMNS CONTAINER ends. 
// It ends with:
//         </div>
//       </div>
//     </div>
//   );
// };

// We will inject the LỊCH SỬ 3 KỲ QUAY block before the last two </div>

const newSection = `
        {/* CỘT 3: 10 KỲ QUAY */}
        <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: 'black', border: '1px solid #3b82f6', padding: '1rem', width: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
              {data.slice(0, 10).map((draw, idx) => (
                 <div key={draw.Draw_ID || idx} style={{ color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em' }}>
                   Kỳ {draw.Draw_ID ? draw.Draw_ID.slice(-3) : ''}: {draw.Result}
                 </div>
              ))}
              {data.length === 0 && <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Chưa có dữ liệu</div>}
            </div>
          </div>
        </div>

      </div>

      {/* LỊCH SỬ 3 KỲ QUAY (DÀN 10 & 20) */}
      <div style={{ marginTop: '4rem', minWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase' }}>
            LỊCH SỬ DÀN 10 VÀ 20 SỐ (3 KỲ GẦN NHẤT)
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {historyList3.map((hist, idx) => (
                <div key={idx} style={{ padding: '1rem', borderTop: '1px solid #1f2937', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    
                    <div style={{ width: '120px' }}>
                       <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Kỳ {hist.drawId.slice(-3)}</div>
                       <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>{hist.fullResult}</div>
                       <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Đề về: <span style={{ color: '#facc15', fontWeight: 'bold' }}>{hist.resultHau}</span></div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🔥 DÀN 10:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD10, true, hist.resultHau)}
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🔥 DÀN 20:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD20, true, hist.resultHau)}
                          </div>
                       </div>
                    </div>

                </div>
            ))}
         </div>
      </div>

    </div>
  );
};
`;

content = content.replace(columnsEndRegex, newSection);

fs.writeFileSync('src/App.jsx', content, 'utf8');
