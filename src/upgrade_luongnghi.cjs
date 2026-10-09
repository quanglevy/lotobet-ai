const fs = require('fs');
let statCode = fs.readFileSync('src/utils/statistics.js', 'utf8');

// Thêm thuật toán Lưỡng Nghi Phân Cực vào cuối file
const newAlgorithms = `

// ============================================================================
// THUẬT TOÁN LƯỠNG NGHI PHÂN CỰC (TIỀN NHỊ / HẬU NHỊ ĐỘC LẬP)
// ============================================================================

const getBongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);

export const analyzeTienNhi = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    const ascData = [...rawData].reverse();
    const lastDraw = ascData[ascData.length - 1].Result;
    
    // Tiền Nhị (Vạn + Thiên)
    const tienNhi = lastDraw.substring(0, 2);
    const cham1 = tienNhi[0];
    const cham2 = tienNhi[1];
    
    // Bóng Dương của Tiền Nhị
    const bong1 = getBongDuong(cham1);
    const bong2 = getBongDuong(cham2);

    const stats = [];
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, '0');
        let score = 0;
        let reasons = [];
        const d1 = num[0]; const d2 = num[1];
        
        // Cầu Bệt Tiền Nhị
        if (d1 === cham1 || d2 === cham1) { score += 500; reasons.push("Chạm Bệt Tiền 1"); }
        if (d1 === cham2 || d2 === cham2) { score += 400; reasons.push("Chạm Bệt Tiền 2"); }
        
        // Cầu Bóng Tiền Nhị
        if (d1 === bong1 || d2 === bong1) { score += 300; reasons.push("Bóng Tiền 1"); }
        if (d1 === bong2 || d2 === bong2) { score += 200; reasons.push("Bóng Tiền 2"); }
        
        if (d1 === d2) { score += 50; }
        
        stats.push({ number: num, cauScore: score, reasons });
    }
    return stats.sort((a, b) => b.cauScore - a.cauScore);
};

export const analyzeHauNhi = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    const ascData = [...rawData].reverse();
    const lastDraw = ascData[ascData.length - 1].Result;
    
    // Hậu Nhị (Thập + Đơn)
    const hauNhi = lastDraw.substring(3, 5);
    const cham1 = hauNhi[0];
    const cham2 = hauNhi[1];
    
    // Tâm Đề (Bách) - Yếu tố ảnh hưởng mạnh nhất đến Hậu Nhị
    const tamDe = lastDraw[2];
    const bongTamDe = getBongDuong(tamDe);

    const stats = [];
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, '0');
        let score = 0;
        let reasons = [];
        const d1 = num[0]; const d2 = num[1];
        
        // Tâm Đề Gọi Hậu Nhị (Bí quyết casino)
        if (d1 === tamDe || d2 === tamDe) { score += 600; reasons.push("Chạm Tâm Đề"); }
        if (d1 === bongTamDe || d2 === bongTamDe) { score += 450; reasons.push("Bóng Tâm Đề"); }
        
        // Cầu Bệt Hậu Nhị
        if (d1 === cham1 || d2 === cham1) { score += 300; reasons.push("Chạm Bệt Hậu 1"); }
        if (d1 === cham2 || d2 === cham2) { score += 200; reasons.push("Chạm Bệt Hậu 2"); }
        
        if (d1 === d2) { score += 50; }
        
        stats.push({ number: num, cauScore: score, reasons });
    }
    return stats.sort((a, b) => b.cauScore - a.cauScore);
};
`;
fs.writeFileSync('src/utils/statistics.js', statCode + newAlgorithms, 'utf8');

// 2. Cập nhật App.jsx để dùng thuật toán mới
let appCode = fs.readFileSync('src/App.jsx', 'utf8');

appCode = appCode.replace(
    /import \{ analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, \r?\ngenerateReversibleSetFromDan , predictTXCL, checkTXCL \} from "\.\/utils\/statistics";/,
    `import { analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, 
generateReversibleSetFromDan , predictTXCL, checkTXCL, analyzeTienNhi, analyzeHauNhi } from "./utils/statistics";`
);

