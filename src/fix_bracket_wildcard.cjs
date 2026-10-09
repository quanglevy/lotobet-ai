const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// The syntax error is at line 346: `{renderCopyButton(hist.pD10, \`Dan 10 S? (K? \${hist.drawId.slice(-3)}`
// We need to replace it with: `{renderCopyButton(hist.pD10, \`Dàn 10 Số (Kỳ \${hist.drawId.slice(-3)})\`)}`

code = code.replace(/\{renderCopyButton\(hist\.pD10, \`Dan 10 S. \(K. \$\{hist\.drawId\.slice\(-3\)\}\s*<\/div>/g, '{renderCopyButton(hist.pD10, `Dàn 10 Số (Kỳ ${hist.drawId.slice(-3)})`)}\n                       </div>');

// In case the `}` is missing on the same line, let's just do a more brutal replace for that specific block
const fixBlock1 = /\{renderCopyButton\(hist\.pD10, \`Dan 10 S. \(K. \$\{hist\.drawId\.slice\(-3\)\}/g;
code = code.replace(fixBlock1, '{renderCopyButton(hist.pD10, `Dàn 10 Số (Kỳ ${hist.drawId.slice(-3)})`)}');

const fixBlock2 = /\{renderCopyButton\(hist\.pD36, \`Dan 36 S. \(K. \$\{hist\.drawId\.slice\(-3\)\}\)\`\)\}/g;
code = code.replace(fixBlock2, '{renderCopyButton(hist.pD36, `Dàn 36 Số (Kỳ ${hist.drawId.slice(-3)})`)}');


fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed syntax error via regex wildcards.');
