const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

// Inject the KU Bạc Nhớ engine into findBestTouches
const regex = /\/\/ 3\. Kết hợp Bạc Bệt \(Kỳ trước liền kề\)/;

const bacNhoLogic = `// 3. BỘ LỌC BẠC NHỚ KU CASINO (Theo Bí Kíp Sếp Cung Cấp)
    const bacNhoTouches = [];
    const lastTien = lastDraw.substring(0, 2);
    const lastHau = lastDraw.substring(3, 5);
    const lastTargetStr = target === "TIEN" ? lastTien : lastHau;

    // Quy luật 1: Đề về Kép -> Kỳ sau nhả Bóng Dương của Kép hoặc Chạm 0/5
    if (lastTargetStr[0] === lastTargetStr[1]) {
        bacNhoTouches.push(getBongDuong(lastTargetStr[0]));
        bacNhoTouches.push('0');
        bacNhoTouches.push('5');
    }

    // Quy luật 2: Cầu Kẹp (A B A) -> Nhả con ở giữa (B)
    if (lastDraw[0] === lastDraw[2]) bacNhoTouches.push(lastDraw[1]);
    if (lastDraw[1] === lastDraw[3]) bacNhoTouches.push(lastDraw[2]);
    if (lastDraw[2] === lastDraw[4]) bacNhoTouches.push(lastDraw[3]);

    // Quy luật 3: Tổng 10 -> Gọi chạm 0, 5, 1, 6
    if (parseInt(lastTargetStr[0]) + parseInt(lastTargetStr[1]) === 10) {
        bacNhoTouches.push('1'); bacNhoTouches.push('6');
    }

    // Quy luật 4: Các cặp số huyền thoại KU gọi nhau
    if (lastTargetStr === '68' || lastTargetStr === '86') { bacNhoTouches.push('6'); bacNhoTouches.push('8'); }
    if (lastTargetStr === '79' || lastTargetStr === '97') { bacNhoTouches.push('3'); bacNhoTouches.push('8'); }
    if (lastTargetStr === '00' || lastTargetStr === '99') { bacNhoTouches.push('0'); bacNhoTouches.push('9'); }

    // Bơm điểm Bạc Nhớ cực mạnh (Đè lên thuật toán thông thường)
    bacNhoTouches.forEach(t => {
        if (t && touchFreq[t] !== undefined) {
            touchFreq[t] += 5; // Trọng số tuyệt đối
        }
    });

    // 4. Kết hợp Bạc Bệt (Kỳ trước liền kề)`;

code = code.replace(regex, bacNhoLogic);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully injected KU Bac Nho Engine!');
