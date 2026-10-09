const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Use exact string indexOf to avoid regex escaping hell
const badString = "{renderCopyButton(hist.pD10, `Dan 10 S? (K? ${hist.drawId.slice(-3)}";
if (code.includes(badString)) {
    code = code.replace(badString, "{renderCopyButton(hist.pD10, `Dàn 10 Số (Kỳ ${hist.drawId.slice(-3)})`)}");
}

const badString2 = "{renderCopyButton(hist.pD36, `Dan 36 S? (K? ${hist.drawId.slice(-3)})`)}";
if (code.includes(badString2)) {
    code = code.replace(badString2, "{renderCopyButton(hist.pD36, `Dàn 36 Số (Kỳ ${hist.drawId.slice(-3)})`)}");
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed syntax error via Node.');
