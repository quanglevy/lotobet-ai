const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add handleDeleteResult to ExecutiveDashboard props
content = content.replace(
  /const ExecutiveDashboard = \(\{ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = \[\], txcl, handleCopy \}\) => \{/,
  'const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, historyCheck, historyList3 = [], txcl, handleCopy, handleDeleteResult }) => {'
);

// 2. Pass handleDeleteResult to ExecutiveDashboard from App
content = content.replace(
  /<ExecutiveDashboard data=\{rawData\} dan2=\{dan2\} dan4=\{dan4\} dan10=\{dan10\} dan20=\{dan20\} topSingles=\{topSingles\} handleCopy=\{handleCopy\} historyCheck=\{historyCheck\} historyList3=\{historyList3\} txcl=\{txcl\} \/>/,
  '<ExecutiveDashboard data={rawData} dan2={dan2} dan4={dan4} dan10={dan10} dan20={dan20} topSingles={topSingles} handleCopy={handleCopy} historyCheck={historyCheck} historyList3={historyList3} txcl={txcl} handleDeleteResult={handleDeleteResult} />'
);

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log("Success");
