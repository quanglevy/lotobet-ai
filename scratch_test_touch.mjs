import { getLoaiSoHauNhi, CORE_BRIDGES, getBongAm, getBongDuong, BO_TRA_NHAU } from './src/utils/statistics.js';

const testDraws = [
  { Draw: '014', Result: '52841' },
  { Draw: '015', Result: '12345' },
  { Draw: '016', Result: '63974' }, // Hau 74
  { Draw: '017', Result: '10569' }, // Hau 69
  { Draw: '018', Result: '83486' }, // Hau 86
  { Draw: '019', Result: '35193' }, // Hau 93
  { Draw: '020', Result: '68947' }, // Hau 47
  { Draw: '021', Result: '02065' }, // Hau 65
  { Draw: '022', Result: '90196' }, // Hau 96
  { Draw: '023', Result: '45417' }, // Hau 17
  { Draw: '024', Result: '10331' }, // Hau 31
  { Draw: '025', Result: '35316' }  // Hau 16
];

export function calculateSmartTouches(historyData) {
  if (!historyData || historyData.length === 0) {
    return { top4Touches: ['0','1','2','3'], top3Touches: ['0','1','2'], top2Touches: ['0','1'], touchScores: {} };
  }

  const lastDraw = historyData[historyData.length - 1].Result;
  const lastHau = lastDraw.slice(3, 5); // 2 con cuối
  const cChuc = lastHau[0];
  const cDonVi = lastHau[1];
  const cTram = lastDraw[2];
  const cNgan = lastDraw[1];
  const cChucNgan = lastDraw[0];

  const prev2Draw = historyData.length >= 2 ? historyData[historyData.length - 2].Result : null;
  const prev2Hau = prev2Draw ? prev2Draw.slice(3, 5) : null;

  const sumHau = (parseInt(cChuc) + parseInt(cDonVi)) % 10;
  const sum5 = (parseInt(cChucNgan) + parseInt(cNgan) + parseInt(cTram) + parseInt(cChuc) + parseInt(cDonVi)) % 10;

  // 1. Phân tích 10 Cầu Loại
  const loaiInfo = getLoaiSoHauNhi(historyData);
  const bridgeStats = loaiInfo.bridgeStats || [];

  // Khởi tạo điểm cho 10 chạm (0..9)
  const touchScores = {};
  const touchReasons = {};
  for (let i = 0; i <= 9; i++) {
    touchScores[i.toString()] = 100; // Điểm gốc
    touchReasons[i.toString()] = [];
  }

  // 2. CHẠM RƠI TRỰC TIẾP TỪ HẬU NHỊ KỲ TRƯỚC:
  touchScores[cChuc] += 280;
  touchReasons[cChuc].push(`Chạm Rơi Hàng Chục (${cChuc}) (+280đ)`);
  touchScores[cDonVi] += 290;
  touchReasons[cDonVi].push(`Chạm Rơi Hàng ĐV (${cDonVi}) (+290đ)`);

  // Bệt Chạm:
  if (prev2Hau) {
    if (prev2Hau.includes(cChuc)) {
      touchScores[cChuc] += 200;
      touchReasons[cChuc].push(`Chạm ${cChuc} Bệt 2 kỳ (+200đ)`);
    }
    if (prev2Hau.includes(cDonVi)) {
      touchScores[cDonVi] += 200;
      touchReasons[cDonVi].push(`Chạm ${cDonVi} Bệt 2 kỳ (+200đ)`);
    }
  }

  // 3. BÓNG DƯƠNG VÀ BÓNG ÂM CỦA HẬU NHỊ:
  const bongDuongChuc = getBongDuong(cChuc);
  const bongDuongDV = getBongDuong(cDonVi);
  touchScores[bongDuongChuc] += 210;
  touchReasons[bongDuongChuc].push(`Bóng Dương Chục ${cChuc} -> ${bongDuongChuc} (+210đ)`);
  touchScores[bongDuongDV] += 210;
  touchReasons[bongDuongDV].push(`Bóng Dương ĐV ${cDonVi} -> ${bongDuongDV} (+210đ)`);

  const bongAmChuc = getBongAm(cChuc);
  const bongAmDV = getBongAm(cDonVi);
  touchScores[bongAmChuc] += 200;
  touchReasons[bongAmChuc].push(`Bóng Âm Chục ${cChuc} -> ${bongAmChuc} (+200đ)`);
  touchScores[bongAmDV] += 200;
  touchReasons[bongAmDV].push(`Bóng Âm ĐV ${cDonVi} -> ${bongAmDV} (+200đ)`);

  // 4. CHẠM TỔNG HẬU NHỊ & BÓNG CỦA TỔNG:
  touchScores[sumHau.toString()] += 190;
  touchReasons[sumHau.toString()].push(`Chạm Tổng Hậu (${sumHau}) (+190đ)`);
  const bongSumHau = getBongDuong(sumHau.toString());
  touchScores[bongSumHau] += 180;
  touchReasons[bongSumHau].push(`Bóng Dương Tổng Hậu (${bongSumHau}) (+180đ)`);
  const bongAmSumHau = getBongAm(sumHau.toString());
  touchScores[bongAmSumHau] += 170;
  touchReasons[bongAmSumHau].push(`Bóng Âm Tổng Hậu (${bongAmSumHau}) (+170đ)`);

  // 5. CHẠM TỪ HÀNG TRĂM & BÓNG:
  touchScores[cTram] += 160;
  touchReasons[cTram].push(`Chạm Tâm Hàng Trăm (${cTram}) (+160đ)`);
  const bongTram = getBongDuong(cTram);
  touchScores[bongTram] += 130;

  // 6. BỘ TRẢ NHAU BẠC NHỚ:
  const traList = BO_TRA_NHAU[lastHau] || [];
  traList.forEach(num => {
    touchScores[num[0]] += 90;
    touchScores[num[1]] += 90;
  });

  // 7. PHÂN TÍCH TƯƠNG TÁC THÔNG MINH VỚI 10 CẦU LOẠI:
  const winningLoaiDigits = new Set();
  
  bridgeStats.forEach(b => {
    const d = b.predDigit;
    if (d !== undefined && d !== null) {
      const isWinLatest = b.history10?.[0]?.isWin;
      if (isWinLatest === true) {
        winningLoaiDigits.add(d);
        // Chỉ phạt nếu số này KHÔNG PHẢI là chạm rơi và KHÔNG PHẢI là bóng của chạm rơi
        const isCoreTouch = (d === cChuc || d === cDonVi || d === bongDuongChuc || d === bongDuongDV);
        if (!isCoreTouch) {
          const penalty = 120 + (b.streak * 20);
          touchScores[d] -= penalty;
          touchReasons[d].push(`Bị ${b.shortName} (Ăn ${b.streak}t) loại (-${penalty}đ)`);
        }
      } else if (isWinLatest === false) {
        // CẦU GÃY BÁO LOẠI -> ĐÂY LÀ TÍN HIỆU NỔ BẺ CẦU CỰC MẠNH!
        const bonus = 180 + (b.hitStreak * 30);
        touchScores[d] += bonus;
        touchReasons[d].push(`Cầu ${b.shortName} GÃY -> Bẻ nổ lại (+${bonus}đ)`);
      }
    }
  });

  // Số sạch cầu hoàn toàn (Không bị cầu ăn nào loại)
  for (let i = 0; i <= 9; i++) {
    const d = i.toString();
    if (!winningLoaiDigits.has(d)) {
      touchScores[d] += 150;
      touchReasons[d].push(`SẠCH CẦU (+150đ)`);
    }
  }

  // Sắp xếp thứ tự các Chạm Cứng theo điểm số
  const sortedTouches = Object.keys(touchScores).sort((a, b) => touchScores[b] - touchScores[a]);

  const top4Touches = sortedTouches.slice(0, 4);
  const top3Touches = sortedTouches.slice(0, 3);
  const top2Touches = sortedTouches.slice(0, 2);

  // Tạo Dàn Số 2D theo Chạm (Chỉ cần 1 trong 2 số chứa chạm là trúng)
  const dan64So = []; // 4 Chạm
  const dan51So = []; // 3 Chạm
  const dan36So = []; // 2 Chạm
  const dan16Ghep = []; // Ghép trong 4 chạm (16 số)
  const dan25Ghep = []; // Ghép trong 5 chạm (25 số)

  for (let i = 0; i <= 99; i++) {
    const numStr = i < 10 ? '0' + i : i.toString();
    const d1 = numStr[0];
    const d2 = numStr[1];

    if (top4Touches.includes(d1) || top4Touches.includes(d2)) {
      dan64So.push(numStr);
    }
    if (top3Touches.includes(d1) || top3Touches.includes(d2)) {
      dan51So.push(numStr);
    }
    if (top2Touches.includes(d1) || top2Touches.includes(d2)) {
      dan36So.push(numStr);
    }
    if (top4Touches.includes(d1) && top4Touches.includes(d2)) {
      dan16Ghep.push(numStr);
    }
    if (sortedTouches.slice(0, 5).includes(d1) && sortedTouches.slice(0, 5).includes(d2)) {
      dan25Ghep.push(numStr);
    }
  }

  return {
    sortedTouches,
    top4Touches,
    top3Touches,
    top2Touches,
    dan64So,
    dan51So,
    dan36So,
    dan16Ghep,
    dan25Ghep,
    touchScores,
    touchReasons
  };
}

