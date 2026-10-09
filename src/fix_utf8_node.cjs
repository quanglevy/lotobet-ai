const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

const correctBlock = `          {/* 3 SỐ 5 TINH */}
          <div className="flex flex-col items-start relative mt-4">
            <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)
            </div>
            
            <div className="flex justify-start" style={{ width: "100%" }}>
              <div className="flex flex-col items-center text-center" style={{ marginRight: "3rem" }}>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 3 SỐ</div>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1rem", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>{topSingles.slice(0, 3).map(s => s.number).join(', ')}</div>
              </div>

              <div className="flex flex-col items-center text-center" style={{ marginRight: "3rem" }}>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 4 SỐ</div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "1rem", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>{topSingles.slice(0, 4).map(s => s.number).join(', ')}</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.5rem" }}>DÀN 5 SỐ</div>
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1rem", marginBottom: "0.5rem", letterSpacing: "0.15em" }}>{topSingles.slice(0, 5).map(s => s.number).join(', ')}</div>
              </div>
            </div>
          </div>

          {/* CHẠM`;

content = content.replace(/\{\/\* 3 S. 5[\s\S]*?\{\/\* CH.M/i, correctBlock);

// Ghi file kèm BOM để đảm bảo UTF-8 trên Windows
fs.writeFileSync('src/App.jsx', '\\ufeff' + content.replace(/^\\ufeff/, ''), 'utf-8');
