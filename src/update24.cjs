const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

// Cột 2 (historyCheck) insertion
c = c.replace('</>', `  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '16px' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '8px' }}>
                    <span style={{ color: '#ec4899' }}>☯</span> TÀI XỈU - CHẴN LẺ (TỔNG 5 SỐ)
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>
                    Tổng 5 số: <span style={{ color: 'white', fontWeight: 'bold' }}>{historyCheck.actualTXCL.sum}</span> ({historyCheck.actualTXCL.tx} - {historyCheck.actualTXCL.cl})
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {renderTXCLHit(historyCheck.pTXCL.tx, historyCheck.actualTXCL.tx)}
                    {renderTXCLHit(historyCheck.pTXCL.cl, historyCheck.actualTXCL.cl)}
                  </div>
                </div>
              </>`);

// Cột 3 (historyList) insertion
c = c.replace(
  /\{hist\.resultTien\} và \{hist\.resultHau\}<\/span><\/div>/,
  `{hist.resultTien} và {hist.resultHau}</span></div>
                       <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                         Tổng 5 số: <span style={{ color: 'white', fontWeight: 'bold' }}>{hist.actualTXCL.sum}</span> ({hist.actualTXCL.tx} - {hist.actualTXCL.cl})
                       </div>
                       <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                         {renderTXCLHit(hist.pTXCL.tx, hist.actualTXCL.tx)}
                         {renderTXCLHit(hist.pTXCL.cl, hist.actualTXCL.cl)}
                       </div>`
);

fs.writeFileSync('src/App.jsx', c, 'utf8');
