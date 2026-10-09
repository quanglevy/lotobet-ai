const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /const renderBalls = \(balls, isHistory = false, resultHau = null\) => \{[\s\S]*?\};\s*const render3s5t/m;

const newRender = `const renderBalls = (balls, isHistory = false, resultHau = null) => {
    return balls.map(s => {
      const num = typeof s === 'object' ? s.number : s;
      const isWinner = isHistory && resultHau && num === resultHau;
      
      let color = '#00f2fe';
      if (balls.length > 4 && balls.length <= 10) color = '#ef4444';
      if (balls.length > 10) color = '#10b981';

      if (isWinner) {
        return (
          <span key={num} style={{ 
            backgroundColor: '#10b981', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '1rem', 
            padding: '2px 6px',
            marginRight: '14px',
            marginBottom: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            borderRadius: '4px'
          }}>
            {num}<span style={{ fontSize: '12px', fontWeight: '900' }}>✓</span>
          </span>
        );
      }

      return (
        <span key={num} style={{ 
            color: color, 
            fontWeight: 'bold', 
            fontSize: '1rem',
            marginRight: '14px',
            marginBottom: '6px',
            padding: '2px 0',
            display: 'inline-block'
        }}>
          {num}
        </span>
      );
    });
  };

  const render3s5t`;

content = content.replace(regex, newRender);

fs.writeFileSync('src/App.jsx', content, 'utf8');
