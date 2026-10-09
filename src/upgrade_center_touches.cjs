const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const calculateCauScore = \(statsArray, scoredTongs = \[\], scoredSingles = \[\], rawData = \[\]\) => \{[\s\S]*?return \{\n\s*\.\.\.stat,\n\s*cauScore: score,\n\s*reasons: reasons\n\s*\};\n\s*\}\)\.sort\(\(a, b\) => b\.cauScore - a\.cauScore\);\n\};/m;

const newCode = `export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = [], rawData = []) => {
    const ascData = [...rawData].reverse();
    const lastDraw = ascData.length > 0 ? ascData[ascData.length - 1].Result : "00000";

    // =========================================================================
    // THUẬT TOÁN TÂM ĐỀ GỌI CHẠM (CENTER DIGIT SUMMONS TOUCHES) - CẦU KÍN
    // =========================================================================
    // Lấy con số chính giữa của kỳ trước (Điểm mù của thuật toán nhà cái)
    const centerDigit = lastDraw[2]; 
    const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
    const bongDuongCenter = bongDuong(centerDigit);

    // Tìm con Lô Gan nhất toàn lịch sử để bọc lót chống bẻ cầu
    const freqAll = {};
    for (let i = 0; i < 10; i++) freqAll[i.toString()] = 0;
    ascData.forEach(d => {
        for (let char of d.Result) freqAll[char]++;
    });
    let cold = '0';
    let minFreq = 999;
    for (let i = 0; i < 10; i++) {
        if (freqAll[i.toString()] < minFreq) {
            minFreq = freqAll[i.toString()];
            cold = i.toString();
        }
    }

    return statsArray.map(stat => {
        let score = 0;
        let reasons = [];

        const d1 = stat.number[0];
        const d2 = stat.number[1];
        const tong = ((parseInt(d1) + parseInt(d2)) % 10).toString();

        // 1. TẠO DÀN 36 SỐ BẤT BẠI BẰNG CHẠM TÂM ĐỀ (2 Chạm = 36 Số)
        if (d1 === centerDigit || d2 === centerDigit) {
            score += 1000; reasons.push(\`Chạm Tâm Đề (\${centerDigit})\`);
        }
        if (d1 === bongDuongCenter || d2 === bongDuongCenter) {
            score += 800; reasons.push(\`Bóng Tâm Đề (\${bongDuongCenter})\`);
        }

        // 2. KẸP LÔ GAN ĐỂ LÓT ĐƯỜNG DÀN 64 SỐ
        if (d1 === cold || d2 === cold) {
            score += 400; reasons.push(\`Chạm Gan Chống Bẻ (\${cold})\`);
        }

        // 3. TỔNG VIP TỪ BẠC NHỚ (Dùng để lọc Dàn 10, Dàn 20)
        if (scoredTongs.length > 0) {
            if (tong === scoredTongs[0].tong.toString()) { score += 200; reasons.push("Tổng VIP Nhất"); }
            else if (tong === scoredTongs[1].tong.toString()) { score += 100; reasons.push("Tổng Lót"); }
        }

        if (d1 === d2) {
            score += 50; reasons.push("Cầu Kép");
        }

        return {
            ...stat,
            cauScore: score,
            reasons: reasons
        };
    }).sort((a, b) => b.cauScore - a.cauScore);
};`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded to Center Digit Summons Touches Algorithm!');
