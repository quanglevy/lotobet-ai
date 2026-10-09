const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

// Loại bỏ toàn bộ các hàm predictTXCL và checkTXCL cũ
const removeRegex = /export const (predictTXCL|checkTXCL) = \([\s\S]*?\n\};/gm;
code = code.replace(removeRegex, '');

// Định nghĩa lại 2 hàm
const newLogic = `
export const checkTXCL = (resultStr) => {
    const sum = resultStr.split('').reduce((a, b) => a + parseInt(b), 0);
    return {
        tx: sum >= 23 ? 'TÀI' : 'XỈU',
        cl: sum % 2 === 0 ? 'CHẴN' : 'LẺ',
        sum: sum
    };
};

export const predictTXCL = (data) => {
    if (data.length === 0) return { tx: 'TÀI', cl: 'CHẴN' };
    const ascData = [...data].reverse();
    const lastDraw = ascData[ascData.length - 1].Result;

    let txPrediction = null;
    let clPrediction = null;

    const counts = {};
    for (let char of lastDraw) {
        counts[char] = (counts[char] || 0) + 1;
    }
    const values = Object.values(counts);
    const keys = Object.keys(counts);

    if (values.includes(3) && !values.includes(2)) { 
        txPrediction = 'TÀI';
    }

    let pairCount = 0;
    values.forEach(v => { if (v === 2) pairCount++; });
    if (pairCount === 2) {
        let singleDigit = 0;
        for (let k of keys) {
            if (counts[k] === 1) singleDigit = parseInt(k);
        }
        if (singleDigit >= 5) {
            txPrediction = 'XỈU'; 
        } else {
            txPrediction = 'TÀI';
        }
    }

    let evenCount = 0; let oddCount = 0;
    for (let char of lastDraw) {
        if (parseInt(char) % 2 === 0) evenCount++;
        else oddCount++;
    }
    if (evenCount === 5) {
        clPrediction = 'LẺ';
    } else if (oddCount === 5) {
        clPrediction = 'CHẴN';
    }

    if (lastDraw.includes('33')) { txPrediction = 'TÀI'; }
    else if (lastDraw.includes('01')) { txPrediction = 'TÀI'; }
    else if (lastDraw.includes('98')) { txPrediction = 'XỈU'; }
    else if (lastDraw.includes('11')) { txPrediction = 'XỈU'; }
    else if (lastDraw.includes('88')) { txPrediction = 'TÀI'; }
    else if (lastDraw.includes('99')) { txPrediction = 'XỈU'; }
    else if (lastDraw.includes('00')) { txPrediction = 'XỈU'; }

    if (!txPrediction) {
        let bigCount = 0;
        for (let i = 0; i < 5; i++) if (parseInt(lastDraw[i]) >= 5) bigCount++;
        txPrediction = bigCount >= 3 ? 'TÀI' : 'XỈU';
    }

    if (!clPrediction) {
        const sum = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);
        clPrediction = sum % 2 === 0 ? 'CHẴN' : 'LẺ';
    }

    return {
        tx: txPrediction,
        cl: clPrediction
    };
};
`;

fs.writeFileSync('src/utils/statistics.js', code + newLogic, 'utf8');
console.log('Successfully fixed TXCL duplicate error!');
