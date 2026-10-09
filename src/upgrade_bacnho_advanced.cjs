const fs = require('fs');
let code = fs.readFileSync('src/utils/statistics.js', 'utf8');

const regex = /\/\/ Quy luật 4: Các cặp số huyền thoại KU gọi nhau[\s\S]*?\/\/ Bơm điểm Bạc Nhớ cực mạnh/m;

const advancedBacNho = `// Quy luật 4: Các cặp số huyền thoại KU gọi nhau
    if (lastTargetStr === '68' || lastTargetStr === '86') { bacNhoTouches.push('6'); bacNhoTouches.push('8'); }
    if (lastTargetStr === '79' || lastTargetStr === '97') { bacNhoTouches.push('3'); bacNhoTouches.push('8'); }
    if (lastTargetStr === '00' || lastTargetStr === '99') { bacNhoTouches.push('0'); bacNhoTouches.push('9'); }

    // =========================================================================
    // BẠC NHỚ LEE THÀNH - CÁC BỘ SỐ TRẢ NHAU VÀ DẤU HIỆU ĐẶC BIỆT
    // =========================================================================
    
    // Quy luật 8: Bộ số trả nhau (Dùng số Vạn và số Đơn vị)
    const boTraNhau = {'0':'9', '9':'0', '1':'7', '7':'1', '2':'5', '5':'2', '3':'6', '6':'3', '4':'8', '8':'4'};
    const van = lastDraw[0];
    const donVi = lastDraw[4];
    if (boTraNhau[van]) bacNhoTouches.push(boTraNhau[van]);
    if (boTraNhau[donVi]) bacNhoTouches.push(boTraNhau[donVi]);

    // Quy luật 10: 1 Chạm Khi Ra Tứ Quý
    const counts = {};
    for (let char of lastDraw) counts[char] = (counts[char] || 0) + 1;
    const values = Object.values(counts);
    const keys = Object.keys(counts);
    if (values.includes(4)) {
        let singleDigit = keys.find(k => counts[k] === 1);
        if (singleDigit !== undefined) {
            bacNhoTouches.push(singleDigit);
            bacNhoTouches.push(getBongDuong(singleDigit));
        }
    }

    // Quy luật 11, 12, 13: Bạc nhớ Kép 77, 88 và 010
    if (lastTargetStr === '77') bacNhoTouches.push('9'); // Ra kép 77 -> nuôi chạm 9
    if (lastTargetStr === '88') bacNhoTouches.push('7'); // Ra kép 88 -> nuôi chạm 7
    if (lastTargetStr === '01' || lastTargetStr === '10') bacNhoTouches.push('7'); // Ra 01/10 -> nuôi chạm 7

    // Quy luật Sảnh (Sắp xếp 5 số tạo thành chuỗi liên tiếp)
    const sortedDraw = lastDraw.split('').map(Number).sort((a, b) => a - b);
    let isStraight = true;
    for (let i = 0; i < 4; i++) {
        if (sortedDraw[i+1] - sortedDraw[i] !== 1) isStraight = false;
    }
    if (isStraight) {
        bacNhoTouches.push(sortedDraw[2].toString()); // Lấy tâm sảnh làm chạm
    }

    // Bơm điểm Bạc Nhớ cực mạnh`;

code = code.replace(regex, advancedBacNho);

fs.writeFileSync('src/utils/statistics.js', code, 'utf8');
console.log('Successfully injected Lee Thanh Advanced Bac Nho!');
