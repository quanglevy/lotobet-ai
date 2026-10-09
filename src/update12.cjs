const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newDashboard = `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, historyCheck }) => {
  
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
        <span key={num} className="relative flex items-center justify-center rounded-full border font-bold" 
              style={{ width: width, height: width, fontSize: width===32?'0.9rem':'0.8rem', margin: '2px', borderColor: border, color: color, backgroundColor: bg }}>
          {num}
          {isWinner && <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full flex items-center justify-center font-black" style={{ width: '16px', height: '16px', fontSize: '10px' }}>✓</span>}
        </span>
      );
    });
  };

  const render3s5t = (balls) => {
     return balls.join(', ');
  }

  return (
    <div className="animate-fade-in py-2" style={{ overflowX: 'auto' }}>
      
      {/* 3 COLUMNS CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', minWidth: '1000px', alignItems: 'flex-start' }}>
        
        {/* CỘT 1: DỰ ĐOÁN KỲ TỚI */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase' }}>
            DỰ ĐOÁN KỲ QUAY TIẾP THEO
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#ef4444' }}>🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
            <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Siêu nổ (1 cặp lộn)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {renderBalls(dan2)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#eab308' }}>⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
            <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Đột phá (2 cặp lộn)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {renderBalls(dan4)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f97316' }}>🔥</span> DÀN 10 SỐ 2D</div>
            <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Cân bằng vốn</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {renderBalls(dan10)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f97316' }}>🔥</span> DÀN 20 SỐ 2D</div>
            <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>An toàn cao</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {renderBalls(dan20)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '8px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '16px' }}>
              <span style={{ color: '#facc15' }}>⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
              <div>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 3).map(s=>s.number))}</div>
              </div>
              <div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 4).map(s=>s.number))}</div>
              </div>
              <div>
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(topSingles.slice(0, 5).map(s=>s.number))}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT 2: KẾT QUẢ KỲ VỪA XONG */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase' }}>
            KẾT QUẢ KỲ QUAY VỪA XONG
          </div>
          
          {historyCheck ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#ef4444' }}>🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
                <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Siêu nổ (1 cặp lộn)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {renderBalls(historyCheck.pD2, true, historyCheck.resultHau)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#eab308' }}>⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
                <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Đột phá (2 cặp lộn)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {renderBalls(historyCheck.pD4, true, historyCheck.resultHau)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f97316' }}>🔥</span> DÀN 10 SỐ 2D</div>
                <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>Cân bằng vốn</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {renderBalls(historyCheck.pD10, true, historyCheck.resultHau)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#f97316' }}>🔥</span> DÀN 20 SỐ 2D</div>
                <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>An toàn cao</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {renderBalls(historyCheck.pD20, true, historyCheck.resultHau)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '8px' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '16px' }}>
                  <span style={{ color: '#facc15' }}>⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
                  <div>
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 3))}</div>
                  </div>
                  <div>
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 4))}</div>
                  </div>
                  <div>
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                    <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.15em" }}>{render3s5t(historyCheck.p5Tinh.slice(0, 5))}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '2rem' }}>Chưa có dữ liệu đối chiếu kỳ trước.</div>
          )}
        </div>

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
    </div>
  );
};`;

content = content.replace(/const ExecutiveDashboard = \([\s\S]*?const PagePlaceholder = \(/i, newDashboard + '\n\nconst PagePlaceholder = (');

fs.writeFileSync(filePath, content, 'utf8');
