const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Update renderBalls hit colors
code = code.replace(
  /color: isHit \? '#10b981' : '#06b6d4',/g, 
  "color: isHit ? '#ef4444' : '#06b6d4',"
);
code = code.replace(
  /backgroundColor: isHit \? 'rgba\(16, 185, 129, 0\.15\)' : 'transparent',/g,
  "backgroundColor: isHit ? 'rgba(239, 68, 68, 0.15)' : 'transparent',"
);

// Update renderSingles hit colors
code = code.replace(
  /color: isHit \? '#10b981' : '#facc15',/g,
  "color: isHit ? '#ef4444' : '#facc15',"
);

// Update renderTXCLHit colors (Red for hit, Gray for miss)
code = code.replace(
  /backgroundColor: isHit \? "#10b981" : "rgba\(239, 68, 68, 0\.2\)",/g,
  'backgroundColor: isHit ? "#ef4444" : "rgba(107, 114, 128, 0.2)",'
);
code = code.replace(
  /color: isHit \? "white" : "#ef4444",/g,
  'color: isHit ? "white" : "#6b7280",'
);
code = code.replace(
  /border: isHit \? "none" : "1px solid rgba\(239, 68, 68, 0\.5\)"/g,
  'border: isHit ? "none" : "1px solid rgba(107, 114, 128, 0.5)"'
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Updated colors to RED!");
