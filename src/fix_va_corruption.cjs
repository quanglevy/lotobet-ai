const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/setIntervàl/g, 'setInterval');
code = code.replace(/cleàrIntervàl/g, 'clearInterval');
code = code.replace(/vàlue/g, 'value');
code = code.replace(/invàlid/g, 'invalid');
code = code.replace(/cànvàs/g, 'canvas');

// And what about "var"?
code = code.replace(/--vàr/g, '--var');
code = code.replace(/vàr\(/g, 'var(');
code = code.replace(/vàriable/g, 'variable');
code = code.replace(/nàvigàtor/g, 'navigator');

// Let's also check for other instances
code = code.replace(/evàluàte/g, 'evaluate');
code = code.replace(/àvàilable/g, 'available');
code = code.replace(/vàlid/g, 'valid');

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed accidental "va" replacements.');
