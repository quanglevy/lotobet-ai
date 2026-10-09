const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /\{data\.slice\(0, 10\)\.map\(\(draw, idx\) => \(\s*<div key=\{draw\.Draw_ID \|\| idx\} style=\{\{\s*color:\s*'white',\s*fontSize:\s*'0\.875rem',\s*letterSpacing:\s*'0\.025em'\s*\}\}>\s*Kỳ \{draw\.Draw_ID \? draw\.Draw_ID\.slice\(-3\) : ''\}: \{draw\.Result\}\s*<\/div>\s*\)\)\}/;

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

if (regex.test(content)) {
    content = content.replace(regex, newRender);
    fs.writeFileSync('src/App.jsx', content, 'utf8');
    console.log("Replaced successfully via regex.");
} else {
    console.log("Regex not found. Attempting string split fallback.");
    const parts = content.split('{data.slice(0, 10).map((draw, idx) => (');
    if (parts.length > 1) {
        const tail = parts[1].split('))}');
        if (tail.length > 1) {
             const before = parts[0];
             const after = "}" + tail.slice(1).join('))}');
             const finalContent = before + newRender + "\n                " + after;
             fs.writeFileSync('src/App.jsx', finalContent, 'utf8');
             console.log("Replaced via fallback.");
        } else {
             console.log("Tail not found.");
        }
    } else {
        console.log("Split part not found.");
    }
}
