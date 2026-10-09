const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newDashboard = `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {
  
  // Lấy kết quả mới nhất
  const latestDraw = data.length > 0 ? data[0] : null;

  // Helper to render balls
  const renderBalls = (balls, isHistory = false, resultHau = null) => {
    return balls.map(s => {
      const num = typeof s === 'object' ? s.number : s;
      const isWinner = isHistory && resultHau && num === resultHau;
      
      let bg = 'transparent';
      let border = '#3b82f6';
      let color = '#3b82f6';
      let width = 32;
      
      if (balls.length <= 4) { border = color = '#00f2fe'; width = 32; }
      else if (balls.length <= 10) { border = color = '#ef4444'; width = 28; }
      else { border = color = '#10b981'; width = 28; }
      
      if (isWinner) {
        bg = '#10b981';
        color = '#ffffff';
        border = '#10b981';
      }

      return (
        <span key={num} className="loto-ball relative flex items-center justify-center rounded-full border font-bold" 
              style={{ width: width, height: width, fontSize: width===32?'0.9rem':'0.8rem', margin: 2, borderColor: border, color: color, backgroundColor: bg }}>
          {num}
          {isWinner && <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-black">✓</span>}
        </span>
      );
    });
  };

  const render3s5t = (balls) => {
     return balls.join(', ');
  }

  return (
    <div className="animate-fade-in py-2">
      {/* TRỰC TIẾP HEADER */}
      {latestDraw && (
        <div className="mb-8 flex items-center gap-2">
          <span className="bg-green-700 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold">TRỰC TIẾP</span>
          <span className="text-gray-400 text-sm">Kỳ vừa xổ ({latestDraw.Draw_ID}):</span>
          <span className="text-white font-bold text-lg">{latestDraw.Result}</span>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* CỘT 1: DỰ ĐOÁN KỲ TỚI */}
        <div className="w-full xl:w-[40%] flex flex-col gap-6 bg-transparent">
          <div className="text-white font-bold text-base uppercase inline-block self-start">
            DỰ ĐOÁN KỲ QUAY TIẾP THEO
          </div>
          
          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-red-500">🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
            <div className="text-gray-500 text-[10px] mb-2">Siêu nổ (1 cặp lộn)</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan2)}
            </div>
          </div>

          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-yellow-500">⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
            <div className="text-gray-500 text-[10px] mb-2">Đột phá (2 cặp lộn)</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan4)}
            </div>
          </div>

          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 10 SỐ 2D</div>
            <div className="text-gray-500 text-[10px] mb-2">Cân bằng vốn</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan10)}
            </div>
          </div>

          <div className="flex flex-col items-start relative">
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 20 SỐ 2D</div>
            <div className="text-gray-500 text-[10px] mb-2">An toàn cao</div>
            <div className="flex flex-wrap gap-1">
              {renderBalls(dan20)}
            </div>
          </div>

          <div className="flex flex-col items-start relative mt-2">
            <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
            </div>
            
            <div className="flex justify-start w-full">
              <div className="flex flex-col items-start text-left mr-8 md:mr-16">
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 3).map(s=>s.number))}</div>
              </div>
              <div className="flex flex-col items-start text-left mr-8 md:mr-16">
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 4).map(s=>s.number))}</div>
              </div>
              <div className="flex flex-col items-start text-left">
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 5).map(s=>s.number))}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT 2: KẾT QUẢ KỲ VỪA XONG */}
        <div className="w-full xl:w-[40%] flex flex-col gap-6 bg-transparent">
          <div className="text-white font-bold text-base uppercase inline-block self-start">
            KẾT QUẢ KỲ QUAY VỪA XONG
          </div>
          
          {historyCheck ? (
            <>
              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-red-500">🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
                <div className="text-gray-500 text-[10px] mb-2">Siêu nổ (1 cặp lộn)</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD2, true, historyCheck.resultHau)}
                </div>
              </div>

              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-yellow-500">⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
                <div className="text-gray-500 text-[10px] mb-2">Đột phá (2 cặp lộn)</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD4, true, historyCheck.resultHau)}
                </div>
              </div>

              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 10 SỐ 2D</div>
                <div className="text-gray-500 text-[10px] mb-2">Cân bằng vốn</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD10, true, historyCheck.resultHau)}
                </div>
              </div>

              <div className="flex flex-col items-start relative">
                <div className="text-white font-bold text-sm flex items-center gap-2 mb-1"><span className="text-orange-500">🔥</span> DÀN 20 SỐ 2D</div>
                <div className="text-gray-500 text-[10px] mb-2">An toàn cao</div>
                <div className="flex flex-wrap gap-1">
                  {renderBalls(historyCheck.pD20, true, historyCheck.resultHau)}
                </div>
              </div>

              <div className="flex flex-col items-start relative mt-2">
                <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
                </div>
                
                <div className="flex justify-start w-full">
                  <div className="flex flex-col items-start text-left mr-8 md:mr-16">
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 3))}</div>
                  </div>
                  <div className="flex flex-col items-start text-left mr-8 md:mr-16">
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 4))}</div>
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 5))}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic mt-8">Chưa có dữ liệu đối chiếu kỳ trước.</div>
          )}
        </div>

        {/* CỘT 3: 10 KỲ QUAY (20%) */}
        <div className="w-full xl:w-[20%] flex flex-col items-end mt-12 xl:mt-0">
          <div className="bg-black border border-blue-500 p-4 w-[250px] shadow-lg">
            <div className="flex flex-col gap-1 text-right">
              {data.slice(0, 10).map((draw, idx) => (
                 <div key={draw.Draw_ID || idx} className="text-white text-sm tracking-wide">
                   Kỳ {draw.Draw_ID ? draw.Draw_ID.slice(-3) : ''}: {draw.Result}
                 </div>
              ))}
              {data.length === 0 && <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};`;

content = content.replace(/const ExecutiveDashboard = \([\s\S]*?const PagePlaceholder = \(/i, newDashboard + '\n\nconst PagePlaceholder = (');

fs.writeFileSync(filePath, content, 'utf8');
