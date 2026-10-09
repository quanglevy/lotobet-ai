const fs = require('fs');

try {
  let code = fs.readFileSync('src/App.jsx', 'utf8');

  // Replace all diamonds back to question marks, then we will put the ONE legitimate diamond back
  code = code.split('💎').join('?');

  // Put the specific emoji back safely
  code = code.split(`<span style={{ color: '#8b5cf6' }}>?</span>`).join(`<span style={{ color: '#8b5cf6' }}>💎</span>`);

  // Same for other emojis that were replaced manually and might have corrupted
  // I replaced '???' -> '🛡️', '??' -> '🎯' ... 
  // Let's just fix the ternary operator and optional chainers first
  
  fs.writeFileSync('src/App.jsx', code, 'utf8');
  console.log('Successfully reverted accidental ? replacements.');
} catch (e) {
  console.error("Error repairing App.jsx", e);
}