// Sửa getPredictionsForData
const oldGetPredictions = `const pCauScore = calculateCauScore(pScored2D, pScoredTongs, pScoredSingles, dataSlice);
  
        const pD64 = generateReversibleSet(pCauScore, 64); const pD36 = generateReversibleSetFromDan(pD64, pCauScore, 36); const pD20 = generateReversibleSetFromDan(pD36, pCauScore, 20);
      const pD10 = generateReversibleSetFromDan(pD20, pCauScore, 10);
      const pD4 = generateReversibleSetFromDan(pD10, pCauScore, 4);
      const pD2 = generateReversibleSetFromDan(pD4, pCauScore, 2);`;

const newGetPredictions = `
      // Áp dụng thuật toán Lưỡng Nghi
      const scoreTien = analyzeTienNhi(dataSlice);
      const scoreHau = analyzeHauNhi(dataSlice);
      
      const pTien64 = generateReversibleSet(scoreTien, 64);
      const pTien36 = generateReversibleSetFromDan(pTien64, scoreTien, 36);
      const pTien20 = generateReversibleSetFromDan(pTien36, scoreTien, 20);
      
      const pHau64 = generateReversibleSet(scoreHau, 64);
      const pHau36 = generateReversibleSetFromDan(pHau64, scoreHau, 36);
      const pHau20 = generateReversibleSetFromDan(pHau36, scoreHau, 20);
      
      // Giữ lại dàn chung cho các logic cũ nếu cần
      const pCauScore = calculateCauScore(pScored2D, pScoredTongs, pScoredSingles, dataSlice);
      const pD64 = generateReversibleSet(pCauScore, 64);
      const pD36 = generateReversibleSetFromDan(pD64, pCauScore, 36);
      const pD20 = generateReversibleSetFromDan(pD36, pCauScore, 20);
      const pD10 = generateReversibleSetFromDan(pD20, pCauScore, 10);
      const pD4 = generateReversibleSetFromDan(pD10, pCauScore, 4);
      const pD2 = generateReversibleSetFromDan(pD4, pCauScore, 2);
`;
appCode = appCode.replace(oldGetPredictions, newGetPredictions);

appCode = appCode.replace(
    /pD2, pD4, pD10, pD20, pD36, pD64,/,
    `pD2, pD4, pD10, pD20, pD36, pD64, pTien64, pTien36, pTien20, pHau64, pHau36, pHau20,`
);

// Sửa đoạn gọi ở render chính
const oldRenderCall = `const cauScore = calculateCauScore(scored2D, scoredTongs, scoredSingles, rawData);
    const dan64 = generateReversibleSet(cauScore, 64);
    const dan36 = generateReversibleSetFromDan(dan64, cauScore, 36);
    const dan20 = generateReversibleSetFromDan(dan36, cauScore, 20);
    const dan10 = generateReversibleSetFromDan(dan20, cauScore, 10);
    const dan4 = generateReversibleSetFromDan(dan10, cauScore, 4);
    const dan2 = generateReversibleSetFromDan(dan4, cauScore, 2);`;

const newRenderCall = `const cauScore = calculateCauScore(scored2D, scoredTongs, scoredSingles, rawData);
    const dan64 = generateReversibleSet(cauScore, 64);
    const dan36 = generateReversibleSetFromDan(dan64, cauScore, 36);
    const dan20 = generateReversibleSetFromDan(dan36, cauScore, 20);
    const dan10 = generateReversibleSetFromDan(dan20, cauScore, 10);
    const dan4 = generateReversibleSetFromDan(dan10, cauScore, 4);
    const dan2 = generateReversibleSetFromDan(dan4, cauScore, 2);
    
    const sTien = analyzeTienNhi(rawData);
    const sHau = analyzeHauNhi(rawData);
    const tien64 = generateReversibleSet(sTien, 64);
    const tien36 = generateReversibleSetFromDan(tien64, sTien, 36);
    const tien20 = generateReversibleSetFromDan(tien36, sTien, 20);
    
    const hau64 = generateReversibleSet(sHau, 64);
    const hau36 = generateReversibleSetFromDan(hau64, sHau, 36);
    const hau20 = generateReversibleSetFromDan(hau36, sHau, 20);
`;
appCode = appCode.replace(oldRenderCall, newRenderCall);

