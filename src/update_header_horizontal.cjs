const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /<header className="relative flex justify-center p-4 border-b border-\[#1f2937\] bg-\[#0f1225\] w-full min-h-\[220px\]">[\s\S]*?<\/header>/;

const newHeader = `<header className="relative flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-3 border-b border-[#1f2937] bg-[#0f1225] w-full gap-4 md:gap-0">
  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
    {rawData[0] && (
      <>
        <span className="px-2 py-0.5 bg-[#064e3b] text-[#34d399] text-[10px] md:text-xs font-bold rounded-full border border-[#047857]">TRỰC TIẾP</span>
        <span className="text-gray-400 text-xs md:text-sm">Kỳ vừa xổ ({rawData[0].Draw_ID}):</span>
        <span className="font-bold text-white text-lg md:text-xl tracking-widest">{rawData[0].Result}</span>
      </>
    )}
  </div>

  <div className="flex items-center gap-3 md:gap-4">
    <div className="flex items-center gap-1 md:gap-2">
      <span className="text-gray-400 text-[10px] md:text-xs">Thời gian cược kỳ tới:</span>
      <span className={\`font-mono text-sm md:text-base font-bold \${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-[#34d399]'}\`}>
        {formatTime(timeLeft)}
      </span>
    </div>
    
    <button 
      onClick={() => setShowInputModal(true)}
      className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-white text-black font-bold text-[10px] md:text-xs rounded hover:bg-gray-200 transition-colors"
    >
      <Plus size={14} />
      CẬP NHẬT KẾT QUẢ
    </button>
  </div>

  <div className="absolute top-[100%] right-2 md:right-6 z-50 mt-1 hidden md:block">
    <div style={{ backgroundColor: 'black', border: '1px solid #3b82f6', padding: '1rem', width: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
        {rawData.slice(0, 10).map((draw, idx) => (
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
        {rawData.length === 0 && <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Chưa có dữ liệu</div>}
      </div>
    </div>
  </div>
</header>`;

if (regex.test(c)) {
    c = c.replace(regex, newHeader);
    fs.writeFileSync('src/App.jsx', c, 'utf8');
    console.log("Header updated successfully.");
} else {
    console.log("Could not find the header to replace.");
}
