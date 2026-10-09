const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove Cột 3 from ExecutiveDashboard
const regexCol3 = /\{\/\* CỘT 3: 10 KỲ QUAY \*\/\}[\s\S]*?<div className="w-full xl:w-\[20%\] flex flex-col items-start xl:items-end">[\s\S]*?<div style=\{\{ backgroundColor: 'black', border: '1px solid #3b82f6'[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

if (regexCol3.test(c)) {
    c = c.replace(regexCol3, "");
    console.log("Removed Cột 3");
} else {
    console.log("Could not find Cột 3");
}

// 2. Adjust Cột 1 and Cột 2 widths from 40% to 50%
c = c.replace(/className="w-full xl:w-\[40%\] flex flex-col gap-6"/g, 'className="w-full lg:w-1/2 flex flex-col gap-6"');

// 3. Inject History Box into Header
// In App component, we have access to rawData and handleDeleteResult.
const historyBox = `
            <div className="mt-4 xl:mt-0 xl:ml-8" style={{ backgroundColor: 'black', border: '1px solid #3b82f6', padding: '1rem', width: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
                {rawData.slice(0, 10).map((draw, idx) => (
                   <div key={draw.Draw_ID || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em', padding: '2px 0' }}>
                    <span>Kỳ {draw.Draw_ID ? draw.Draw_ID.slice(-3) : ''}: {draw.Result}</span>
                    <button 
                       onClick={() => handleDeleteResult(draw.Draw_ID)}
                       style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 4px', fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1' }}
                       title="Xóa kỳ này"
                    >
                      ×
                    </button>
                   </div>
                ))}
                {rawData.length === 0 && <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Chưa có dữ liệu</div>}
              </div>
            </div>`;

// Find the end of the header's right container
const headerRightRegex = /<Plus size=\{20\} className="hidden sm:block" \/>\s*CẬP NHẬT KẾT QUẢ\s*<\/button>\s*<\/div>\s*<\/div>/;
if (headerRightRegex.test(c)) {
    const match = c.match(headerRightRegex)[0];
    c = c.replace(headerRightRegex, match.replace("</div>\n          </div>", "</div>\n" + historyBox + "\n          </div>"));
    console.log("Injected History Box into header");
} else {
    console.log("Could not find header right section");
}

fs.writeFileSync('src/App.jsx', c, 'utf8');
