const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// --- 1. REVERT UI LAYOUT ---
// In getPredictionsForData, replace pTien36 etc. back to standard pD36, pD64
code = code.replace(/const scoreTien = analyzeTienNhi\(dataSlice\);[\s\S]*?const pHau20 = generateReversibleSetFromDan\(pHau36, scoreHau, 20\);/, '');

// Restore return statement in getPredictionsForData
code = code.replace(/pD2, pD4, pD10, pD20, pD36, pD64, pTien64, pTien36, pTien20, pHau64, pHau36, pHau20,/, 'pD2, pD4, pD10, pD20, pD36, pD64,');

// Restore main render calls
code = code.replace(/const sTien = analyzeTienNhi\(rawData\);[\s\S]*?const hau20 = generateReversibleSetFromDan\(hau36, sHau, 20\);/, '');

// Restore ExecutiveDashboard props
code = code.replace(/tien64=\{tien64\} tien36=\{tien36\} tien20=\{tien20\} hau64=\{hau64\} hau36=\{hau36\} hau20=\{hau20\}/g, '');
code = code.replace(/tien64, tien36, tien20, hau64, hau36, hau20, /g, '');

// Revert Main UI (Left Side)
const badMainUI = /<div style=\{\{ marginBottom: '24px', borderTop: '2px dashed #3b82f6', paddingTop: '16px' \}\}>[\s\S]*?\{renderCopyButton\(hau36, "Hậu Nhị 36 Số"\)\}\s*<\/div>/;
const goodMainUI = `<div style={{ marginBottom: '24px' }}>
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
code = code.replace(badMainUI, goodMainUI);

// Revert History UI (Right Side - single view)
const badHistoryUI = /<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '0\.25rem', marginTop: '10px', borderTop: '1px solid #334155', paddingTop: '10px' \}\}>[\s\S]*?\{renderBalls\(historyCheck\.pHau36, true, historyCheck\.resultHau, null\)\}\s*<\/div>\s*<\/div>/;
const goodHistoryUI = `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
code = code.replace(badHistoryUI, goodHistoryUI);

// Revert History UI (Right Side - multi view)
// I need to check if there's corrupted pTien36 in the 10 kỳ quay list too, but it seems I didn't change that part.

// --- 2. FIX CORRUPTED TEXT ---
code = code.replace(/U 3 S\? 5 TINH \(ϡANH S\? ϡ\?N\)/g, 'CẦU 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)');
code = code.replace(/DAN 3 S\?/g, 'DÀN 3 SỐ');
code = code.replace(/DAN 4 S\?/g, 'DÀN 4 SỐ');
code = code.replace(/DAN 5 S\?/g, 'DÀN 5 SỐ');
code = code.replace(/T\?I X\?U - CH\?N L\? \(T\?NG 5 S\?\)/g, 'TÀI XỈU - CHẴN LẺ (TỔNG 5 SỐ)');
code = code.replace(/T\?ng 5 s\?:/g, 'Tổng 5 số:');
code = code.replace(/X\?U \?/g, 'XỈU');
code = code.replace(/CH\?N \?/g, 'CHẴN');
code = code.replace(/ϡ? v\?:/g, 'Đã về:');
code = code.replace(/va/g, 'và');
code = code.replace(/K\?/g, 'Kỳ');
code = code.replace(/DAN 10:/g, 'DÀN 10:');
code = code.replace(/DAN 20:/g, 'DÀN 20:');
code = code.replace(/DAN 36:/g, 'DÀN 36:');
code = code.replace(/DAN 64:/g, 'DÀN 64:');
code = code.replace(/Sieu n\?/g, 'Siêu nổ');
code = code.replace(/c\?p lot/g, 'cặp lót');
code = code.replace(/ϡ?t pha/g, 'Đột phá');
code = code.replace(/Can b\?ng v\?n/g, 'Cân bằng vốn');
code = code.replace(/An toan cao/g, 'An toàn cao');
code = code.replace(/Ch\?a co d\? li\?u/g, 'Chưa có dữ liệu');
code = code.replace(/ϡi chi\?u/g, 'đối chiếu');
code = code.replace(/tr\?\?c/g, 'trước');
code = code.replace(/Xoa k\? nay/g, 'Xóa kỳ này');
code = code.replace(/B\?ng Ch\?t S\?/g, 'Bảng Chốt Số');
code = code.replace(/C\? Ch\? B\?t C\?u/g, 'Cơ Chế Bắt Cầu');
code = code.replace(/Phan Tich C\?u Keo/g, 'Phân Tích Cầu Kèo');
code = code.replace(/Ly do b\?t c\?u:/g, 'Lý do bắt cầu:');
code = code.replace(/ϡi\?m:/g, 'Điểm:');
code = code.replace(/T\?I/g, 'TÀI');
code = code.replace(/L\?/g, 'LẺ');
code = code.replace(/H\? DAN/g, 'HỆ DÀN');
code = code.replace(/S\? /g, 'SỐ ');
code = code.replace(/Th\?/g, 'Thủ');

// Write back to file
fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Successfully repaired UI layout and text encoding!');
