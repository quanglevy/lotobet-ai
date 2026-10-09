const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add handleDeleteResult function
const handleDeleteResult = `  const handleDeleteResult = (drawId) => {
    setRawData(prev => prev.filter(d => d.Draw_ID !== drawId));
  };
`;
content = content.replace(
  /const handleAddNewResult = \(\) => \{/,
  handleDeleteResult + '\n  const handleAddNewResult = () => {'
);

// 2. Modify the render logic in Cột 3
const oldRender = `{data.slice(0, 10).map((draw, idx) => (
                   <div key={draw.Draw_ID || idx} style={{ color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em' }}>
                    Kỳ {draw.Draw_ID ? draw.Draw_ID.slice(-3) : ''}: {draw.Result}
                   </div>
                ))}`;

const newRender = `{data.slice(0, 10).map((draw, idx) => (
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
                ))}`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log("Success");
