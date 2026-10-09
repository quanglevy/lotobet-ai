const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove the absolute history box from the header
const regexHeaderHistory = /<div className="absolute top-\[100%\] right-2 md:right-6 z-50 mt-1 hidden md:block">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
c = c.replace(regexHeaderHistory, "");

// 2. Adjust Cột 1 width
c = c.replace(
    /\{\/\* CỘT 1: DỰ ĐOÁN \*\/\}\s*<div className="w-full lg:w-1\/2 flex flex-col gap-6">/,
    `{/* CỘT 1: DỰ ĐOÁN */}
          <div className="w-full xl:w-[40%] flex flex-col gap-6">`
);

// 3. Adjust Cột 2 width
c = c.replace(
    /\{\/\* CỘT 2: KẾT QUẢ KỲ TRƯỚC \*\/\}\s*<div className="w-full lg:w-1\/2 flex flex-col gap-6">/,
    `{/* CỘT 2: KẾT QUẢ KỲ TRƯỚC */}
          <div className="w-full xl:w-[40%] flex flex-col gap-6">`
);

// 4. Inject Cột 3 (History) after Cột 2
// Find the end of Cột 2. It ends right before {/* LỊCH SỬ 3 KỲ QUAY (DÀN 10 & 20) */}
// But Cột 2 is inside a flex wrapper that wraps Cột 1 and Cột 2.
// Let's locate the exact injection point.
const targetStr = "          {/* LỊCH SỬ 3 KỲ QUAY (DÀN 10 & 20) */}";

const col3Code = `
        {/* CỘT 3: 10 KỲ QUAY */}
        <div className="w-full xl:w-[20%] flex flex-col items-start xl:items-end mt-8 xl:mt-0">
          <div style={{ backgroundColor: 'black', border: '1px solid #3b82f6', padding: '1rem', width: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
              {data.slice(0, 10).map((draw, idx) => (
                 <div key={draw.Draw_ID || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em', padding: '4px 0' }}>
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
              {data.length === 0 && <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Chưa có dữ liệu</div>}
            </div>
          </div>
        </div>

      </div>

`;

// First we need to replace the `</div>\n\n      {/* LỊCH SỬ 3 KỲ QUAY` closing div of the flex row.
// Let's replace:
//        </div>
//
//      {/* LỊCH SỬ 3 KỲ QUAY (DÀN 10 & 20) */}
const regexInjection = /\s*<\/div>\s*\{\/\* LỊCH SỬ 3 KỲ QUAY/;
if (regexInjection.test(c)) {
    c = c.replace(regexInjection, "\n" + col3Code + "      {/* LỊCH SỬ 3 KỲ QUAY");
    console.log("Injected Col 3");
} else {
    console.log("Could not find injection point");
}

fs.writeFileSync('src/App.jsx', c, 'utf8');
