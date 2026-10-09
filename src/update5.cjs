const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update useMemo to include pD2, pD4, etc.
content = content.replace(
  /historyCheck = \{\s*drawId: rawData\[0\]\.Draw_ID,\s*resultHau: hau,\s*fullResult: rawData\[0\]\.Result,/g,
  "historyCheck = {\n        drawId: rawData[0].Draw_ID,\n        resultHau: hau,\n        fullResult: rawData[0].Result,\n        pD2, pD4, pD10, pD20, pCham, p5Tinh,"
);

// Add Check icon import if not present
if (!content.includes('Check,')) {
  content = content.replace(/import \{ LayoutDashboard, Hash, Brain, Plus, Copy \} from 'lucide-react';/, "import { LayoutDashboard, Hash, Brain, Plus, Copy, Check } from 'lucide-react';");
}

const newDashboard = "const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {\n" +
"  return (\n" +
"    <div className=\"animate-fade-in\">\n" +
"      <h2 className=\"text-center text-3xl font-bold gradient-text mb-8\">BẢNG CHỐT SỐ & ĐỐI CHIẾU LỊCH SỬ</h2>\n" +
"      \n" +
"      <div className=\"flex flex-col gap-6 mb-8\">\n" +
"        \n" +
"        {/* DÀN 2 SỐ */}\n" +
"        <div className=\"card p-0 overflow-hidden shadow-[0_0_20px_rgba(0,242,254,0.1)] border-2 border-[var(--accent-primary)]\">\n" +
"          <div className=\"bg-[var(--accent-primary)] text-black font-bold text-xl p-3 text-center\">🎯 HẠ DÀN 2 SỐ (BẠCH THỦ)</div>\n" +
"          <div className=\"grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]\">\n" +
"            {/* TRÁI: KỲ MỚI */}\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#1a1f35]\">\n" +
"              <div className=\"text-white font-bold text-lg mb-4\">DỰ ĐOÁN KỲ TỚI</div>\n" +
"              <div className=\"flex flex-wrap gap-4 justify-center mb-6\">\n" +
"                {dan2.map(s => (\n" +
"                  <span key={s.number} className=\"loto-ball\" style={{ width: 50, height: 50, fontSize: '1.4rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>\n" +
"                    {s.number}\n" +
"                  </span>\n" +
"                ))}\n" +
"              </div>\n" +
"              <button onClick={() => handleCopy(dan2, \"Hạ Dàn 2 Số\")} className=\"px-6 py-2 bg-[var(--accent-primary)] text-black font-bold rounded hover:opacity-90 flex items-center gap-2\">\n" +
"                <Copy size={18} /> COPY DÀN 2\n" +
"              </button>\n" +
"            </div>\n" +
"            {/* PHẢI: KỲ TRƯỚC */}\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#131726]\">\n" +
"              {historyCheck ? (\n" +
"                <>\n" +
"                  <div className=\"text-gray-400 font-bold mb-2\">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>\n" +
"                  <div className=\"text-white mb-4\">Đề về: <span className=\"text-2xl font-bold text-[var(--accent-secondary)]\">{historyCheck.resultHau}</span></div>\n" +
"                  <div className=\"flex flex-wrap gap-4 justify-center mb-6\">\n" +
"                    {historyCheck.pD2.map(s => {\n" +
"                      const isWin = s.number === historyCheck.resultHau;\n" +
"                      return (\n" +
"                        <div key={s.number} className=\"relative\">\n" +
"                          <span className={`loto-ball ${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}`} style={{ width: 50, height: 50, fontSize: '1.4rem' }}>\n" +
"                            {s.number}\n" +
"                          </span>\n" +
"                          {isWin && <div className=\"absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md\"><Check size={16} color=\"#10b981\" strokeWidth={3}/></div>}\n" +
"                        </div>\n" +
"                      )\n" +
"                    })}\n" +
"                  </div>\n" +
"                  {historyCheck.win2 ? <div className=\"text-[#10b981] font-bold text-2xl animate-pulse\">✅ TRÚNG BẠCH THỦ</div> : <div className=\"text-red-500 font-bold text-xl\">❌ TRƯỢT</div>}\n" +
"                </>\n" +
"              ) : <div className=\"text-gray-500 my-auto\">Chưa có dữ liệu kỳ trước</div>}\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"\n" +
"        {/* DÀN 4 SỐ */}\n" +
"        <div className=\"card p-0 overflow-hidden border border-gray-500\">\n" +
"          <div className=\"bg-gray-700 text-white font-bold text-xl p-3 text-center\">⚡ HẠ DÀN 4 SỐ (TỨ THỦ)</div>\n" +
"          <div className=\"grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]\">\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#1a1f35]\">\n" +
"              <div className=\"text-white font-bold text-lg mb-4\">DỰ ĐOÁN KỲ TỚI</div>\n" +
"              <div className=\"flex flex-wrap gap-3 justify-center mb-6\">\n" +
"                {dan4.map(s => (\n" +
"                  <span key={s.number} className=\"loto-ball\" style={{ width: 44, height: 44, fontSize: '1.2rem', borderColor: '#d1d5db', color: '#d1d5db' }}>\n" +
"                    {s.number}\n" +
"                  </span>\n" +
"                ))}\n" +
"              </div>\n" +
"              <button onClick={() => handleCopy(dan4, \"Hạ Dàn 4 Số\")} className=\"px-6 py-2 bg-gray-300 text-black font-bold rounded hover:opacity-90 flex items-center gap-2\">\n" +
"                <Copy size={18} /> COPY DÀN 4\n" +
"              </button>\n" +
"            </div>\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#131726]\">\n" +
"              {historyCheck ? (\n" +
"                <>\n" +
"                  <div className=\"text-gray-400 font-bold mb-2\">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>\n" +
"                  <div className=\"text-white mb-4\">Đề về: <span className=\"text-2xl font-bold text-[var(--accent-secondary)]\">{historyCheck.resultHau}</span></div>\n" +
"                  <div className=\"flex flex-wrap gap-3 justify-center mb-6\">\n" +
"                    {historyCheck.pD4.map(s => {\n" +
"                      const isWin = s.number === historyCheck.resultHau;\n" +
"                      return (\n" +
"                        <div key={s.number} className=\"relative\">\n" +
"                          <span className={`loto-ball ${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}`} style={{ width: 44, height: 44, fontSize: '1.2rem' }}>\n" +
"                            {s.number}\n" +
"                          </span>\n" +
"                          {isWin && <div className=\"absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md\"><Check size={16} color=\"#10b981\" strokeWidth={3}/></div>}\n" +
"                        </div>\n" +
"                      )\n" +
"                    })}\n" +
"                  </div>\n" +
"                  {historyCheck.win4 ? <div className=\"text-[#10b981] font-bold text-2xl animate-pulse\">✅ TRÚNG TỨ THỦ</div> : <div className=\"text-red-500 font-bold text-xl\">❌ TRƯỢT</div>}\n" +
"                </>\n" +
"              ) : <div className=\"text-gray-500 my-auto\">Chưa có dữ liệu kỳ trước</div>}\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"\n" +
"        {/* DÀN 10 SỐ */}\n" +
"        <div className=\"card p-0 overflow-hidden border-2 border-[var(--warning)]\">\n" +
"          <div className=\"bg-[var(--warning)] text-black font-bold text-xl p-3 text-center\">🔥 DÀN 10 SỐ 2D (CÂN BẰNG)</div>\n" +
"          <div className=\"grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]\">\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#1a1f35]\">\n" +
"              <div className=\"text-white font-bold text-lg mb-4\">DỰ ĐOÁN KỲ TỚI</div>\n" +
"              <div className=\"flex flex-wrap gap-2 justify-center mb-6\">\n" +
"                {dan10.map(s => (\n" +
"                  <span key={s.number} className=\"loto-ball hot\" style={{ width: 36, height: 36, fontSize: '1rem', margin: 0 }}>\n" +
"                    {s.number}\n" +
"                  </span>\n" +
"                ))}\n" +
"              </div>\n" +
"              <button onClick={() => handleCopy(dan10, \"Dàn 10 Số\")} className=\"px-6 py-2 bg-[var(--warning)] text-black font-bold rounded hover:opacity-90 flex items-center gap-2\">\n" +
"                <Copy size={18} /> COPY DÀN 10\n" +
"              </button>\n" +
"            </div>\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#131726]\">\n" +
"              {historyCheck ? (\n" +
"                <>\n" +
"                  <div className=\"text-gray-400 font-bold mb-2\">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>\n" +
"                  <div className=\"text-white mb-4\">Đề về: <span className=\"text-2xl font-bold text-[var(--accent-secondary)]\">{historyCheck.resultHau}</span></div>\n" +
"                  <div className=\"flex flex-wrap gap-2 justify-center mb-6\">\n" +
"                    {historyCheck.pD10.map(s => {\n" +
"                      const isWin = s.number === historyCheck.resultHau;\n" +
"                      return (\n" +
"                        <div key={s.number} className=\"relative\">\n" +
"                          <span className={`loto-ball ${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}`} style={{ width: 36, height: 36, fontSize: '1rem', margin: 0 }}>\n" +
"                            {s.number}\n" +
"                          </span>\n" +
"                          {isWin && <div className=\"absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md\"><Check size={14} color=\"#10b981\" strokeWidth={3}/></div>}\n" +
"                        </div>\n" +
"                      )\n" +
"                    })}\n" +
"                  </div>\n" +
"                  {historyCheck.win10 ? <div className=\"text-[#10b981] font-bold text-2xl animate-pulse\">✅ TRÚNG DÀN 10</div> : <div className=\"text-red-500 font-bold text-xl\">❌ TRƯỢT</div>}\n" +
"                </>\n" +
"              ) : <div className=\"text-gray-500 my-auto\">Chưa có dữ liệu kỳ trước</div>}\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"\n" +
"        {/* DÀN 20 SỐ */}\n" +
"        <div className=\"card p-0 overflow-hidden border border-[var(--success)]\">\n" +
"          <div className=\"bg-[var(--success)] text-white font-bold text-xl p-3 text-center\">🛡️ DÀN 20 SỐ 2D (AN TOÀN)</div>\n" +
"          <div className=\"grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]\">\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#1a1f35]\">\n" +
"              <div className=\"text-white font-bold text-lg mb-4\">DỰ ĐOÁN KỲ TỚI</div>\n" +
"              <div className=\"flex flex-wrap gap-2 justify-center mb-6\">\n" +
"                {dan20.map(s => (\n" +
"                  <span key={s.number} className=\"loto-ball\" style={{ width: 34, height: 34, fontSize: '0.9rem', margin: 0, borderColor: 'var(--success)', color: 'var(--success)' }}>\n" +
"                    {s.number}\n" +
"                  </span>\n" +
"                ))}\n" +
"              </div>\n" +
"              <button onClick={() => handleCopy(dan20, \"Dàn 20 Số\")} className=\"px-6 py-2 bg-[var(--success)] text-white font-bold rounded hover:opacity-90 flex items-center gap-2\">\n" +
"                <Copy size={18} /> COPY DÀN 20\n" +
"              </button>\n" +
"            </div>\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#131726]\">\n" +
"              {historyCheck ? (\n" +
"                <>\n" +
"                  <div className=\"text-gray-400 font-bold mb-2\">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>\n" +
"                  <div className=\"text-white mb-4\">Đề về: <span className=\"text-2xl font-bold text-[var(--accent-secondary)]\">{historyCheck.resultHau}</span></div>\n" +
"                  <div className=\"flex flex-wrap gap-2 justify-center mb-6\">\n" +
"                    {historyCheck.pD20.map(s => {\n" +
"                      const isWin = s.number === historyCheck.resultHau;\n" +
"                      return (\n" +
"                        <div key={s.number} className=\"relative\">\n" +
"                          <span className={`loto-ball ${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}`} style={{ width: 34, height: 34, fontSize: '0.9rem', margin: 0 }}>\n" +
"                            {s.number}\n" +
"                          </span>\n" +
"                          {isWin && <div className=\"absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md z-10\"><Check size={12} color=\"#10b981\" strokeWidth={3}/></div>}\n" +
"                        </div>\n" +
"                      )\n" +
"                    })}\n" +
"                  </div>\n" +
"                  {historyCheck.win20 ? <div className=\"text-[#10b981] font-bold text-2xl animate-pulse\">✅ TRÚNG DÀN 20</div> : <div className=\"text-red-500 font-bold text-xl\">❌ TRƯỢT</div>}\n" +
"                </>\n" +
"              ) : <div className=\"text-gray-500 my-auto\">Chưa có dữ liệu kỳ trước</div>}\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"\n" +
"        {/* CHẠM CỨNG */}\n" +
"        <div className=\"card p-0 overflow-hidden border-2 border-[var(--info)]\">\n" +
"          <div className=\"bg-[var(--info)] text-white font-bold text-xl p-3 text-center\">💎 BẮT CHẠM CỨNG (4 CHẠM)</div>\n" +
"          <div className=\"grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]\">\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#1a1f35]\">\n" +
"              <div className=\"text-white font-bold text-lg mb-4\">DỰ ĐOÁN KỲ TỚI</div>\n" +
"              <div className=\"flex flex-wrap gap-4 justify-center mb-6\">\n" +
"                {topSingles.slice(0, 4).map(s => (\n" +
"                  <span key={s.number} className=\"loto-ball\" style={{ width: 48, height: 48, fontSize: '1.4rem', borderColor: 'var(--info)', color: 'var(--info)' }}>\n" +
"                    {s.number}\n" +
"                  </span>\n" +
"                ))}\n" +
"              </div>\n" +
"              <button onClick={() => handleCopy(topSingles.slice(0,4), \"4 Chạm Cứng\")} className=\"px-6 py-2 bg-[var(--info)] text-white font-bold rounded hover:opacity-90 flex items-center gap-2\">\n" +
"                <Copy size={18} /> COPY CHẠM\n" +
"              </button>\n" +
"            </div>\n" +
"            <div className=\"p-6 flex flex-col items-center bg-[#131726]\">\n" +
"              {historyCheck ? (\n" +
"                <>\n" +
"                  <div className=\"text-gray-400 font-bold mb-2\">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>\n" +
"                  <div className=\"text-white mb-4\">Đề về: <span className=\"text-2xl font-bold text-[var(--accent-secondary)]\">{historyCheck.resultHau}</span></div>\n" +
"                  <div className=\"flex flex-wrap gap-4 justify-center mb-6\">\n" +
"                    {historyCheck.pCham.map(num => {\n" +
"                      const isWin = historyCheck.resultHau.includes(num);\n" +
"                      return (\n" +
"                        <div key={num} className=\"relative\">\n" +
"                          <span className={`loto-ball ${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}`} style={{ width: 48, height: 48, fontSize: '1.4rem' }}>\n" +
"                            {num}\n" +
"                          </span>\n" +
"                          {isWin && <div className=\"absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md\"><Check size={16} color=\"#10b981\" strokeWidth={3}/></div>}\n" +
"                        </div>\n" +
"                      )\n" +
"                    })}\n" +
"                  </div>\n" +
"                  {historyCheck.winCham ? <div className=\"text-[#10b981] font-bold text-2xl animate-pulse\">✅ TRÚNG CHẠM</div> : <div className=\"text-red-500 font-bold text-xl\">❌ TRƯỢT</div>}\n" +
"                </>\n" +
"              ) : <div className=\"text-gray-500 my-auto\">Chưa có dữ liệu kỳ trước</div>}\n" +
"            </div>\n" +
"          </div>\n" +
"        </div>\n" +
"\n" +
"      </div>\n" +
"    </div>\n" +
"  );\n" +
"};\n";

const startIndex = content.indexOf('const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {');
const endIndex = content.indexOf('const PagePlaceholder = ({ title, description }) => (');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newDashboard + '\n\n' + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced ExecutiveDashboard');
} else {
  console.log('Could not find the component boundaries');
}
