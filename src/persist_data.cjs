const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add localStorage to useState for rawData
const useStateReplacement = `const [rawData, setRawData] = useState(() => {
    const saved = localStorage.getItem('lotobet_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  // Automatically save to localStorage whenever rawData changes
  useEffect(() => {
    localStorage.setItem('lotobet_data', JSON.stringify(rawData));
  }, [rawData]);`;

code = code.replace(/const \[rawData, setRawData\] = useState\(\[\]\);/, useStateReplacement);

// 2. Add a "LÀM MỚI" button to the header
const clearButtonHTML = `<button 
      onClick={() => {
        if(window.confirm('Bạn có chắc muốn xóa toàn bộ kết quả để nhập lại từ đầu?')) {
          setRawData([]);
          localStorage.removeItem('lotobet_data');
        }
      }}
      className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-red-600 text-white font-bold text-[10px] md:text-xs rounded hover:bg-red-700 transition-colors"
    >
      <Hash size={14} />
      XÓA KẾT QUẢ
    </button>
    <button 
      onClick={() => setShowInputModal(true)}`;

code = code.replace(/<button \s*onClick=\{\(\) => setShowInputModal\(true\)\}/, clearButtonHTML);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Added persistent storage and clear button!");
