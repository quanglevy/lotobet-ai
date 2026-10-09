const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Patch useState localStorage
code = code.replace(
  /const \[rawData, setRawData\] = useState\(\(\) => \{\s*const saved = localStorage\.getItem\('lotobet_data'\);\s*if \(saved\) \{\s*try \{ return JSON\.parse\(saved\); \} catch \(e\) \{ return \[\]; \}\s*\}\s*return \[\];\s*\}\);/m,
  `const [rawData, setRawData] = useState(() => {
    try {
      const saved = localStorage.getItem('lotobet_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('localStorage access denied or failed:', e);
    }
    return [];
  });`
);

// Patch useEffect localStorage
code = code.replace(
  /\/\/ Automatically save to localStorage whenever rawData changes\s*useEffect\(\(\) => \{\s*localStorage\.setItem\('lotobet_data', JSON\.stringify\(rawData\)\);\s*\}, \[rawData\]\);/m,
  `// Automatically save to localStorage whenever rawData changes
  useEffect(() => {
    try {
      localStorage.setItem('lotobet_data', JSON.stringify(rawData));
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }
  }, [rawData]);`
);

// Patch removeItem
code = code.replace(
  /setRawData\(\[\]\);\s*localStorage\.removeItem\('lotobet_data'\);/m,
  `setRawData([]);\n          try { localStorage.removeItem('lotobet_data'); } catch(e) {}`
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('App.jsx patched to safely handle localStorage!');
