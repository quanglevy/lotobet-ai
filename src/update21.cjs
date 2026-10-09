const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Imports
c = c.replace(
  /import \{ analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, \r?\ngenerateDanByTong, generateReversibleSetFromDan \} from "\.\/utils\/statistics";/,
  'import { analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, generateDanByTong, generateReversibleSetFromDan, predictTXCL, checkTXCL } from "./utils/statistics";'
);

// 2. ExecutiveDashboard Signature
c = c.replace(
  /const ExecutiveDashboard = \(\{ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = \[\], handleCopy \}\) => \{/,
  'const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = [], txcl, handleCopy }) => {\n\n  const renderTXCLHit = (prediction, actual) => {\n    const isHit = prediction === actual;\n    return (\n      <div style={{ \n         backgroundColor: isHit ? "#10b981" : "#1f2937", \n         color: isHit ? "white" : (prediction === "TÀI" || prediction === "CHẴN" ? "#38bdf8" : "#f472b6"),\n         padding: "0.5rem 1rem", \n         borderRadius: "4px", \n         fontWeight: "bold", \n         fontSize: "1.25rem",\n         display: "flex",\n         alignItems: "center",\n         gap: "4px"\n      }}>\n        {prediction} {isHit && <span style={{ fontSize: "14px" }}>✓</span>}\n      </div>\n    );\n  };'
);

// 3. UI Column 1 (Tài xỉu)
const col1Target = `</div>
              </div>
            </div>
          </div>`;
const col1Replace = `</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '16px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '8px' }}>
                <span style={{ color: '#ec4899' }}>☯</span> TÀI XỈU - CHẴN LẺ (TỔNG 5 SỐ)
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ backgroundColor: '#1f2937', padding: '0.5rem 1rem', borderRadius: '4px', color: '#38bdf8', fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {txcl?.tx}
                </div>
                <div style={{ backgroundColor: '#1f2937', padding: '0.5rem 1rem', borderRadius: '4px', color: '#f472b6', fontWeight: 'bold', fontSize: '1.25rem' }}>
                  {txcl?.cl}
                </div>
              </div>
            </div>

          </div>`;
c = c.replace(col1Target, col1Replace);

// 4. UI Column 2 (Tài xỉu)
const col2Target = `</div>
                  </div>
                </div>
              </>`;
const col2Replace = `</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '16px' }}>
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
              </>`;
c = c.replace(col2Target, col2Replace);

// 5. UI Column 3 (History)
const histTarget = `Đề về: <span style={{ color: "#facc15", fontWeight: "bold" }}>{hist.resultTien} và {hist.resultHau}</span></div>
                      </div>`;
const histReplace = `Đề về: <span style={{ color: "#facc15", fontWeight: "bold" }}>{hist.resultTien} và {hist.resultHau}</span></div>
                         <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                           Tổng 5 số: <span style={{ color: 'white', fontWeight: 'bold' }}>{hist.actualTXCL.sum}</span> ({hist.actualTXCL.tx} - {hist.actualTXCL.cl})
                         </div>
                         <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                           {renderTXCLHit(hist.pTXCL.tx, hist.actualTXCL.tx)}
                           {renderTXCLHit(hist.pTXCL.cl, hist.actualTXCL.cl)}
                         </div>
                      </div>`;
c = c.replace(histTarget, histReplace);

// 6. useMemo logic
const useMemoTarget = `const d2 = generateReversibleSetFromDan(d4, scored2D, 2);`;
const useMemoReplace = `const d2 = generateReversibleSetFromDan(d4, scored2D, 2);
      const txcl = predictTXCL(rawData);`;
c = c.replace(useMemoTarget, useMemoReplace);

const getPredTarget = `const pScoredSingles = analyzeSingleDigits(dataToAnalyze);`;
const getPredReplace = `const pScoredSingles = analyzeSingleDigits(dataToAnalyze);
          const pTXCL = predictTXCL(dataToAnalyze);
          const actualTXCL = checkTXCL(actualDraw.Result);`;
c = c.replace(getPredTarget, getPredReplace);

const retPredTarget = `fullResult: actualDraw.Result,
          pD2, pD4, pD10, pD20, pCham, p5Tinh
        };`;
const retPredReplace = `fullResult: actualDraw.Result,
          pD2, pD4, pD10, pD20, pCham, p5Tinh,
          pTXCL, actualTXCL
        };`;
c = c.replace(retPredTarget, retPredReplace);

const finalRetTarget = `return { dan2: d2, dan4: d4, dan10: d10, dan20: d20, topSingles: scoredSingles, historyCheck, historyList3 };`;
const finalRetReplace = `return { dan2: d2, dan4: d4, dan10: d10, dan20: d20, topSingles: scoredSingles, historyCheck, historyList3, txcl };`;
c = c.replace(finalRetTarget, finalRetReplace);

const destructureTarget = `const { dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 } = useMemo(() => {`;
const destructureReplace = `const { dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3, txcl } = useMemo(() => {`;
c = c.replace(destructureTarget, destructureReplace);

const passPropsTarget = `historyCheck={historyCheck} historyList3={historyList3} />}`;
const passPropsReplace = `historyCheck={historyCheck} historyList3={historyList3} txcl={txcl} />}`;
c = c.replace(passPropsTarget, passPropsReplace);

fs.writeFileSync('src/App.jsx', c, 'utf8');
