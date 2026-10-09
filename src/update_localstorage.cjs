const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add localStorage hook to useState
const oldState = "const [rawData, setRawData] = useState([]);";
const newState = `const [rawData, setRawData] = useState(() => {
    try {
      const saved = localStorage.getItem('lotobet_raw_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('lotobet_raw_data', JSON.stringify(rawData));
  }, [rawData]);`;

if (content.includes(oldState)) {
    content = content.replace(oldState, newState);
    console.log("Successfully replaced useState.");
} else {
    console.log("oldState not found, check syntax.");
}

// 2. Add "LÀM MỚI" button next to "CẬP NHẬT KẾT QUẢ"
const oldButton = `<button 
                onClick={() => setShowInputModal(true)}
                className="flex items-center gap-2 px-6 py-4 bg-[var(--accent-primary)] text-black font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,242,254,0.4)]"
              >
                <Plus size={24} />
                CẬP NHẬT KẾT QUẢ
              </button>`;

const newButton = `<button 
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
              </button>`;

if (content.includes(oldButton)) {
    content = content.replace(oldButton, newButton);
    console.log("Successfully replaced buttons.");
} else {
    console.log("oldButton not found. Trying regex...");
    const btnRegex = /<button[\s\S]*?setShowInputModal\(true\)[\s\S]*?CẬP NHẬT KẾT QUẢ\s*<\/button>/;
    if (btnRegex.test(content)) {
        content = content.replace(btnRegex, newButton);
        console.log("Successfully replaced buttons via regex.");
    } else {
        console.log("Could not find button block.");
    }
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
