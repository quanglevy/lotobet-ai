const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /\/\/ ============================================================================\r?\n\/\/ THUẬT TOÁN LƯỠNG NGHI PHÂN CỰC \(TIỀN NHỊ \/ HẬU NHỊ ĐỘC LẬP\)[\s\S]*$/m;

const newAlgorithms = `// ============================================================================
// THUẬT TOÁN ĐA TỔNG - QUÉT CẦU ĐANG CHẠY (BACKTESTING) - THEO YÊU CẦU SẾP
// ============================================================================

const getBongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d.toString()]);
const getBongAm = d => ({'0':'7','7':'0','1':'4','4':'1','2':'9','9':'2','3':'6','6':'3','5':'8','8':'5'}[d.toString()]);

const getMultiSums = (resultStr) => {
    const d = resultStr.split('').map(Number);
    return {
        t2D: (d[0] + d[1]) % 10,
        t3D: (d[0] + d[1] + d[2]) % 10,
        t4D: (d[0] + d[1] + d[2] + d[3]) % 10,
        t5:  (d[0] + d[1] + d[2] + d[3] + d[4]) % 10,
        t2C: (d[3] + d[4]) % 10,
        t3C: (d[2] + d[3] + d[4]) % 10,
        t4C: (d[1] + d[2] + d[3] + d[4]) % 10,
    };
};

export const findBestTouches = (rawData, target = "TIEN") => {
    if (!rawData || rawData.length === 0) return ['0','1','2','3'];
    const ascData = [...rawData].reverse();
    
    // 1. Backtest Cầu Đang Chạy (Running Bridge)
    const bridgeScores = { t2D:0, t3D:0, t4D:0, t5:0, t2C:0, t3C:0, t4C:0 };
    
    for (let i = 0; i < ascData.length - 1; i++) {
        const currentDraw = ascData[i].Result;
        const nextDraw = ascData[i+1].Result;
        
        const sums = getMultiSums(currentDraw);
        const targetStr = target === "TIEN" ? nextDraw.substring(0,2) : nextDraw.substring(3,5);
        
        // Tăng trọng số cực lớn cho các kỳ gần nhất (Cầu đang chạy nóng)
        const weight = (i >= ascData.length - 4) ? 5 : 1; 
        
        for (const [bridgeName, sumVal] of Object.entries(sums)) {
            const sStr = sumVal.toString();
            const bd = getBongDuong(sStr);
            const ba = getBongAm(sStr);
            
            // Nếu Đầu/Đuôi kỳ sau có chứa Chạm gốc, hoặc Bóng Dương, hoặc Bóng Âm của Cầu này
            if (targetStr.includes(sStr) || targetStr.includes(bd) || targetStr.includes(ba)) {
                bridgeScores[bridgeName] += weight;
            }
        }
    }
    
    // 2. Lấy cầu tốt nhất áp dụng cho kỳ cuối cùng
    const lastDraw = ascData[ascData.length - 1].Result;
    const lastSums = getMultiSums(lastDraw);
    
    // Sắp xếp các cầu theo điểm số backtest (Lọc ra Cầu Đang Chạy Mượt Nhất)
    const sortedBridges = Object.keys(bridgeScores).sort((a,b) => bridgeScores[b] - bridgeScores[a]);
    
    const touchFreq = {};
    for(let i=0; i<10; i++) touchFreq[i.toString()] = 0;
    
    // Bám theo 3 cầu đang chạy mạnh nhất, bung ra Bóng Âm/Dương
    for (let i = 0; i < 3; i++) {
        const bName = sortedBridges[i];
        const val = lastSums[bName].toString();
        touchFreq[val] += 4; // Chạm Gốc
        touchFreq[getBongDuong(val)] += 2; // Bóng dương
        touchFreq[getBongAm(val)] += 2; // Bóng âm
    }
    
    // 3. Kết hợp Bạc Bệt (Kỳ trước liền kề)
    const lastTarget = target === "TIEN" ? lastDraw.substring(0,2) : lastDraw.substring(3,5);
    touchFreq[lastTarget[0]] += 3;
    touchFreq[lastTarget[1]] += 3;
    
    // Lô Gan bọc lót
    const freqAll = {};
    for (let i = 0; i < 10; i++) freqAll[i.toString()] = 0;
    ascData.forEach(d => {
        const t = target === "TIEN" ? d.Result.substring(0,2) : d.Result.substring(3,5);
        freqAll[t[0]]++; freqAll[t[1]]++;
    });
    let cold = '0'; let minFreq = 999;
    for (let i = 0; i < 10; i++) {
        if (freqAll[i.toString()] < minFreq) {
            minFreq = freqAll[i.toString()];
            cold = i.toString();
        }
    }
    touchFreq[cold] += 1.5; // Lót Lô Gan

    // 4. Lọc ra 4 CHẠM CHUẨN nhất
    const finalTouches = Object.keys(touchFreq).sort((a,b) => touchFreq[b] - touchFreq[a]).slice(0, 4);
    return finalTouches;
};

export const analyzeTienNhi = (rawData) => {
    const touches = findBestTouches(rawData, "TIEN");
    const stats = [];
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, '0');
        let score = 0; let reasons = [];
        
        if (num[0] === touches[0] || num[1] === touches[0]) { score += 500; reasons.push(\`Chạm Chuẩn 1 (\${touches[0]})\`); }
        if (num[0] === touches[1] || num[1] === touches[1]) { score += 400; reasons.push(\`Chạm Chuẩn 2 (\${touches[1]})\`); }
        if (num[0] === touches[2] || num[1] === touches[2]) { score += 300; reasons.push(\`Chạm Chuẩn 3 (\${touches[2]})\`); }
        if (num[0] === touches[3] || num[1] === touches[3]) { score += 200; reasons.push(\`Chạm Chuẩn 4 (\${touches[3]})\`); }
        
        if (num[0] === num[1]) { score += 50; reasons.push("Kép"); }
        stats.push({ number: num, cauScore: score, reasons });
    }
    return stats.sort((a, b) => b.cauScore - a.cauScore);
};

export const analyzeHauNhi = (rawData) => {
    const touches = findBestTouches(rawData, "HAU");
    const stats = [];
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, '0');
        let score = 0; let reasons = [];
        
        if (num[0] === touches[0] || num[1] === touches[0]) { score += 500; reasons.push(\`Chạm Chuẩn 1 (\${touches[0]})\`); }
        if (num[0] === touches[1] || num[1] === touches[1]) { score += 400; reasons.push(\`Chạm Chuẩn 2 (\${touches[1]})\`); }
        if (num[0] === touches[2] || num[1] === touches[2]) { score += 300; reasons.push(\`Chạm Chuẩn 3 (\${touches[2]})\`); }
        if (num[0] === touches[3] || num[1] === touches[3]) { score += 200; reasons.push(\`Chạm Chuẩn 4 (\${touches[3]})\`); }
        
        if (num[0] === num[1]) { score += 50; reasons.push("Kép"); }
        stats.push({ number: num, cauScore: score, reasons });
    }
    return stats.sort((a, b) => b.cauScore - a.cauScore);
};
`;

code = code.replace(regex, newAlgorithms);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully upgraded to Multi-Sum Backtesting Algorithm!');
