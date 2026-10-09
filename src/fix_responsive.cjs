const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix ExecutiveDashboard Layout
c = c.replace(
  /<div style=\{\{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' \}\}>/g,
  '<div className="p-2 md:p-8 flex flex-col gap-8 w-full overflow-hidden">'
);

c = c.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'space-between', gap: '2rem' \}\}>/g,
  '<div className="flex flex-col xl:flex-row justify-between gap-8">'
);

c = c.replace(
  /<div style=\{\{ width: '40%', display: 'flex', flexDirection: 'column', gap: '1\.5rem' \}\}>/g,
  '<div className="w-full xl:w-[40%] flex flex-col gap-6">'
);

c = c.replace(
  /<div style=\{\{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' \}\}>/g,
  '<div className="w-full xl:w-[20%] flex flex-col items-start xl:items-end">'
);

// 2. Fix Lịch sử dàn minWidth 1000px
c = c.replace(
  /<div style=\{\{ marginTop: '4rem', minWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem' \}\}>/g,
  '<div className="mt-8 w-full flex flex-col gap-4 overflow-x-auto">'
);

// 3. Fix App Header layout for mobile
const oldHeader = `<header className="top-header">
          <div className="flex items-center gap-4">
            {rawData[0] && (
              <div className="flex items-center gap-4">
                <span className="text-lg text-muted">Kỳ vừa xổ ({rawData[0].Draw_ID}):</span>
                <span className="font-bold text-[var(--accent-primary)] text-3xl tracking-[0.5em] drop-shadow-md">{rawData[0].Result}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-[#1a1f35] p-3 rounded-lg border border-[var(--border-color)]">
              <span className="text-muted uppercase font-bold text-sm">Thời gian cược kỳ tới:</span>
              <span className={\`font-mono text-3xl font-bold \${timeLeft < 30 ? 'text-danger animate-pulse' : 'text-success'}\`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                   if(window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử không?')) {
                       setRawData([]);
                       localStorage.removeItem('lotobet_raw_data');
                   }
                }}
                className="flex items-center gap-2 px-4 py-4 bg-transparent border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-lg rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors"
              >
                LÀM MỚI
              </button>
              <button 
                onClick={() => setShowInputModal(true)}
                className="flex items-center gap-2 px-6 py-4 bg-[var(--accent-primary)] text-black font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,242,254,0.4)]"
              >
                <Plus size={24} />
                CẬP NHẬT KẾT QUẢ
              </button>
            </div>
          </div>
        </header>`;

const newHeader = `<header className="flex flex-col xl:flex-row justify-between items-center gap-4 p-4 border-b border-[#1f2937] bg-[#0f1225] w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-center xl:justify-start">
            {rawData[0] && (
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <span className="text-sm sm:text-lg text-muted">Kỳ vừa xổ ({rawData[0].Draw_ID}):</span>
                <span className="font-bold text-[var(--accent-primary)] text-2xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.5em] drop-shadow-md">{rawData[0].Result}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-center xl:justify-end">
            <div className="flex items-center gap-2 sm:gap-3 bg-[#1a1f35] p-2 sm:p-3 rounded-lg border border-[var(--border-color)]">
              <span className="text-muted uppercase font-bold text-xs sm:text-sm">Thời gian:</span>
              <span className={\`font-mono text-xl sm:text-3xl font-bold \${timeLeft < 30 ? 'text-danger animate-pulse' : 'text-success'}\`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
              <button 
                onClick={() => {
                   if(window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử không?')) {
                       setRawData([]);
                       localStorage.removeItem('lotobet_raw_data');
                   }
                }}
                className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-4 bg-transparent border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-sm sm:text-lg rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors whitespace-nowrap"
              >
                LÀM MỚI
              </button>
              <button 
                onClick={() => setShowInputModal(true)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-4 bg-[var(--accent-primary)] text-black font-bold text-sm sm:text-lg rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,242,254,0.4)] whitespace-nowrap"
              >
                <Plus size={20} className="hidden sm:block" />
                CẬP NHẬT KẾT QUẢ
              </button>
            </div>
          </div>
        </header>`;

c = c.replace(oldHeader, newHeader);

// 4. Update the input modal to be fully responsive
const oldModal = `<div className="card w-[90%] max-w-[500px] border border-[var(--accent-primary)] shadow-[0_0_30px_rgba(0,242,254,0.2)] p-6 md:p-8">`;
const newModal = `<div className="card w-[95%] sm:w-[90%] max-w-[500px] border border-[var(--accent-primary)] shadow-[0_0_30px_rgba(0,242,254,0.2)] p-4 sm:p-6 md:p-8">`;
c = c.replace(oldModal, newModal);

fs.writeFileSync('src/App.jsx', c, 'utf8');
