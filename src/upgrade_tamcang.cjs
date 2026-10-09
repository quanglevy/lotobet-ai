const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /\/\/ Bơm điểm Bạc Nhớ cực mạnh/;
const tamCangRule = `// Quy luật Tâm Càng (Bạc Nhớ Tâm Càng Trực Tiếp)
    const tamCang = lastDraw[2];
    const tamCangMap = {
        '0': ['8'], '1': ['4'], '2': ['3'], '3': ['0', '9'],
        '4': ['7'], '5': ['1'], '6': ['5'], '7': ['9'],
        '8': ['3'], '9': ['2']
    };
    if (tamCangMap[tamCang]) {
        tamCangMap[tamCang].forEach(t => bacNhoTouches.push(t));
    }

    // Bơm điểm Bạc Nhớ cực mạnh`;

code = code.replace(regex, tamCangRule);
fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully injected Tam Cang rule!');
