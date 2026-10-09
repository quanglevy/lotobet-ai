const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const analyzeTongCode = `
export const analyzeTong = (data) => {
    if (data.length === 0) return [];
    const ascData = [...data].reverse();
    const stats = {};
    for (let i = 0; i < 10; i++) {
        stats[i.toString()] = { tong: i, score: 0, reason: [], countAll: 0 };
    }

    const window = Math.min(15, ascData.length);
    const recentDraws = ascData.slice(-window);
    recentDraws.forEach(d => {
        const sum = d.Result.split('').reduce((a, b) => a + parseInt(b), 0);
        const tong = sum % 10;
        stats[tong.toString()].countAll++;
    });

    for (let i = 0; i < 10; i++) {
        stats[i.toString()].score = stats[i.toString()].countAll * 10;
        if (stats[i.toString()].countAll > 0) {
            stats[i.toString()].reason.push(\`Tần suất: \${stats[i.toString()].countAll}\`);
        }
    }
    return Object.values(stats).sort((a, b) => b.score - a.score);
};
`;

code = code.replace(/export const analyzeUnified2D/, analyzeTongCode + '\nexport const analyzeUnified2D');

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Restored analyzeTong!');
