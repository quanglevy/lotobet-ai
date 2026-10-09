const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update render3s5t definition
const oldRender3s5t = /const render3s5t = \(balls\) => \{\s*return balls\.join\(', '\);\s*\}/m;
const newRender3s5t = `const render3s5t = (balls, isHistory = false, fullResult = null) => {
    if (!isHistory || !fullResult) return balls.join(', ');
    
    // Tiền Nhị and Hậu Nhị digits only
    const resultDigits = fullResult.substring(0,2) + fullResult.substring(3,5);
    
    return balls.map((num, idx) => {
      const isWinner = resultDigits.includes(num.toString());
      
      const displayElem = isWinner ? (
        <span key={num} style={{ 
          backgroundColor: '#10b981', 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: '1rem', 
          padding: '2px 6px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          letterSpacing: 'normal'
        }}>
          {num}<span style={{ fontSize: '12px', fontWeight: '900' }}>✓</span>
        </span>
      ) : (
        <span key={num}>{num}</span>
      );

      return (
        <React.Fragment key={num}>
          {displayElem}
          {idx < balls.length - 1 && <span style={{ marginRight: '6px' }}>,</span>}
        </React.Fragment>
      );
    });
  }`;

c = c.replace(oldRender3s5t, newRender3s5t);

// 2. Update calls in Cột 2 (historyCheck)
c = c.replace(/render3s5t\(historyCheck\.p5Tinh\.slice\(0, 3\)\)/, 'render3s5t(historyCheck.p5Tinh.slice(0, 3), true, historyCheck.fullResult)');
c = c.replace(/render3s5t\(historyCheck\.p5Tinh\.slice\(0, 4\)\)/, 'render3s5t(historyCheck.p5Tinh.slice(0, 4), true, historyCheck.fullResult)');
c = c.replace(/render3s5t\(historyCheck\.p5Tinh\.slice\(0, 5\)\)/, 'render3s5t(historyCheck.p5Tinh.slice(0, 5), true, historyCheck.fullResult)');

fs.writeFileSync('src/App.jsx', c, 'utf8');
