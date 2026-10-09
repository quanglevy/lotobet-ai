const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/text-\[var\(--accent-primary\)\] text-3xl tracking-\[0\.2em\] sm:tracking-\[0\.5em\] drop-shadow-md/g, "text-white text-3xl sm:text-4xl tracking-[0.2em] sm:tracking-[0.5em] drop-shadow-md");

fs.writeFileSync('src/App.jsx', c, 'utf8');