console.log('--- RE-TESTING BALANCED TOUCH ENGINE ---');
let hit4Count = 0;
let hit3Count = 0;
let hit2Count = 0;
let hitGhep16 = 0;
let hitGhep25 = 0;
let totalChecked = 0;

for (let i = 2; i < testDraws.length; i++) {
  const currentDraw = testDraws[i];
  const historySlice = testDraws.slice(0, i);
  const prediction = calculateSmartTouches(historySlice);
  const actualHau = currentDraw.Result.slice(3, 5);
  const d1 = actualHau[0];
  const d2 = actualHau[1];

  const isHit4 = prediction.top4Touches.includes(d1) || prediction.top4Touches.includes(d2);
  const isHit3 = prediction.top3Touches.includes(d1) || prediction.top3Touches.includes(d2);
  const isHit2 = prediction.top2Touches.includes(d1) || prediction.top2Touches.includes(d2);
  const isHitG16 = prediction.dan16Ghep.includes(actualHau);
  const isHitG25 = prediction.dan25Ghep.includes(actualHau);

  if (isHit4) hit4Count++;
  if (isHit3) hit3Count++;
  if (isHit2) hit2Count++;
  if (isHitG16) hitGhep16++;
  if (isHitG25) hitGhep25++;
  totalChecked++;

  console.log(`Kỳ ${currentDraw.Draw} (${currentDraw.Result} ➔ Hậu ${actualHau}):`);
  console.log(`  - 4 Chạm [${prediction.top4Touches.join(', ')}]: ${isHit4 ? '✅ TRÚNG' : '❌ TRƯỢT'}`);
  console.log(`  - 3 Chạm [${prediction.top3Touches.join(', ')}]: ${isHit3 ? '✅ TRÚNG' : '❌ TRƯỢT'}`);
  console.log(`  - 2 Chạm [${prediction.top2Touches.join(', ')}]: ${isHit2 ? '✅ TRÚNG' : '❌ TRƯỢT'}`);
  console.log(`  - Ghép trong 5s (25s): ${isHitG25 ? '🎯 NỔ' : '⚪'}`);
}

console.log('==============================================');
console.log(`TỔNG KẾT 10 KỲ:`);
console.log(`- 4 CHẠM CỨNG (Dàn 64s): ${hit4Count}/${totalChecked} (${Math.round((hit4Count/totalChecked)*100)}%)`);
console.log(`- 3 CHẠM CỨNG (Dàn 51s): ${hit3Count}/${totalChecked} (${Math.round((hit3Count/totalChecked)*100)}%)`);
console.log(`- 2 CHẠM CỨNG (Dàn 36s): ${hit2Count}/${totalChecked} (${Math.round((hit2Count/totalChecked)*100)}%)`);
console.log(`- DÀN GHÉP 25 SỐ: ${hitGhep25}/${totalChecked} (${Math.round((hitGhep25/totalChecked)*100)}%)`);
