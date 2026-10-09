const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newDashboard = `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {
  
  // Helper to render balls
  const renderBalls = (balls, isHistory = false, resultHau = null) => {
    return balls.map(s => {
      const num = typeof s === 'object' ? s.number : s;
      const isWinner = isHistory && resultHau && num === resultHau;
      
      let bg = 'transparent';
      let border = '#3b82f6';
      let color = '#3b82f6';
      let width = 32;
      
      // Determine colors based on array size (just simple heuristics for UI consistency)
      if (balls.length <= 4) { border = color = '#00f2fe'; width = 32; }
      else if (balls.length <= 10) { border = color = '#ef4444'; width = 28; }
      else { border = color = '#10b981'; width = 28; }
      
      if (isWinner) {
        bg = '#10b981'; // Green background for hit!
        color = '#ffffff';
        border = '#10b981';
      }

      return (
        <span key={num} className="loto-ball relative flex items-center justify-center rounded-full border-2 font-bold" 
              style={{ width: width, height: width, fontSize: width===32?'0.9rem':'0.8rem', margin: 2, borderColor: border, color: color, backgroundColor: bg }}>
          {num}
          {isWinner && <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-black">✓</span>}
        </span>
      );
    });
  };

  // 3s5t rendering
  const render3s5t = (balls) => {
     return balls.join(', ');
  }

  return (
    <div className="animate-fade-in py-6">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* CỘT 1: DỰ ĐOÁN KỲ TỚI (40%) */}
        <div className="w-full xl:w-[40%] flex flex-col gap-6 bg-transparent">
          <div className="bg-yellow-400 text-black font-bold text-sm md:text-lg p-2 uppercase inline-block self-start mb-2 shadow-lg">
            DỰ ĐOÁN KỲ QUAY TIẾP THEO
          </div>
          
          {/* HẠ DÀN 2 SỐ */}
          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-red-500">🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
            <div className="text-gray-500 text-[10px] mb-2">Siêu nổ (1 cặp lộn)</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan2)}
            </div>
          </div>

          {/* HẠ DÀN 4 SỐ */}
          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-yellow-500">⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
            <div className="text-gray-500 text-[10px] mb-2">Đột phá (2 cặp lộn)</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan4)}
            </div>
          </div>

          {/* DÀN 10 SỐ */}
          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 10 SỐ 2D</div>
            <div className="text-gray-500 text-[10px] mb-2">Cân bằng vốn</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan10)}
            </div>
          </div>

          {/* DÀN 20 SỐ */}
          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 20 SỐ 2D</div>
            <div className="text-gray-500 text-[10px] mb-2">An toàn cao</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan20)}
            </div>
          </div>

          {/* 3 SỐ 5 TINH */}
          <div className="flex flex-col items-start relative mt-2">
            <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
            </div>
            
            <div className="flex justify-start w-full">
              <div className="flex flex-col items-center text-center" style={{ marginRight: "3rem" }}>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 3).map(s=>s.number))}</div>
              </div>
              <div className="flex flex-col items-center text-center" style={{ marginRight: "3rem" }}>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 4).map(s=>s.number))}</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 5).map(s=>s.number))}</div>
              </div>
            </div>
          </div>
          
        </div>

        {/* CỘT 2: KẾT QUẢ KỲ VỪA XONG (40%) */}
        <div className="w-full xl:w-[40%] flex flex-col gap-6 bg-transparent">
          <div className="bg-yellow-400 text-black font-bold text-sm md:text-lg p-2 uppercase inline-block self-start mb-2 shadow-lg">
            KẾT QUẢ KỲ QUAY VỪA XONG
          </div>
          
          {historyCheck ? (
            <>
              {/* HẠ DÀN 2 SỐ */}
              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-red-500">🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
                <div className="text-gray-500 text-[10px] mb-2">Siêu nổ (1 cặp lộn)</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD2, true, historyCheck.resultHau)}
                </div>
              </div>

              {/* HẠ DÀN 4 SỐ */}
              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-yellow-500">⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
                <div className="text-gray-500 text-[10px] mb-2">Đột phá (2 cặp lộn)</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD4, true, historyCheck.resultHau)}
                </div>
              </div>

              {/* DÀN 10 SỐ */}
              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 10 SỐ 2D</div>
                <div className="text-gray-500 text-[10px] mb-2">Cân bằng vốn</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD10, true, historyCheck.resultHau)}
                </div>
              </div>

              {/* DÀN 20 SỐ */}
              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 20 SỐ 2D</div>
                <div className="text-gray-500 text-[10px] mb-2">An toàn cao</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD20, true, historyCheck.resultHau)}
                </div>
              </div>

              {/* 3 SỐ 5 TINH */}
              <div className="flex flex-col items-start relative mt-2">
                <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
                </div>
                
                <div className="flex justify-start w-full">
                  <div className="flex flex-col items-center text-center" style={{ marginRight: "3rem" }}>
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 3))}</div>
                  </div>
                  <div className="flex flex-col items-center text-center" style={{ marginRight: "3rem" }}>
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 4))}</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 5))}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-[#131726] rounded-lg border border-gray-700 w-full max-w-sm">
                <div className="text-gray-400 text-sm mb-1">Kết quả kỳ {historyCheck.drawId}:</div>
                <div className="text-2xl font-bold text-yellow-400 tracking-widest">{historyCheck.fullResult}</div>
                <div className="text-gray-400 text-sm mt-1">Đề về: <span className="text-white font-bold text-xl">{historyCheck.resultHau}</span></div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic mt-8">Chưa có dữ liệu đối chiếu kỳ trước.</div>
          )}
        </div>

        {/* CỘT 3: 10 KỲ QUAY (20%) */}
        <div className="w-full xl:w-[20%] flex flex-col gap-4 bg-transparent mt-12 xl:mt-0">
          <div className="bg-yellow-400 text-black font-bold text-sm md:text-base p-2 uppercase text-center mb-2 shadow-lg">
            Liệt kê kết quả 10 kỳ quay
          </div>
          
          <div className="flex flex-col gap-3 px-2">
            {data.slice(0, 10).map((draw, idx) => (
               <div key={draw.Draw_ID || idx} className="flex flex-col border-b border-gray-800 pb-2">
                 <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-[10px] md:text-xs">Kỳ: {draw.Draw_ID}</span>
                   <span className="text-white font-bold text-sm tracking-widest bg-[#131726] px-2 py-1 rounded border border-gray-800">{draw.Result}</span>
                 </div>
                 {idx === 0 && <span className="text-[10px] text-green-500 text-right mt-1 font-bold animate-pulse">Mới nhất</span>}
               </div>
            ))}
            {data.length === 0 && <div className="text-gray-500 text-center text-sm py-4">Chưa có dữ liệu</div>}
          </div>
        </div>

      </div>
    </div>
  );
};

const PagePlaceholder = ({ title, description }) => (
  <div className="animate-fade-in card text-center p-8 mt-8">
    <h2 className="gradient-text mb-4">{title}</h2>
    <p className="text-muted">{description}</p>
    <div className="mt-8 opacity-50">
      <p className="mt-4 text-white">Chức năng đang được cấu trúc lại.</p>
    </div>
  </div>
);`;

content = content.replace(/const ExecutiveDashboard = \([\s\S]*?const PagePlaceholder = \([\s\S]*?\);\n/i, newDashboard + '\n\n');

fs.writeFileSync('src/App.jsx', '\\ufeff' + content.replace(/^\\ufeff/, ''), 'utf-8');
