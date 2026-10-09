const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove the localStorage initialization
const regexState = /const \[rawData, setRawData\] = useState\(\(\) => \{[\s\S]*?return \[\];\s*\}\);/;
c = c.replace(regexState, "const [rawData, setRawData] = useState([]);");

// 2. Remove the useEffect that saves to localStorage
const regexEffect = /useEffect\(\(\) => \{\s*localStorage\.setItem\('lotobet_raw_data', JSON\.stringify\(rawData\)\);\s*\}, \[rawData\]\);/;
c = c.replace(regexEffect, "");

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log("Successfully removed localStorage persistence.");
