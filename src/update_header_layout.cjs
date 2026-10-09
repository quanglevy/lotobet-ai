const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /<header className="flex flex-col xl:flex-row justify-between items-center gap-4 p-4 border-b border-\[#1f2937\] bg-\[#0f1225\] w-full">[\s\S]*?<\/header>/;

const newHeader = `<header className="flex flex-col md:flex-row justify-between md:items-start lg:items-center gap-6 p-4 border-b border-[#1f2937] bg-[#0f1225] w-full">
  <div className="flex-1 flex flex-col items-center justify-center gap-4">
    {rawData[0] && (
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <span className="text-sm sm:text-lg text-muted">Kỳ vừa xổ ({rawData[0].Draw_ID}):</span>
        <span className="font-bold text-[var(--accent-primary)] text-2xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.5em] drop-shadow-md">{rawData[0].Result}</span>
      </div>
    )}

    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center gap-2 sm:gap-3 bg-[#1a1f35] p-2 sm:p-3 rounded-lg border border-[var(--border-color)]">
        <span className="text-muted font-bold text-sm">Thời gian:</span>
        <span className={\`font-mono text-xl sm:text-3xl font-bold \${timeLeft < 30 ? 'text-danger animate-pulse' : 'text-success'}\`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      <div className="flex gap-2 justify-center">
        <button 
          onClick={() => {
             if(window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử không?')) {
                 setRawData([]);
             }
          }}
          className="flex items-center justify-center gap-1 px-4 py-2 sm:py-3 bg-transparent border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-sm sm:text-lg rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors whitespace-nowrap"
        >
          LÀM MỚI
        </button>
        <button 
          onClick={() => setShowInputModal(true)}
          className="flex items-center justify-center gap-1 px-4 py-2 sm:py-3 bg-[var(--accent-primary)] text-black font-bold text-sm sm:text-lg rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,242,254,0.4)] whitespace-nowrap"
        >
          <Plus size={20} className="hidden sm:block" />
          CẬP NHẬT KẾT QUẢ
        </button>
      </div>
    </div>
  </div>

  <div className="flex-shrink-0 flex justify-center md:justify-end">
    <div style={{ backgroundColor: 'black', border: '1px solid #3b82f6', padding: '1rem', width: '250px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
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
