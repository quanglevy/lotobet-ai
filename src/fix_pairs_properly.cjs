const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /export const generateReversibleSet = \(pool, size\) => \{[\s\S]*?return result;\s*\};/m;

const newGenerateReversibleSet = `export const generateReversibleSet = (pool, size) => {
    const result = [];
    const added = new Set();
    
    const sortedPool = [...pool].sort((a, b) => b.score - a.score);

    for (const item of sortedPool) {
        if (result.length >= size) break;
        if (added.has(item.number)) continue;

        const revNumber = item.number[1] + item.number[0];
        const isDouble = item.number === revNumber;

        if (isDouble) {
            result.push(item);
            added.add(item.number);
        } else {
            // Đảm bảo luôn lấy CẢ CẶP (ví dụ 56 và 65)
            if (result.length + 2 <= size) {
                result.push(item);
                added.add(item.number);
                
                const revItem = sortedPool.find(p => p.number === revNumber);
                if (revItem) {
                    result.push(revItem);
                } else {
                    result.push({ number: revNumber, score: item.score, reason: item.reason });
                }
                added.add(revNumber);
            }
        }
    }
    
    // Không sort lại ở đây để các cặp số lộn (56 65) luôn đứng cạnh nhau cho dễ nhìn
    return result;
};`;

code = code.replace(regex, newGenerateReversibleSet);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully fixed generateReversibleSet!');
