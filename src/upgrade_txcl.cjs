const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const predictTXCL = \(data\) => \{[\s\S]*?return \{\s*tx: finalTX,\s*cl: finalCL\s*\};\s*\};/m;

const newLogic = `export const predictTXCL = (data) => {
    if (data.length === 0) return { tx: 'TÀI', cl: 'CHẴN' };
    const ascData = [...data].reverse();
    const lastDraw = ascData[ascData.length - 1].Result;

    // =========================================================================
    // BẠC NHỚ LEE THÀNH - TÀI XỈU / CHẴN LẺ (VIP)
    // =========================================================================

    let txPrediction = null;
    let clPrediction = null;
    let ruleNameTX = "";
    let ruleNameCL = "";

    // Đếm tần suất các chữ số trong kỳ vừa rồi
    const counts = {};
    for (let char of lastDraw) {
        counts[char] = (counts[char] || 0) + 1;
    }
    const values = Object.values(counts);
    const keys = Object.keys(counts);

    // 1. Cầu nuôi Tài sau Sám (Sám = 3 số giống nhau)
    if (values.includes(3) && !values.includes(2)) { // Sám cô (3 of a kind)
        txPrediction = 'TÀI';
        ruleNameTX = "Bạc Nhớ: Sám gọi Tài";
    }

    // 2. Cầu TX sau 2 đôi
    let pairCount = 0;
    values.forEach(v => { if (v === 2) pairCount++; });
    if (pairCount === 2) {
        // Tìm con số dư còn lại (con số xuất hiện 1 lần)
        let singleDigit = 0;
        for (let k of keys) {
            if (counts[k] === 1) singleDigit = parseInt(k);
        }
        if (singleDigit >= 5) {
            txPrediction = 'XỈU'; // Nuôi ngược lại
            ruleNameTX = \`Bạc Nhớ: 2 Đôi dư Tài (\${singleDigit}) -> Xỉu\`;
        } else {
            txPrediction = 'TÀI';
            ruleNameTX = \`Bạc Nhớ: 2 Đôi dư Xỉu (\${singleDigit}) -> Tài\`;
        }
    }

    // 3. Cầu Chẵn Lẻ (Full chẵn hoặc Full lẻ)
    let evenCount = 0; let oddCount = 0;
    for (let char of lastDraw) {
        if (parseInt(char) % 2 === 0) evenCount++;
        else oddCount++;
    }
    if (evenCount === 5) {
        clPrediction = 'LẺ';
        ruleNameCL = "Bạc Nhớ: Full 5 Chẵn -> Lẻ";
    } else if (oddCount === 5) {
        clPrediction = 'CHẴN';
        ruleNameCL = "Bạc Nhớ: Full 5 Lẻ -> Chẵn";
    }

    // 4. Tài Xỉu Bạc Nhớ Cụ Thể (Ưu tiên đè lên các luật trên nếu có)
    if (lastDraw.includes('33')) { txPrediction = 'TÀI'; ruleNameTX = "Bạc Nhớ 33 -> Tài (95%)"; }
    else if (lastDraw.includes('01')) { txPrediction = 'TÀI'; ruleNameTX = "Bạc Nhớ 01 -> Tài (90%)"; }
    else if (lastDraw.includes('98')) { txPrediction = 'XỈU'; ruleNameTX = "Bạc Nhớ 98 -> Xỉu (90%)"; }
    else if (lastDraw.includes('11')) { txPrediction = 'XỈU'; ruleNameTX = "Bạc Nhớ 11 -> Xỉu (80%)"; }
    else if (lastDraw.includes('88')) { txPrediction = 'TÀI'; ruleNameTX = "Bạc Nhớ 88 -> Tài (70%)"; }
    else if (lastDraw.includes('99')) { txPrediction = 'XỈU'; ruleNameTX = "Bạc Nhớ 99 -> Xỉu (70%)"; }
    else if (lastDraw.includes('00')) { txPrediction = 'XỈU'; ruleNameTX = "Bạc Nhớ 00 -> Xỉu (60%)"; }

    // Fallback: Nếu không có Bạc Nhớ nào kích hoạt, dùng thuật toán đếm bóng cơ bản
    if (!txPrediction) {
        let bigCount = 0;
        for (let i = 0; i < 5; i++) if (parseInt(lastDraw[i]) >= 5) bigCount++;
        txPrediction = bigCount >= 3 ? 'TÀI' : 'XỈU';
    }

    if (!clPrediction) {
        const sum = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
        // Thuận chiều: Chẵn đánh Chẵn, Lẻ đánh Lẻ
        clPrediction = sum % 2 === 0 ? 'CHẴN' : 'LẺ';
    }

    return {
        tx: txPrediction,
        cl: clPrediction
    };
};`;

code = code.replace(regex, newLogic);
if (!code.includes("BẠC NHỚ LEE THÀNH")) {
    console.log("Regex fallback needed.");
    // Fallback if regex misses
    const startIdx = code.indexOf("export const predictTXCL");
    if (startIdx !== -1) {
        const checkStr = "export const checkTXCL";
        const endIdx = code.indexOf(checkStr);
        if (endIdx !== -1) {
             const before = code.substring(0, startIdx);
             const after = code.substring(endIdx);
             code = before + newLogic + '\n\n' + after;
        }
    }
}

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully injected Lee Thanh Bac Nho TXCL Logic!');
