const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/\\`Dàn 10 Số \(Kỳ \\\${hist\.drawId\.slice\(-3\)}\)\\`/g, "`Dàn 10 Số (Kỳ ${hist.drawId.slice(-3)})`");
c = c.replace(/\\`Dàn 20 Số \(Kỳ \\\${hist\.drawId\.slice\(-3\)}\)\\`/g, "`Dàn 20 Số (Kỳ ${hist.drawId.slice(-3)})`");
c = c.replace(/\\`Đã copy \\\${type} thành công!\\`/g, "`Đã copy ${type} thành công!`");
c = c.replace(/\\\$\{/g, "${");

fs.writeFileSync('src/App.jsx', c, 'utf8');
