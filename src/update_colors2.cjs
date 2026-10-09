const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace the specific line in renderBalls
code = code.replace(
  /color: isHit \? '#10b981' : \(small \? '#10b981' : '#06b6d4'\),/g,
  "color: isHit ? '#ef4444' : (small ? '#06b6d4' : '#06b6d4')," // Make all non-hits cyan/default, hits RED
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Updated renderBalls color!");
