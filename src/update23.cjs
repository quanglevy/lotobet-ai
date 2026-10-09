const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldFuncRegex = /const renderTXCLHit = \(prediction, actual\) => \{[\s\S]*?return \([\s\S]*?\}\s*\}\s*>\s*\{prediction\} \{isHit && <span style=\{\{ fontSize: "14px" \}\}>✓<\/span>\}\s*<\/div>\s*\);\s*\};/;

const newFunc = `const renderTXCLHit = (prediction, actual) => {
    const isHit = prediction === actual;
    return (
      <div style={{ 
         backgroundColor: isHit ? "#10b981" : "rgba(239, 68, 68, 0.2)", 
         color: isHit ? "white" : "#ef4444",
         padding: "0.5rem 1rem", 
         borderRadius: "4px", 
         fontWeight: "bold", 
         fontSize: "1.25rem",
         display: "flex",
         alignItems: "center",
         gap: "6px",
         border: isHit ? "none" : "1px solid rgba(239, 68, 68, 0.5)"
      }}>
        <span style={{ textDecoration: isHit ? "none" : "line-through" }}>{prediction}</span> 
        <span style={{ fontSize: "16px", fontWeight: "900" }}>{isHit ? "✓" : "✗"}</span>
      </div>
    );
  };`;

c = c.replace(oldFuncRegex, newFunc);
fs.writeFileSync('src/App.jsx', c, 'utf8');
