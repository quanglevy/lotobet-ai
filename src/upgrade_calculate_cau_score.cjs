const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const calculateCauScore = \(statsArray, scoredTongs = \[\], scoredSingles = \[\], rawData = \[\]\) => \{[\s\S]*?return statsArray\.map\(stat => \{[\s\S]*?\}\)\.sort\(\(a, b\) => b\.cauScore - a\.cauScore\);\n\};/m;

const newCalculateCauScore = `export const calculateCauScore = (statsArray, scoredTongs = [], scoredSingles = [], rawData = []) => {
    // 1. Áp dụng Thuật Toán Đa Tổng và Bạc Nhớ Lee Thành cho cả Đầu và Đuôi
    const tienTouches = typeof findBestTouches === 'function' ? findBestTouches(rawData, "TIEN") : [];
    const hauTouches = typeof findBestTouches === 'function' ? findBestTouches(rawData, "HAU") : [];
    
    // Gộp Chạm Tiền và Chạm Hậu (Thường sẽ tạo ra 4-6 chạm siêu chuẩn)
    const combinedTouches = [...new Set([...tienTouches, ...hauTouches])].slice(0, 5); // Lấy tối đa 5 chạm gộp

    return statsArray.map(stat => {
        let score = 0;
        let reasons = [];
        const d1 = stat.number[0];
        const d2 = stat.number[1];

        // 2. Chấm điểm dựa trên Siêu Chạm Bạc Nhớ
        if (combinedTouches.includes(d1) || combinedTouches.includes(d2)) {
            // Chạm nằm ở Top 1-2 Tiền/Hậu sẽ được điểm siêu cao
            if (d1 === tienTouches[0] || d2 === tienTouches[0]) { score += 1000; reasons.push(\`Bạc Nhớ Đầu (\${tienTouches[0]})\`); }
            else if (d1 === hauTouches[0] || d2 === hauTouches[0]) { score += 1000; reasons.push(\`Bạc Nhớ Đuôi (\${hauTouches[0]})\`); }
            else if (d1 === tienTouches[1] || d2 === tienTouches[1]) { score += 800; reasons.push(\`Bạc Nhớ Đầu (\${tienTouches[1]})\`); }
            else if (d1 === hauTouches[1] || d2 === hauTouches[1]) { score += 800; reasons.push(\`Bạc Nhớ Đuôi (\${hauTouches[1]})\`); }
            else { score += 400; reasons.push(\`Chạm Lót\`); }
        }

        // 3. Tổng VIP Bạc Nhớ (Lọc lại cho dàn 10, 20)
        const tong = ((parseInt(d1) + parseInt(d2)) % 10).toString();
        if (scoredTongs.length > 0) {
            if (tong === scoredTongs[0].tong.toString()) { score += 200; reasons.push("Tổng VIP"); }
        }

        if (d1 === d2) {
            score += 50; reasons.push("Kép");
        }

        return {
            ...stat,
            cauScore: score,
            reasons: reasons
        };
    }).sort((a, b) => b.cauScore - a.cauScore);
};`;

code = code.replace(regex, newCalculateCauScore);
fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded calculateCauScore to use Unified Bac Nho!');
