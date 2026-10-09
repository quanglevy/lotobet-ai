const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newDashboard = `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 p-6 bg-[var(--bg-secondary)] rounded-xl border-2 border-[#1e293b] shadow-lg">
        <h2 className="text-center text-xl font-bold text-[#00f2fe] mb-6 flex items-center justify-center gap-2">
          <span>💧</span> BẢNG CHỐT SỐ TỐC ĐỘ CAO (COPY & DÁN) <span>💧</span>
        </h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* CỘT TRÁI */}
          <div className="flex flex-col gap-4">
            
            {/* HẠ DÀN 2 SỐ */}
            <div className="bg-[#131726] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between relative shadow-md">
              <div className="absolute top-4 right-4">
                <button onClick={() => handleCopy(dan2, "Hạ Dàn 2 Số")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                  <Copy size={12} /> COPY
                </button>
              </div>
              <div className="mb-4">
                <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-red-500">🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
                <div className="text-gray-500 text-[10px]">Siêu nổ (1 cặp lộn)</div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {dan2.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 32, height: 32, fontSize: '0.9rem', margin: 0, borderColor: '#00f2fe', color: '#00f2fe', backgroundColor: 'transparent' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              {historyCheck && (
                <div className="text-[10px] flex justify-between items-center text-gray-500 mt-2 border-t border-[#1e293b] pt-2">
                  <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                  {historyCheck.win2 ? <span className="text-[#00ff00] font-bold">V TRÚNG</span> : <span className="text-red-500 font-bold">X TRƯỢT</span>}
                </div>
              )}
            </div>

            {/* HẠ DÀN 4 SỐ */}
            <div className="bg-[#131726] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between relative shadow-md">
              <div className="absolute top-4 right-4">
                <button onClick={() => handleCopy(dan4, "Hạ Dàn 4 Số")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                  <Copy size={12} /> COPY
                </button>
              </div>
              <div className="mb-4">
                <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-yellow-500">⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
                <div className="text-gray-500 text-[10px]">Đột phá (2 cặp lộn)</div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {dan4.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 32, height: 32, fontSize: '0.9rem', margin: 0, borderColor: '#94a3b8', color: '#94a3b8', backgroundColor: 'transparent' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              {historyCheck && (
                <div className="text-[10px] flex justify-between items-center text-gray-500 mt-2 border-t border-[#1e293b] pt-2">
                  <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                  {historyCheck.win4 ? <span className="text-[#00ff00] font-bold">V TRÚNG</span> : <span className="text-red-500 font-bold">X TRƯỢT</span>}
                </div>
              )}
            </div>

            {/* DÀN 10 SỐ */}
            <div className="bg-[#131726] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between relative shadow-md">
              <div className="absolute top-4 right-4">
                <button onClick={() => handleCopy(dan10, "Dàn 10 Số")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                  <Copy size={12} /> COPY
                </button>
              </div>
              <div className="mb-4">
                <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-orange-500">🔥</span> DÀN 10 SỐ 2D</div>
                <div className="text-gray-500 text-[10px]">Cân bằng vốn</div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {dan10.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 28, height: 28, fontSize: '0.8rem', margin: 0, borderColor: '#ef4444', color: '#ef4444', backgroundColor: 'transparent' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              {historyCheck && (
                <div className="text-[10px] flex justify-between items-center text-gray-500 mt-2 border-t border-[#1e293b] pt-2">
                  <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                  {historyCheck.win10 ? <span className="text-[#00ff00] font-bold">V TRÚNG</span> : <span className="text-red-500 font-bold">X TRƯỢT</span>}
                </div>
              )}
            </div>

            {/* DÀN 20 SỐ */}
            <div className="bg-[#131726] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between relative shadow-md">
              <div className="absolute top-4 right-4">
                <button onClick={() => handleCopy(dan20, "Dàn 20 Số")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                  <Copy size={12} /> COPY
                </button>
              </div>
              <div className="mb-4">
                <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-orange-500">🔥</span> DÀN 20 SỐ 2D</div>
                <div className="text-gray-500 text-[10px]">An toàn cao</div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {dan20.map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 28, height: 28, fontSize: '0.8rem', margin: 0, borderColor: '#10b981', color: '#10b981', backgroundColor: 'transparent' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              {historyCheck && (
                <div className="text-[10px] flex justify-between items-center text-gray-500 mt-2 border-t border-[#1e293b] pt-2">
                  <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                  {historyCheck.win20 ? <span className="text-[#00ff00] font-bold">V TRÚNG</span> : <span className="text-red-500 font-bold">X TRƯỢT</span>}
                </div>
              )}
            </div>

          </div>

          {/* CỘT PHẢI */}
          <div className="flex flex-col gap-4">
            
            {/* 3 SỐ 5 TINH */}
            <div className="bg-[#131726] border border-[#1e293b] rounded-xl p-4 flex flex-col h-[180px] justify-between shadow-md">
              <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <span className="text-yellow-400">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
              </div>
              
              <div className="flex justify-between items-center px-4">
                
                <div className="flex flex-col items-center text-center">
                  <div className="text-white font-bold text-[10px] mb-2">DÀN 3 SỐ</div>
                  <div className="text-white font-bold text-lg mb-2">{topSingles.slice(0, 3).map(s => s.number).join(', ')}</div>
                  <button onClick={() => handleCopy(topSingles.slice(0,3), "3s5t (3 số)")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                    <Copy size={12} /> COPY
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="text-white font-bold text-[10px] mb-2">DÀN 4 SỐ</div>
                  <div className="text-white font-bold text-lg mb-2">{topSingles.slice(0, 4).map(s => s.number).join(', ')}</div>
                  <button onClick={() => handleCopy(topSingles.slice(0,4), "3s5t (4 số)")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                    <Copy size={12} /> COPY
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="text-white font-bold text-[10px] mb-2">DÀN 5 SỐ</div>
                  <div className="text-white font-bold text-lg mb-2">{topSingles.slice(0, 5).map(s => s.number).join(', ')}</div>
                  <button onClick={() => handleCopy(topSingles.slice(0,5), "3s5t (5 số)")} className="flex items-center gap-1 text-[10px] text-black font-bold bg-[#e2e8f0] px-2 py-1 rounded hover:bg-gray-300">
                    <Copy size={12} /> COPY
                  </button>
                </div>

              </div>
              {historyCheck && (
                <div className="text-[10px] flex justify-between items-center text-gray-500 mt-4 border-t border-[#1e293b] pt-2">
                  <span>Kỳ trước ({historyCheck.drawId}): {historyCheck.fullResult}</span>
                  {historyCheck.win5Tinh ? <span className="text-[#00ff00] font-bold">V TRÚNG</span> : <span className="text-red-500 font-bold">X TRƯỢT</span>}
                </div>
              )}
            </div>

            {/* CHẠM CỨNG */}
            <div className="bg-[#131726] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between shadow-md">
              <div className="mb-4">
                <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-[#00f2fe]">💎</span> BẮT CHẠM CỨNG (4 CHẠM)</div>
              </div>
              <div className="flex justify-center gap-4 mb-4">
                {topSingles.slice(0, 4).map(s => (
                  <span key={s.number} className="loto-ball" style={{ width: 44, height: 44, fontSize: '1.2rem', margin: 0, borderColor: '#3b82f6', color: '#3b82f6', backgroundColor: 'transparent' }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => handleCopy(topSingles.slice(0,4), "4 Chạm Cứng")}
                className="w-full py-2 bg-[#f8fafc] text-black font-bold rounded-sm hover:bg-gray-200 transition-opacity flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Copy size={16} /> COPY 4 CHẠM VÀO KUBET
              </button>
              {historyCheck && (
                <div className="text-[10px] flex justify-between items-center text-gray-500 mt-4 border-t border-[#1e293b] pt-2">
                  <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                  {historyCheck.winCham ? <span className="text-[#00ff00] font-bold">V TRÚNG</span> : <span className="text-red-500 font-bold">X TRƯỢT</span>}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
      
      {/* THÔNG TIN HỆ THỐNG */}
      <h1 className="gradient-text mb-6 text-center text-lg">Thông Số Kỹ Thuật</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Tổng Số Kỳ</div>
          <div className="text-lg font-bold text-accent-primary">{data.length}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Cập Nhật</div>
          <div className="text-lg font-bold">{new Date().toLocaleDateString('vi-VN')}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Mô Hình</div>
          <div className="text-lg font-bold text-accent-secondary">Ngũ Hành</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Độ Tin Cậy</div>
          <div className="text-lg font-bold text-success">Cao</div>
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
