const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const analyzeSingleDigits = \(data\) => \{[\s\S]*?return Object\.values\(stats\)\.sort\(\(a, b\) => b\.score - a\.score\);\n\};/m;

const newCode = `export const analyzeSingleDigits = (data) => {
    if (data.length === 0) return [];
    const ascData = [...data].reverse();
    const stats = {};
    for (let i = 0; i < 10; i++) {
        stats[i.toString()] = { number: i.toString(), score: 0, reason: [], countAll: 0 };
    }
    if (ascData.length === 0) return Object.values(stats);

    const addScore = (numStr, pts, rsn) => {
        if (stats[numStr]) {
            stats[numStr].score += pts;
            if (!stats[numStr].reason.includes(rsn)) stats[numStr].reason.push(rsn);
        }
    };

    const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
    const bongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d]);

    // =========================================================================
    // --- SIÊU THUẬT TOÁN: TỔNG KỀ VÒNG TRÒN (CIRCULAR ADJACENT SUMS) ---
    // Mục tiêu: Bắt trúng 3-4 số trong dàn 5 tinh. Tuyệt chiêu chống bẻ cầu.
    // =========================================================================

    // 1. TỔNG KỀ VÒNG TRÒN CỦA KỲ GẦN NHẤT
    // Phân tích ma trận quay vòng của máy chủ Lotobet
    const lastDraw = ascData[ascData.length - 1].Result;
    const sums = [];
    for (let i = 0; i < 4; i++) {
        sums.push((parseInt(lastDraw[i]) + parseInt(lastDraw[i+1])) % 10);
    }
    // Khép vòng tròn (Vạn + Đơn)
    sums.push((parseInt(lastDraw[0]) + parseInt(lastDraw[4])) % 10); 

    // Đếm tần suất các tổng kề (Số nào trùng lặp nhiều nhất -> Cực kỳ dễ nổ)
    const sumFreq = {};
    sums.forEach(s => {
        sumFreq[s.toString()] = (sumFreq[s.toString()] || 0) + 1;
    });

    for (const [s, freq] of Object.entries(sumFreq)) {
        addScore(s, freq * 1500, \`Tổng Kề (x\${freq})\`); // Trọng số cực đại
        addScore(bongDuong(s), freq * 800, \`Bóng D. Tổng Kề\`);
        addScore(bongAm(s), freq * 500, \`Bóng Â. Tổng Kề\`);
    }

    // 2. GIA TỐC RƠI NHỊP 2 (Kỳ trước nữa)
    // Nếu tổng kề của kỳ trước nữa trùng với kỳ này -> Tạo thành cầu bệt liên kết
    if (ascData.length >= 2) {
        const prevDraw = ascData[ascData.length - 2].Result;
        const prevSums = [];
        for (let i = 0; i < 4; i++) {
            prevSums.push((parseInt(prevDraw[i]) + parseInt(prevDraw[i+1])) % 10);
        }
        prevSums.push((parseInt(prevDraw[0]) + parseInt(prevDraw[4])) % 10);
        
        prevSums.forEach(s => addScore(s.toString(), 400, "Cầu Bệt Tổng Kề"));
    }

    // 3. LÔ RƠI BẠCH THỦ KỲ VỪA RỒI
    // Máy chủ Lotobet luôn nhả lại 1-2 con số của kỳ vừa rồi để câu người chơi
    for (let char of lastDraw) {
        addScore(char, 300, "Lô Rơi Nhịp 1");
    }

    return Object.values(stats).sort((a, b) => b.score - a.score);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded to Circular Adjacent Sums Algorithm!');
