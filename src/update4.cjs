const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update useMemo to include pD2, pD4, etc.
content = content.replace(
  /historyCheck = \{\s*drawId: rawData\[0\]\.Draw_ID,\s*resultHau: hau,\s*fullResult: rawData\[0\]\.Result,/g,
  \`historyCheck = {
        drawId: rawData[0].Draw_ID,
        resultHau: hau,
        fullResult: rawData[0].Result,
        pD2, pD4, pD10, pD20, pCham, p5Tinh,\`
);

// Add Check icon import if not present
if (!content.includes('Check,')) {
  content = content.replace(/import \{ LayoutDashboard, Hash, Brain, Plus, Copy \} from 'lucide-react';/, "import { LayoutDashboard, Hash, Brain, Plus, Copy, Check } from 'lucide-react';");
}

const newDashboard = `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-center text-3xl font-bold gradient-text mb-8">BẢNG CHỐT SỐ & ĐỐI CHIẾU LỊCH SỬ</h2>
      
      <div className="flex flex-col gap-6 mb-8">
        
        {/* DÀN 2 SỐ */}
        <div className="card p-0 overflow-hidden shadow-[0_0_20px_rgba(0,242,254,0.1)] border-2 border-[var(--accent-primary)]">
          <div className="bg-[var(--accent-primary)] text-black font-bold text-xl p-3 text-center">🎯 HẠ DÀN 2 SỐ (BẠCH THỦ)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            {/* TRÁI: KỲ MỚI */}
            <div className="p-6 flex flex-col items-center bg-[#1a1f35]">
              <div className="text-white font-bold text-lg mb-4">DỰ ĐOÁN KỲ TỚI</div>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {dan2.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 50, height: 50, fontSize: '1.4rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <button onClick={() => handleCopy(dan2, "Hạ Dàn 2 Số")} className="px-6 py-2 bg-[var(--accent-primary)] text-black font-bold rounded hover:opacity-90 flex items-center gap-2">
                <Copy size={18} /> COPY DÀN 2
              </button>
            </div>
            {/* PHẢI: KỲ TRƯỚC */}
            <div className="p-6 flex flex-col items-center bg-[#131726]">
              {historyCheck ? (
                <>
                  <div className="text-gray-400 font-bold mb-2">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>
                  <div className="text-white mb-4">Đề về: <span className="text-2xl font-bold text-[var(--accent-secondary)]">{historyCheck.resultHau}</span></div>
                  <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {historyCheck.pD2.map(s => {
                      const isWin = s.number === historyCheck.resultHau;
                      return (
                        <div key={s.number} className="relative">
                          <span className={\`loto-ball \${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}\`} style={{ width: 50, height: 50, fontSize: '1.4rem' }}>
                            {s.number}
                          </span>
                          {isWin && <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"><Check size={16} color="#10b981" strokeWidth={3}/></div>}
                        </div>
                      )
                    })}
                  </div>
                  {historyCheck.win2 ? <div className="text-[#10b981] font-bold text-2xl animate-pulse">✅ TRÚNG BẠCH THỦ</div> : <div className="text-red-500 font-bold text-xl">❌ TRƯỢT</div>}
                </>
              ) : <div className="text-gray-500 my-auto">Chưa có dữ liệu kỳ trước</div>}
            </div>
          </div>
        </div>

        {/* DÀN 4 SỐ */}
        <div className="card p-0 overflow-hidden border border-gray-500">
          <div className="bg-gray-700 text-white font-bold text-xl p-3 text-center">⚡ HẠ DÀN 4 SỐ (TỨ THỦ)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="p-6 flex flex-col items-center bg-[#1a1f35]">
              <div className="text-white font-bold text-lg mb-4">DỰ ĐOÁN KỲ TỚI</div>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {dan4.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 44, height: 44, fontSize: '1.2rem', borderColor: '#d1d5db', color: '#d1d5db' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <button onClick={() => handleCopy(dan4, "Hạ Dàn 4 Số")} className="px-6 py-2 bg-gray-300 text-black font-bold rounded hover:opacity-90 flex items-center gap-2">
                <Copy size={18} /> COPY DÀN 4
              </button>
            </div>
            <div className="p-6 flex flex-col items-center bg-[#131726]">
              {historyCheck ? (
                <>
                  <div className="text-gray-400 font-bold mb-2">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>
                  <div className="text-white mb-4">Đề về: <span className="text-2xl font-bold text-[var(--accent-secondary)]">{historyCheck.resultHau}</span></div>
                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {historyCheck.pD4.map(s => {
                      const isWin = s.number === historyCheck.resultHau;
                      return (
                        <div key={s.number} className="relative">
                          <span className={\`loto-ball \${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}\`} style={{ width: 44, height: 44, fontSize: '1.2rem' }}>
                            {s.number}
                          </span>
                          {isWin && <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"><Check size={16} color="#10b981" strokeWidth={3}/></div>}
                        </div>
                      )
                    })}
                  </div>
                  {historyCheck.win4 ? <div className="text-[#10b981] font-bold text-2xl animate-pulse">✅ TRÚNG TỨ THỦ</div> : <div className="text-red-500 font-bold text-xl">❌ TRƯỢT</div>}
                </>
              ) : <div className="text-gray-500 my-auto">Chưa có dữ liệu kỳ trước</div>}
            </div>
          </div>
        </div>

        {/* DÀN 10 SỐ */}
        <div className="card p-0 overflow-hidden border-2 border-[var(--warning)]">
          <div className="bg-[var(--warning)] text-black font-bold text-xl p-3 text-center">🔥 DÀN 10 SỐ 2D (CÂN BẰNG)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="p-6 flex flex-col items-center bg-[#1a1f35]">
              <div className="text-white font-bold text-lg mb-4">DỰ ĐOÁN KỲ TỚI</div>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {dan10.map(s => (
                  <span key={s.number} className="loto-ball hot" style={{ width: 36, height: 36, fontSize: '1rem', margin: 0 }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <button onClick={() => handleCopy(dan10, "Dàn 10 Số")} className="px-6 py-2 bg-[var(--warning)] text-black font-bold rounded hover:opacity-90 flex items-center gap-2">
                <Copy size={18} /> COPY DÀN 10
              </button>
            </div>
            <div className="p-6 flex flex-col items-center bg-[#131726]">
              {historyCheck ? (
                <>
                  <div className="text-gray-400 font-bold mb-2">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>
                  <div className="text-white mb-4">Đề về: <span className="text-2xl font-bold text-[var(--accent-secondary)]">{historyCheck.resultHau}</span></div>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {historyCheck.pD10.map(s => {
                      const isWin = s.number === historyCheck.resultHau;
                      return (
                        <div key={s.number} className="relative">
                          <span className={\`loto-ball \${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}\`} style={{ width: 36, height: 36, fontSize: '1rem', margin: 0 }}>
                            {s.number}
                          </span>
                          {isWin && <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"><Check size={14} color="#10b981" strokeWidth={3}/></div>}
                        </div>
                      )
                    })}
                  </div>
                  {historyCheck.win10 ? <div className="text-[#10b981] font-bold text-2xl animate-pulse">✅ TRÚNG DÀN 10</div> : <div className="text-red-500 font-bold text-xl">❌ TRƯỢT</div>}
                </>
              ) : <div className="text-gray-500 my-auto">Chưa có dữ liệu kỳ trước</div>}
            </div>
          </div>
        </div>

        {/* DÀN 20 SỐ */}
        <div className="card p-0 overflow-hidden border border-[var(--success)]">
          <div className="bg-[var(--success)] text-white font-bold text-xl p-3 text-center">🛡️ DÀN 20 SỐ 2D (AN TOÀN)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="p-6 flex flex-col items-center bg-[#1a1f35]">
              <div className="text-white font-bold text-lg mb-4">DỰ ĐOÁN KỲ TỚI</div>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {dan20.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 34, height: 34, fontSize: '0.9rem', margin: 0, borderColor: 'var(--success)', color: 'var(--success)' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <button onClick={() => handleCopy(dan20, "Dàn 20 Số")} className="px-6 py-2 bg-[var(--success)] text-white font-bold rounded hover:opacity-90 flex items-center gap-2">
                <Copy size={18} /> COPY DÀN 20
              </button>
            </div>
            <div className="p-6 flex flex-col items-center bg-[#131726]">
              {historyCheck ? (
                <>
                  <div className="text-gray-400 font-bold mb-2">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>
                  <div className="text-white mb-4">Đề về: <span className="text-2xl font-bold text-[var(--accent-secondary)]">{historyCheck.resultHau}</span></div>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {historyCheck.pD20.map(s => {
                      const isWin = s.number === historyCheck.resultHau;
                      return (
                        <div key={s.number} className="relative">
                          <span className={\`loto-ball \${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}\`} style={{ width: 34, height: 34, fontSize: '0.9rem', margin: 0 }}>
                            {s.number}
                          </span>
                          {isWin && <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md z-10"><Check size={12} color="#10b981" strokeWidth={3}/></div>}
                        </div>
                      )
                    })}
                  </div>
                  {historyCheck.win20 ? <div className="text-[#10b981] font-bold text-2xl animate-pulse">✅ TRÚNG DÀN 20</div> : <div className="text-red-500 font-bold text-xl">❌ TRƯỢT</div>}
                </>
              ) : <div className="text-gray-500 my-auto">Chưa có dữ liệu kỳ trước</div>}
            </div>
          </div>
        </div>

        {/* CHẠM CỨNG */}
        <div className="card p-0 overflow-hidden border-2 border-[var(--info)]">
          <div className="bg-[var(--info)] text-white font-bold text-xl p-3 text-center">💎 BẮT CHẠM CỨNG (4 CHẠM)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
            <div className="p-6 flex flex-col items-center bg-[#1a1f35]">
              <div className="text-white font-bold text-lg mb-4">DỰ ĐOÁN KỲ TỚI</div>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {topSingles.slice(0, 4).map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 48, height: 48, fontSize: '1.4rem', borderColor: 'var(--info)', color: 'var(--info)' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <button onClick={() => handleCopy(topSingles.slice(0,4), "4 Chạm Cứng")} className="px-6 py-2 bg-[var(--info)] text-white font-bold rounded hover:opacity-90 flex items-center gap-2">
                <Copy size={18} /> COPY CHẠM
              </button>
            </div>
            <div className="p-6 flex flex-col items-center bg-[#131726]">
              {historyCheck ? (
                <>
                  <div className="text-gray-400 font-bold mb-2">ĐỐI CHIẾU KỲ TRƯỚC (Kỳ {historyCheck.drawId})</div>
                  <div className="text-white mb-4">Đề về: <span className="text-2xl font-bold text-[var(--accent-secondary)]">{historyCheck.resultHau}</span></div>
                  <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {historyCheck.pCham.map(num => {
                      const isWin = historyCheck.resultHau.includes(num);
                      return (
                        <div key={num} className="relative">
                          <span className={\`loto-ball \${isWin ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-gray-600 text-gray-500'}\`} style={{ width: 48, height: 48, fontSize: '1.4rem' }}>
                            {num}
                          </span>
                          {isWin && <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"><Check size={16} color="#10b981" strokeWidth={3}/></div>}
                        </div>
                      )
                    })}
                  </div>
                  {historyCheck.winCham ? <div className="text-[#10b981] font-bold text-2xl animate-pulse">✅ TRÚNG CHẠM</div> : <div className="text-red-500 font-bold text-xl">❌ TRƯỢT</div>}
                </>
              ) : <div className="text-gray-500 my-auto">Chưa có dữ liệu kỳ trước</div>}
            </div>
          </div>
        </div>

      </div>
      
      {/* THÔNG TIN HỆ THỐNG */}
      <h1 className="gradient-text mb-6 text-center text-lg mt-12">Thông Số Kỹ Thuật</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center p-4">
          <div className="text-gray-500 text-xs mb-1">Tổng Số Kỳ</div>
          <div className="text-xl font-bold text-[var(--accent-primary)]">{data.length}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-xs mb-1">Cập Nhật</div>
          <div className="text-xl font-bold">{new Date().toLocaleDateString('vi-VN')}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-xs mb-1">Mô Hình</div>
          <div className="text-xl font-bold text-[var(--accent-secondary)]">Kép/Lệch/Tổng</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-xs mb-1">Độ Tin Cậy</div>
          <div className="text-xl font-bold text-[var(--success)]">Cao</div>
        </div>
      </div>
    </div>
  );
};`;

const startIndex = content.indexOf('const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {');
const endIndex = content.indexOf('const PagePlaceholder = ({ title, description }) => (');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newDashboard + '\n\n' + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced ExecutiveDashboard');
} else {
  console.log('Could not find the component boundaries');
}