// Cập nhật ExecutiveDashboard props
appCode = appCode.replace(
    /const ExecutiveDashboard = \(\{ data, dan2, dan4, dan10, dan20, dan36, dan64, topSingles, historyCheck, historyList3 = \[\], txcl, \r?\nhandleCopy, handleDeleteResult \}\) => \{/,
    `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, dan36, dan64, tien64, tien36, tien20, hau64, hau36, hau20, topSingles, historyCheck, historyList3 = [], txcl, handleCopy, handleDeleteResult }) => {`
);

appCode = appCode.replace(
    /<ExecutiveDashboard data=\{rawData\} dan2=\{dan2\} dan4=\{dan4\} dan10=\{dan10\} \r?\ndan20=\{dan20\} dan36=\{dan36\} dan64=\{dan64\}/,
    `<ExecutiveDashboard data={rawData} dan2={dan2} dan4={dan4} dan10={dan10} dan20={dan20} dan36={dan36} dan64={dan64} tien64={tien64} tien36={tien36} tien20={tien20} hau64={hau64} hau36={hau36} hau20={hau20}`
);

// Sửa giao diện ExecutiveDashboard (Thay thế cụm Dàn 36 và 64 bằng phân cực Tiền / Hậu)
const oldUI = `                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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

const newUI = `                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '10px', borderTop: '1px solid #334155', paddingTop: '10px' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#3b82f6' }}>⚔️</span> TIỀN NHỊ (ĐẦU) - 36 SỐ</div>
                  <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Phân tích độc lập Đầu Đề</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {renderBalls(historyCheck.pTien36, true, null, historyCheck.resultTien)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#ef4444' }}>🎯</span> HẬU NHỊ (ĐUÔI) - 36 SỐ</div>
                  <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Phân tích độc lập Đuôi Đề</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {renderBalls(historyCheck.pHau36, true, historyCheck.resultHau, null)}
                  </div>
                </div>`;
                
appCode = appCode.replace(oldUI, newUI);

// Sửa phần hiển thị dàn chính (bên trái)
const oldMainUI = `<div style={{ marginBottom: '24px' }}>
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
            </div>`;

const newMainUI = `<div style={{ marginBottom: '24px', borderTop: '2px dashed #3b82f6', paddingTop: '16px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <span style={{ color: '#3b82f6' }}>⚔️</span> DÀN TIỀN NHỊ (36 SỐ)
              </div>
              <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '8px' }}>Lưỡng Nghi: Bắt độc lập Đầu Đề</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderBalls(tien36, true)}
              </div>
              {renderCopyButton(tien36, "Tiền Nhị 36 Số")}
            </div>

            <div style={{ marginBottom: '24px', borderTop: '2px dashed #ef4444', paddingTop: '16px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <span style={{ color: '#ef4444' }}>🎯</span> DÀN HẬU NHỊ (36 SỐ)
              </div>
              <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '8px' }}>Lưỡng Nghi: Bắt độc lập Đuôi Đề</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderBalls(hau36, true)}
              </div>
              {renderCopyButton(hau36, "Hậu Nhị 36 Số")}
            </div>`;

appCode = appCode.replace(oldMainUI, newMainUI);

fs.writeFileSync('src/App.jsx', appCode, 'utf8');
console.log('Successfully applied Luong Nghi Phan Cuc (Dual-Pole Separation) Algorithm!');
