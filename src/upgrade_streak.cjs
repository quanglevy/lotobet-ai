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

    // =========================================================================
    // --- THUẬT TOÁN THỰC CHIẾN NGUYÊN THỦY: THUẬN CHIỀU BỆT (STREAK SURFING) ---
    // Mục tiêu: Bỏ qua mọi lý thuyết phức tạp, đâm thẳng vào số đang ra nhiều.
    // =========================================================================

    // 1. Quét tần suất 3 kỳ gần nhất (Độ nóng hiện tại)
    const window3 = Math.min(3, ascData.length);
    const recent3 = ascData.slice(-window3).map(d => d.Result);
    const freq3 = {};
    for (let i = 0; i < 10; i++) freq3[i.toString()] = 0;
    recent3.forEach(draw => {
        for (let char of draw) freq3[char]++;
    });

    // 2. Quét toàn bộ lịch sử (tìm Lô Gan)
    const freqAll = {};
    for (let i = 0; i < 10; i++) freqAll[i.toString()] = 0;
    ascData.forEach(d => {
        for (let char of d.Result) freqAll[char]++;
    });

    // CỘNG ĐIỂM BẠO LỰC CHO LÔ ĐANG BỆT TRONG 3 KỲ VỪA QUA
    // Con nào đang ra nhiều, tiếp tục đâm mạnh con đó, không đoán ngược!
    for (let i = 0; i < 10; i++) {
        if (freq3[i.toString()] > 0) {
            // Mỗi lần xuất hiện cộng 500 điểm
            addScore(i.toString(), freq3[i.toString()] * 500, \`Đang Bệt Rơi (x\${freq3[i.toString()]})\`);
        }
    }

    // CỘNG ĐIỂM CHO CON LÔ GAN NHẤT (Chống bẻ cầu)
    let minFreq = 999;
    let cold = '0';
    for (let i = 0; i < 10; i++) {
        if (freqAll[i.toString()] < minFreq) {
            minFreq = freqAll[i.toString()];
            cold = i.toString();
        }
    }
    // Con gan nhất được 800 điểm để leo lên ít nhất top 3
    addScore(cold, 800, \`Lô Gan Khung (\${minFreq} lần)\`);

    // CỘNG ĐIỂM CHO CẦU KẸP KỲ TRƯỚC (Rất dễ nổ)
    const lastDraw = ascData[ascData.length - 1].Result;
    for (let i = 1; i < 4; i++) {
        if (lastDraw[i-1] === lastDraw[i+1]) {
            addScore(lastDraw[i], 600, "Cầu Kẹp Sinh Tồn");
        }
    }

    return Object.values(stats).sort((a, b) => b.score - a.score);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded to Streak Surfing Algorithm!');
