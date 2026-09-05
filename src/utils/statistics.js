// ============================================================================
// HỆ THỐNG THUẬT TOÁN BẠC NHỚ TOÀN NĂNG - KUBET / THABET LOTOBET SẢNH A & C
// ============================================================================

export const getBongDuong = (d) => ({
  '0': '5', '5': '0',
  '1': '6', '6': '1',
  '2': '7', '7': '2',
  '3': '8', '8': '3',
  '4': '9', '9': '4'
}[d.toString()]);

export const getBongAm = (d) => ({
  '0': '7', '7': '0',
  '1': '4', '4': '1',
  '2': '9', '9': '2',
  '3': '6', '6': '3',
  '5': '8', '8': '5'
}[d.toString()]);

// Bộ số trả nhau đối ứng Kubet: 0<->9, 1<->7, 2<->5, 3<->6, 4<->8
export const BO_TRA_NHAU = {
  '0': '9', '9': '0',
  '1': '7', '7': '1',
  '2': '5', '5': '2',
  '3': '6', '6': '3',
  '4': '8', '8': '4'
};

// Định nghĩa các bộ số 2D chuẩn
export const BO_SO_MAP = {
  '00': ['00', '55', '05', '50'],
  '11': ['11', '66', '16', '61'],
  '22': ['22', '77', '27', '72'],
  '33': ['33', '88', '38', '83'],
  '44': ['44', '99', '49', '94'],
  '01': ['01', '10', '06', '60', '51', '15', '56', '65'],
  '02': ['02', '20', '07', '70', '52', '25', '57', '75'],
  '03': ['03', '30', '08', '80', '53', '35', '58', '85'],
  '04': ['04', '40', '09', '90', '54', '45', '59', '95'],
  '12': ['12', '21', '17', '71', '62', '26', '67', '76'],
  '13': ['13', '31', '18', '81', '63', '36', '68', '86'],
  '14': ['14', '41', '19', '91', '64', '46', '69', '96'],
  '23': ['23', '32', '28', '82', '73', '37', '78', '87'],
  '24': ['24', '42', '29', '92', '74', '47', '79', '97'],
  '34': ['34', '43', '39', '93', '84', '48', '89', '98']
};

export const DAN_KEP_BANG = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
export const DAN_KEP_LECH = ['05', '50', '16', '61', '27', '72', '38', '83', '49', '94'];
export const DAN_KEP_FULL = [...DAN_KEP_BANG, ...DAN_KEP_LECH];

export const checkTXCL = (resultStr) => {
  if (!resultStr || resultStr.length < 5) {
    return { tx: 'TÀI', cl: 'CHẴN', sum: 23 };
  }
  const sum = resultStr.split('').reduce((a, b) => a + parseInt(b), 0);
  return {
    tx: sum >= 23 ? 'TÀI' : 'XỈU',
    cl: sum % 2 === 0 ? 'CHẴN' : 'LẺ',
    sum: sum
  };
};

// ============================================================================
// PHẦN A: 15 QUY LUẬT DỰ ĐOÁN TÀI XỈU - CHẴN LẺ (KHUNG 3 TAY)
// ============================================================================
export const predictTXCL = (data) => {
  if (!data || data.length === 0) {
    return { tx: 'TÀI', cl: 'CHẴN', rate: '85%', reason: 'Khởi tạo mặc định' };
  }

  const ascData = [...data].reverse();
  const lastDraw = ascData[ascData.length - 1].Result;
  const lastTien = lastDraw.substring(0, 2);
  const lastHau = lastDraw.substring(3, 5);

  let txPrediction = null;
  let clPrediction = null;
  let txRate = '85%';
  let reasons = [];

  const counts = {};
  for (const char of lastDraw) {
    counts[char] = (counts[char] || 0) + 1;
  }
  const values = Object.values(counts);
  const keys = Object.keys(counts);

  const sum5 = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);

  // Quy luật 11: 5 số có 222 kẹp 1 hoặc 6 -> TÀI (90%)
  if (counts['2'] === 3 && (counts['1'] >= 1 || counts['6'] >= 1)) {
    txPrediction = 'TÀI';
    txRate = '90%';
    reasons.push('Thế 222 kẹp 1/6 (Tài 90%)');
  }

  // Quy luật 12: 5 số có 999 kẹp 4 hoặc 5 -> XỈU (90%)
  else if (counts['9'] === 3 && (counts['4'] >= 1 || counts['5'] >= 1)) {
    txPrediction = 'XỈU';
    txRate = '90%';
    reasons.push('Thế 999 kẹp 4/5 (Xỉu 90%)');
  }

  // Quy luật 4: Tiền/Hậu có 33 -> TÀI (95%)
  else if (lastTien === '33' || lastHau === '33') {
    txPrediction = 'TÀI';
    txRate = '95%';
    reasons.push('Bạc nhớ Kép 33 (Tài 95%)');
  }

  // Quy luật 2: Tiền/Hậu có 01 -> TÀI (90%)
  else if (lastTien === '01' || lastHau === '01') {
    txPrediction = 'TÀI';
    txRate = '90%';
    reasons.push('Bạc nhớ 01 (Tài 90%)');
  }

  // Quy luật 6: Tiền/Hậu có 98 -> XỈU (90%)
  else if (lastTien === '98' || lastHau === '98') {
    txPrediction = 'XỈU';
    txRate = '90%';
    reasons.push('Bạc nhớ 98 (Xỉu 90%)');
  }

  // Quy luật 3: Tiền/Hậu có 11 -> XỈU (80%)
  else if (lastTien === '11' || lastHau === '11') {
    txPrediction = 'XỈU';
    txRate = '80%';
    reasons.push('Bạc nhớ Kép 11 (Xỉu 80%)');
  }

  // Quy luật 5: Tiền/Hậu có 88 -> TÀI (70%)
  else if (lastTien === '88' || lastHau === '88') {
    txPrediction = 'TÀI';
    txRate = '70%';
    reasons.push('Bạc nhớ Kép 88 (Tài 70%)');
  }

  // Quy luật 7: Tiền/Hậu có 99 -> XỈU (70%)
  else if (lastTien === '99' || lastHau === '99') {
    txPrediction = 'XỈU';
    txRate = '70%';
    reasons.push('Bạc nhớ Kép 99 (Xỉu 70%)');
  }

  // Quy luật 1: Tiền/Hậu có 00 -> XỈU (60%)
  else if (lastTien === '00' || lastHau === '00') {
    txPrediction = 'XỈU';
    txRate = '60%';
    reasons.push('Bạc nhớ Kép 00 (Xỉu 60%)');
  }

  // Quy luật 8: Cù lũ (3 con giống + 1 đôi, vd 25552, 33888) -> Bẻ tổng
  else if (values.includes(3) && values.includes(2)) {
    txPrediction = sum5 >= 23 ? 'XỈU' : 'TÀI';
    txRate = '85%';
    reasons.push(`Cù Lũ tổng ${sum5} (Bẻ cầu ${txPrediction})`);
  }

  // Quy luật 14: Sám cô đơn thuần (3 con giống không phải cù lũ, vd 21226) -> TÀI bất chấp tổng
  else if (values.includes(3) && !values.includes(2)) {
    txPrediction = 'TÀI';
    txRate = '85%';
    reasons.push('Thế Sám Cô (Đánh Tài)');
  }

  // Quy luật 13: 2 Đôi + 1 số lẻ (vd 51122 số lẻ là 5)
  else if (values.filter(v => v === 2).length === 2) {
    let singleDigit = 0;
    for (const k of keys) {
      if (counts[k] === 1) singleDigit = parseInt(k);
    }
    txPrediction = singleDigit >= 5 ? 'XỈU' : 'TÀI';
    txRate = '85%';
    reasons.push(`Thế 2 Đôi số lẻ ${singleDigit} (Đánh ${txPrediction})`);
  }

  // Quy luật 10: Sảnh (5 số liên tiếp) -> Bẻ tổng
  const sortedDigits = lastDraw.split('').map(Number).sort((a, b) => a - b);
  let isStraight = true;
  for (let i = 0; i < 4; i++) {
    if (sortedDigits[i+1] - sortedDigits[i] !== 1) isStraight = false;
  }
  if (!txPrediction && isStraight) {
    txPrediction = sum5 >= 23 ? 'XỈU' : 'TÀI';
    txRate = '85%';
    reasons.push(`Sảnh liên tiếp tổng ${sum5} (Bẻ cầu ${txPrediction})`);
  }

  // Quy luật 9: Số rời (5 số khác nhau không sảnh) -> Bẻ tổng
  if (!txPrediction && keys.length === 5 && !isStraight) {
    txPrediction = sum5 >= 23 ? 'XỈU' : 'TÀI';
    txRate = '80%';
    reasons.push(`Số Rời tổng ${sum5} (Bẻ cầu ${txPrediction})`);
  }

  // Mặc định Tài Xỉu nếu không rơi vào các thế trên
  if (!txPrediction) {
    let bigCount = 0;
    for (let i = 0; i < 5; i++) if (parseInt(lastDraw[i]) >= 5) bigCount++;
    txPrediction = bigCount >= 3 ? 'TÀI' : 'XỈU';
    reasons.push(`Thuận tỷ lệ số lớn/nhỏ (${txPrediction})`);
  }

  // Quy luật 15: CHẴN - LẺ (Tổng lẻ đánh Chẵn, Tổng chẵn đánh Lẻ)
  let evenCount = 0;
  let oddCount = 0;
  for (const char of lastDraw) {
    if (parseInt(char) % 2 === 0) evenCount++;
    else oddCount++;
  }

  if (oddCount === 5 || sum5 % 2 !== 0) {
    clPrediction = 'CHẴN';
    reasons.push('Đảo Chẵn Lẻ (Đánh Chẵn)');
  } else {
    clPrediction = 'LẺ';
    reasons.push('Đảo Chẵn Lẻ (Đánh Lẻ)');
  }

  return {
    tx: txPrediction,
    cl: clPrediction,
    rate: txRate,
    reason: reasons.join(' • ')
  };
};

// ============================================================================
// CÁC HÀM CẦU CỐT LÕI (5 TRƯỜNG PHÁI BẮT SỐ 5 TINH)
// ============================================================================
export const getPascalPeak = (draw) => {
  let row = draw.split('').map(Number);
  while (row.length > 1) {
    let nextRow = [];
    for (let i = 0; i < row.length - 1; i++) {
      nextRow.push((row[i] + row[i+1]) % 10);
    }
    row = nextRow;
  }
  return row[0].toString();
};

export const getBridges = (draw) => {
  const d = draw.split('').map(Number);
  const pPeak = getPascalPeak(draw);
  return {
    "Bạc Nhớ Đối Ứng": [BO_TRA_NHAU[d[2].toString()], BO_TRA_NHAU[d[4].toString()]],
    "Pascal Ma Trận": [pPeak, getBongDuong(pPeak)],
    "Bệt Rơi Tâm Càng": [d[2].toString(), d[4].toString()],
    "Tổng Đối Xứng": [((d[0] + d[4]) % 10).toString(), ((d[1] + d[3]) % 10).toString()],
    "Bóng Dương Tâm": [getBongDuong(d[0].toString()), getBongDuong(d[2].toString())]
  };
};

// ============================================================================
// THUẬT TOÁN ĐA CẦU TỰ THÍCH ỨNG: DÒ CẦU ĐANG ĂN THÔNG CHO "3 SỐ 5 TINH"
// ============================================================================
export const getAdaptive3So5Tinh = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      dan3: ['0', '1', '2'],
      dan4: ['0', '1', '2', '3'],
      dan5: ['0', '1', '2', '3', '4'],
      topBridge: 'Khởi tạo mặc định',
      bridgeDetail: 'Chưa có dữ liệu lịch sử'
    };
  }

  const ascData = [...rawData].reverse();
  const lastDraw = ascData[ascData.length - 1].Result;
  const lastBridges = getBridges(lastDraw);

  if (ascData.length < 2) {
    const d3 = [...new Set([...lastBridges["Bạc Nhớ Đối Ứng"], ...lastBridges["Pascal Ma Trận"]])].slice(0, 3);
    return {
      dan3: d3,
      dan4: [...new Set([...d3, lastBridges["Tổng Đối Xứng"][0]])].slice(0, 4),
      dan5: [...new Set([...d3, lastBridges["Tổng Đối Xứng"][0], lastBridges["Bệt Rơi Tâm Càng"][0]])].slice(0, 5),
      topBridge: 'Bạc Nhớ Đối Ứng (Khởi tạo)',
      bridgeDetail: 'Bạc nhớ Trăm trả + Đơn vị trả'
    };
  }

  const bridgeScores = {
    "Bạc Nhớ Đối Ứng": 0,
    "Pascal Ma Trận": 0,
    "Bệt Rơi Tâm Càng": 0,
    "Tổng Đối Xứng": 0,
    "Bóng Dương Tâm": 0
  };

  const checkWindow = Math.min(4, ascData.length - 1);
  const startIdx = ascData.length - 1 - checkWindow;

  for (let i = startIdx; i < ascData.length - 1; i++) {
    const curr = ascData[i].Result;
    const next = ascData[i+1].Result;
    const b = getBridges(curr);
    const weight = (i - startIdx + 1) * 3;
    for (const [name, nums] of Object.entries(b)) {
      if (nums.some(n => next.includes(n))) {
        bridgeScores[name] += weight;
      }
    }
  }

  const sortedBridges = Object.keys(bridgeScores).sort((a, b) => bridgeScores[b] - bridgeScores[a]);
  const topBridgeName = sortedBridges[0];

  const digitPoints = {};
  for (let i = 0; i < 10; i++) digitPoints[i.toString()] = 0;

  sortedBridges.forEach((bName, rank) => {
    const pts = (5 - rank) * 15;
    lastBridges[bName].forEach(num => {
      digitPoints[num] += pts;
    });
  });

  const sortedDigits = Object.keys(digitPoints).sort((a, b) => digitPoints[b] - digitPoints[a]);
  const dan3 = sortedDigits.slice(0, 3);
  const dan4 = sortedDigits.slice(0, 4);
  const dan5 = sortedDigits.slice(0, 5);

  const bridgeDetail = `AI bám cầu [${topBridgeName}] (Điểm ăn thông: ${bridgeScores[topBridgeName]}) • Kết hợp: ${sortedBridges[1]}`;

  return {
    dan3,
    dan4,
    dan5,
    topBridge: topBridgeName,
    bridgeDetail,
    scores: bridgeScores
  };
};

export const analyzeSingleDigits = (data) => {
  if (!data || data.length === 0) return [];
  const adaptive = getAdaptive3So5Tinh(data);
  const { dan5 } = adaptive;

  const result = [];
  dan5.forEach((d, idx) => {
    const score = 5000 - idx * 500;
    const r = idx === 0 ? `Cầu Đang Thông 1 (${adaptive.topBridge})` : idx === 1 ? 'Cầu Đang Thông 2' : idx === 2 ? 'Cầu Đang Thông 3' : 'Bóng Hỗ Trợ';
    result.push({
      number: d,
      score: score,
      reason: [r]
    });
  });

  return result;
};

// ============================================================================
// ============================================================================
// HỆ THỐNG 5 CẦU THUẬN CỐT LÕI (BÓNG DƯƠNG & CÔNG THỨC CHUẨN LOTOBET):
// 1. Cầu 1: Tổng con Ngàn (d1) + con Trăm (d2) -> Bóng Dương -> Số Loại
// 2. Cầu 2: Tổng con Trăm (d2) + con Chục (d3) -> Bóng Dương -> Số Loại
// 3. Cầu 3: Tổng con Chục (d3) + con Đơn vị (d4) -> Bóng Dương -> Số Loại
// 4. Cầu 4: Con Đơn vị (d4) × 2 -> Bóng Dương -> Số Loại
// 5. Cầu 5: Tổng 3 con cuối (d2 + d3 + d4) -> Bóng Dương -> Số Loại
// Bám nhịp ăn thông >= 3 tay -> Bôi xanh & Khuyến khích
// ============================================================================

export const FIVE_BRIDGES = [
  {
    id: 'cau_1_ngan_tram',
    name: 'Cầu 1: Tổng Ngàn + Trăm',
    shortName: 'Tổng Ngàn + Trăm',
    calcFormula: (d) => {
      const ngan = parseInt(d[1]);
      const tram = parseInt(d[2]);
      const sum = (ngan + tram) % 10;
      const loai = getBongDuong(sum);
      return {
        formulaText: `${ngan} + ${tram} = ${ngan + tram} (tổng ${sum}) ➔ Bóng dương: ${loai}`,
        digit: loai
      };
    },
    calc: (d) => getBongDuong((parseInt(d[1]) + parseInt(d[2])) % 10)
  },
  {
    id: 'cau_2_tram_chuc',
    name: 'Cầu 2: Tổng Trăm + Chục',
    shortName: 'Tổng Trăm + Chục',
    calcFormula: (d) => {
      const tram = parseInt(d[2]);
      const chuc = parseInt(d[3]);
      const sum = (tram + chuc) % 10;
      const loai = getBongDuong(sum);
      return {
        formulaText: `${tram} + ${chuc} = ${tram + chuc} (tổng ${sum}) ➔ Bóng dương: ${loai}`,
        digit: loai
      };
    },
    calc: (d) => getBongDuong((parseInt(d[2]) + parseInt(d[3])) % 10)
  },
  {
    id: 'cau_3_chuc_dv',
    name: 'Cầu 3: Tổng Chục + Đơn Vị',
    shortName: 'Tổng Chục + Đơn Vị',
    calcFormula: (d) => {
      const chuc = parseInt(d[3]);
      const dv = parseInt(d[4]);
      const sum = (chuc + dv) % 10;
      const loai = getBongDuong(sum);
      return {
        formulaText: `${chuc} + ${dv} = ${chuc + dv} (tổng ${sum}) ➔ Bóng dương: ${loai}`,
        digit: loai
      };
    },
    calc: (d) => getBongDuong((parseInt(d[3]) + parseInt(d[4])) % 10)
  },
  {
    id: 'cau_4_dv_nhan_2',
    name: 'Cầu 4: Đơn Vị × 2',
    shortName: 'Đơn Vị × 2',
    calcFormula: (d) => {
      const dv = parseInt(d[4]);
      const mult = dv * 2;
      const lastDigit = mult % 10;
      const loai = getBongDuong(lastDigit);
      return {
        formulaText: `${dv} × 2 = ${mult} (tổng ${lastDigit}) ➔ Bóng dương: ${loai}`,
        digit: loai
      };
    },
    calc: (d) => getBongDuong((parseInt(d[4]) * 2) % 10)
  },
  {
    id: 'cau_5_tong_3_cuoi',
    name: 'Cầu 5: Tổng 3 Con Cuối',
    shortName: 'Tổng 3 Con Cuối',
    calcFormula: (d) => {
      const tram = parseInt(d[2]);
      const chuc = parseInt(d[3]);
      const dv = parseInt(d[4]);
      const sum = tram + chuc + dv;
      const lastDigit = sum % 10;
      const loai = getBongDuong(lastDigit);
      return {
        formulaText: `${tram} + ${chuc} + ${dv} = ${sum} (tổng ${lastDigit}) ➔ Bóng dương: ${loai}`,
        digit: loai
      };
    },
    calc: (d) => getBongDuong((parseInt(d[2]) + parseInt(d[3]) + parseInt(d[4])) % 10)
  }
];

export const getLoaiSoHauNhi = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      bridgeStats: [],
      recommendedBridges: [],
      loai3: ['1', '7', '9'],
      giu7: ['0', '2', '3', '4', '5', '6', '8'],
      loai4: ['1', '7', '9', '2'],
      giu6: ['0', '3', '4', '5', '6', '8'],
      dan49: [],
      dan36: [],
      dan9: [],
      dan16: [],
      activeBridgeName: 'Chưa đủ dữ liệu',
      trendReason: 'Chưa đủ dữ liệu'
    };
  }

  const ascData = [...rawData].reverse();
  const nDraws = ascData.length;
  const lastDraw = ascData[nDraws - 1].Result;

  // 1. Phân tích 5 CẦU THUẬN qua lịch sử các kỳ
  const bridgeStats = FIVE_BRIDGES.map(bridge => {
    let streak = 0;
    let hitStreak = 0;
    let streakDetermined = false;
    let streakType = null;
    let totalWins = 0;
    let totalChecked = 0;
    const history10 = [];

    for (let i = nDraws - 2; i >= 0; i--) {
      const prevRes = ascData[i].Result;
      const nextHau = ascData[i + 1].Result.slice(3, 5);
      const predDigit = bridge.calc(prevRes);
      // Thắng khi số loại KHÔNG xuất hiện ở 2 số cuối hậu nhị
      const isWin = !nextHau.includes(predDigit);

      totalChecked++;
      if (isWin) totalWins++;

      if (history10.length < 10) {
        history10.push({
          drawId: ascData[i + 1].Draw_ID,
          isWin,
          nextHau,
          predDigit
        });
      }

      if (!streakDetermined) {
        if (streakType === null) {
          streakType = isWin ? 'win' : 'lose';
          if (isWin) streak = 1;
          else hitStreak = 1;
        } else if (streakType === 'win' && isWin) {
          streak++;
        } else if (streakType === 'lose' && !isWin) {
          hitStreak++;
        } else {
          streakDetermined = true;
        }
      }
    }

    const { formulaText, digit } = bridge.calcFormula(lastDraw);
    const winRate = totalChecked > 0 ? Math.round((totalWins / totalChecked) * 100) : 70;
    const isRecommended = streak >= 3;

    return {
      id: bridge.id,
      name: bridge.name,
      shortName: bridge.shortName,
      streak,
      hitStreak,
      totalWins,
      totalChecked,
      winRate,
      isRecommended,
      predDigit: digit,
      formulaText,
      history10
    };
  });

  // 2. Chấm điểm từng chữ số để gom KÈO LOẠI 3 SỐ & 4 SỐ tối ưu nhất
  const digitScores = {};
  for (let i = 0; i < 10; i++) digitScores[i.toString()] = 0;

  bridgeStats.forEach(b => {
    const d = b.predDigit;
    if (b.streak >= 3) {
      // Cầu thông >= 3 tay: Ưu tiên loại số này cực mạnh (+1000 điểm)
      digitScores[d] += b.streak * 500 + 1000;
    } else if (b.streak >= 1) {
      digitScores[d] += b.streak * 100 + 200;
    }
    digitScores[d] += b.winRate * 5;
  });

  const sortedDigits = Object.keys(digitScores).sort((a, b) => digitScores[b] - digitScores[a]);

  const loai3 = sortedDigits.slice(0, 3).sort((a, b) => a - b);
  const giu7 = sortedDigits.slice(3).sort((a, b) => a - b);

  const loai4 = sortedDigits.slice(0, 4).sort((a, b) => a - b);
  const giu6 = sortedDigits.slice(4).sort((a, b) => a - b);

  // Sinh dàn 49 số & 36 số (đánh số giữ lại)
  const dan49 = [];
  for (const d1 of giu7) for (const d2 of giu7) dan49.push(d1 + d2);

  const dan36 = [];
  for (const d1 of giu6) for (const d2 of giu6) dan36.push(d1 + d2);

  const dan64 = [];
  const giu8 = sortedDigits.slice(2).sort((a, b) => a - b);
  for (const d1 of giu8) for (const d2 of giu8) dan64.push(d1 + d2);

  // Sinh dàn 9 số & 16 số (bắt số loại)
  const dan9 = [];
  for (const d1 of loai3) for (const d2 of loai3) dan9.push(d1 + d2);

  const dan16 = [];
  for (const d1 of loai4) for (const d2 of loai4) dan16.push(d1 + d2);

  const recommendedBridges = bridgeStats.filter(b => b.isRecommended);

  let activeBridgeName = 'Cầu Bắt Chạm Loại Thuận (Bóng Dương)';
  if (recommendedBridges.length > 0) {
    const topRec = recommendedBridges.sort((a, b) => b.streak - a.streak);
    activeBridgeName = `⭐ CẦU KHUYÊN DÙNG: ${topRec.map(b => `${b.shortName} (Thông ${b.streak} tay)`).join(' • ')}`;
  }

  const streakSummaries = bridgeStats
    .sort((a, b) => b.streak - a.streak)
    .map(b => `${b.shortName} (${b.streak >= 3 ? '🔥 Thông ' : 'Ăn '}${b.streak} tay ➔ Loại ${b.predDigit})`);

  const trendReason = `⚡ Trạng thái 5 Cầu: ${streakSummaries.join(' | ')}`;

  return {
    bridgeStats,
    recommendedBridges,
    loai3,
    giu7,
    loai4,
    giu6,
    dan64,
    dan49,
    dan36,
    dan9,
    dan16,
    activeBridgeName,
    trendReason
  };
};

export const getLoai3SoHauNhi = getLoaiSoHauNhi;

// ============================================================================
// PHẦN B & C: PHÂN TÍCH SIÊU CHẠM, BỘ SỐ TRẢ NHAU & BẮT BỘ BẠCH THỦ
// ============================================================================
export const getBacNhoAnalysis = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      touches: ['0', '1', '2', '3'],
      allTouches: ['0', '1', '2', '3', '4', '5'],
      vipNumbers: [],
      nuoiBoNumbers: [],
      traNhauTouches: ['9', '8'],
      samTongs: [],
      kepNumbers: [],
      reasons: [],
      touchScores: {}
    };
  }

  const ascData = [...rawData].reverse();
  const lastDraw = ascData[ascData.length - 1].Result;
  const lastTien = lastDraw.substring(0, 2);
  const lastHau = lastDraw.substring(3, 5);

  const vipNumbers = new Set();
  const nuoiBoNumbers = new Set();
  const touchScores = {};
  for (let i = 0; i < 10; i++) touchScores[i.toString()] = 0;
  const reasons = [];

  const addTouches = (tArr, pts, reason) => {
    tArr.forEach(t => {
      const ts = t.toString();
      if (touchScores[ts] !== undefined) {
        touchScores[ts] += pts;
      }
    });
    if (reason && !reasons.includes(reason)) reasons.push(reason);
  };

  const addVip = (nums, reason) => {
    nums.forEach(n => vipNumbers.add(n.padStart(2, '0')));
    if (reason && !reasons.includes(reason)) reasons.push(reason);
  };

  const addBo = (nums, reason) => {
    nums.forEach(n => nuoiBoNumbers.add(n.padStart(2, '0')));
    if (reason && !reasons.includes(reason)) reasons.push(reason);
  };

  // 1. BỘ SỐ TRẢ NHAU (Lấy Hàng Trăm index 2 và Đơn Vị index 4 làm chuẩn)
  const tram = lastDraw[2];
  const donVi = lastDraw[4];
  const traTram = BO_TRA_NHAU[tram] || tram;
  const traDonVi = BO_TRA_NHAU[donVi] || donVi;
  addTouches([traTram, traDonVi], 30, `Bộ Số TrẢ Nhau Kubet: Trăm ${tram} trả ${traTram}, Đơn vị ${donVi} trả ${traDonVi}`);

  // 2. BÍ KÍP BẮT 1 CHẠM (7 Quy Luật Bạc Nhớ)
  const sortedDraw = lastDraw.split('').map(Number).sort((a, b) => a - b);
  let isStraight = true;
  for (let i = 0; i < 4; i++) {
    if (sortedDraw[i+1] - sortedDraw[i] !== 1) isStraight = false;
  }
  if (isStraight) {
    const tamSanh = sortedDraw[2].toString();
    addTouches([tamSanh], 35, `Sảnh liên tiếp -> Chạm Tâm Sảnh ${tamSanh}`);
  } else {
    const counts = {};
    for (const c of lastDraw) counts[c] = (counts[c] || 0) + 1;
    if (Object.keys(counts).length === 5) {
      addTouches([lastDraw[2], lastDraw[4]], 20, `Số Rời -> Chạm Tâm ${lastDraw[2]} & Đơn vị ${lastDraw[4]}`);
    }
  }

  // Tứ Quý -> Số đơn + Bóng dương
  const countsT = {};
  for (const c of lastDraw) countsT[c] = (countsT[c] || 0) + 1;
  for (const [k, v] of Object.entries(countsT)) {
    if (v === 4) {
      const singleDigit = Object.keys(countsT).find(d => countsT[d] === 1);
      if (singleDigit) {
        const bd = getBongDuong(singleDigit);
        addTouches([singleDigit, bd], 40, `Tứ quý kẹp ${singleDigit} -> Chạm ${singleDigit} & ${bd}`);
      }
    }
  }

  // Kép 77 -> Chạm 9
  if (countsT['7'] >= 2) addTouches(['9'], 35, 'Xuất hiện Kép 77 -> Chạm 9');
  // Kép 88 -> Chạm 7
  if (countsT['8'] >= 2) addTouches(['7'], 35, 'Xuất hiện Kép 88 -> Chạm 7');
  // 01 hoặc 10 -> Nuôi Chạm 7
  if (lastTien === '01' || lastTien === '10' || lastHau === '01' || lastHau === '10') {
    addTouches(['7'], 35, 'Tiền/Hậu có 01/10 -> Nuôi Chạm 7');
  }

  // Tâm càng bệt 2 kỳ liên tiếp
  if (ascData.length >= 2) {
    const prevDraw = ascData[ascData.length - 2].Result;
    if (prevDraw[2] === lastDraw[2]) {
      const bd = getBongDuong(lastDraw[2]);
      addTouches([lastDraw[2], bd], 35, `Tâm Càng bệt ${lastDraw[2]} 2 kỳ -> Chạm ${lastDraw[2]} & ${bd}`);
    }
  }

  // Chạm Tiền/Hậu bệt 2-3 kỳ liên tiếp
  if (ascData.length >= 2) {
    const prevDraw = ascData[ascData.length - 2].Result;
    const pTien = prevDraw.substring(0, 2);
    const pHau = prevDraw.substring(3, 5);
    const checkBet = (c) => (pTien.includes(c) || pHau.includes(c)) && (lastTien.includes(c) || lastHau.includes(c));
    for (let i = 0; i < 10; i++) {
      const digit = i.toString();
      if (checkBet(digit)) {
        const bd = getBongDuong(digit);
        addTouches([digit, bd], 25, `Chạm ${digit} bệt Tiền/Hậu -> Đánh Chạm ${digit} & ${bd}`);
      }
    }
  }

  // 999 kẹp 4/5 -> Chạm 0
  if (countsT['9'] === 3 && (countsT['4'] >= 1 || countsT['5'] >= 1)) {
    addTouches(['0'], 40, 'Thế 999 kẹp 4/5 -> Ép Chạm 0');
  }

  // 3. BẮT BỘ & BẠCH THỦ (11 Quy luật Phần C)
  const isTargetMatch = (pairs) => pairs.some(p => lastTien === p || lastHau === p);
  const isBoMatch = (boKey) => {
    const list = BO_SO_MAP[boKey] || [];
    return list.includes(lastTien) || list.includes(lastHau);
  };

  if (isTargetMatch(['05', '50'])) {
    addBo(BO_SO_MAP['23'], 'Bạc nhớ 05/50 -> Nuôi Bộ 23');
    addVip(['78', '87'], 'Bạch thủ lót 78-87');
  }

  if (isTargetMatch(['78', '87'])) {
    addVip(['58', '85', '29', '92'], 'Bạc nhớ 78/87 -> Nuôi BT 58-85 & 29-92 (Khung 3 tay)');
    addBo([...BO_SO_MAP['03'], '50', '05', '38', '83', '27', '72'], 'Nuôi Bộ 03 mở rộng');
    addBo([...BO_SO_MAP['24'], '27', '72', '49', '94', '38', '83'], 'Nuôi Bộ 24 mở rộng');
  }

  if (isTargetMatch(['24', '42'])) {
    addVip(['68', '86'], 'Bạc nhớ 24/42 -> Nuôi BT 68-86 (Khung 3 tay)');
    addBo([...BO_SO_MAP['13'], '16', '61', '38', '83', '49', '94', '27', '72'], 'Nuôi Bộ 13 mở rộng');
  }

  if (isBoMatch('14')) {
    addBo([...BO_SO_MAP['03'], '38', '83', '50', '05'], 'Bạc nhớ Bộ 19 -> Nuôi Bộ 03');
  }

  if (isBoMatch('02')) {
    addBo([...BO_SO_MAP['14'], '49', '94', '16', '61', '05', '50', '27', '72'], 'Bạc nhớ Bộ 52 -> Nuôi Bộ 14');
  }

  if (isBoMatch('03')) {
    addBo([...BO_SO_MAP['34'], '49', '94', '38', '83'], 'Bạc nhớ Bộ 85 -> Nuôi Bộ 34');
  }

  if (isBoMatch('24')) {
    addBo([...BO_SO_MAP['12'], '49', '94', '27', '72', '16', '61'], 'Bạc nhớ Bộ 74 -> Nuôi Bộ 12');
    addVip(['47', '74', '26', '62'], 'Bạch thủ Bộ 74 -> 47, 74, 26, 62');
  }

  // Gãy bệt Chạm 0
  let cham0Streak = 0;
  for (let i = ascData.length - 2; i >= 0; i--) {
    if (ascData[i].Result.includes('0')) cham0Streak++;
    else break;
  }
  if (cham0Streak >= 2 && !lastDraw.includes('0')) {
    addBo([...BO_SO_MAP['12'], ...BO_SO_MAP['13'], ...BO_SO_MAP['23']], 'Thế Gãy Bệt Chạm 0 -> Đánh 3 Bộ 12, 13, 23');
    addVip(['37', '73'], 'Bạch thủ gãy chạm 0: 37-73');
  }

  // Gãy bệt Bộ 03, 04, 34
  let boTamGiacStreak = 0;
  for (let i = ascData.length - 2; i >= 0; i--) {
    const dTien = ascData[i].Result.substring(0, 2);
    const dHau = ascData[i].Result.substring(3, 5);
    const hit = [...BO_SO_MAP['03'], ...BO_SO_MAP['04'], ...BO_SO_MAP['34']].some(n => n === dTien || n === dHau);
    if (hit) boTamGiacStreak++;
    else break;
  }
  const lastHitTamGiac = [...BO_SO_MAP['03'], ...BO_SO_MAP['04'], ...BO_SO_MAP['34']].some(n => n === lastTien || n === lastHau);
  if (boTamGiacStreak >= 2 && !lastHitTamGiac) {
    addBo(DAN_KEP_FULL, 'Thế Gãy Tam Giác Bộ 03-04-34 -> Bắt Dàn Kép Bằng & Kép Lệch');
  }

  // Ra Sám cô -> Bắt 2 Tổng: Số Sám & Số Sám + 1
  const samTongs = [];
  for (const [k, v] of Object.entries(countsT)) {
    if (v === 3) {
      const sDigit = parseInt(k);
      const t1 = sDigit % 10;
      const t2 = (sDigit + 1) % 10;
      samTongs.push(t1.toString());
      samTongs.push(t2.toString());
      reasons.push(`Sám cô ${sDigit} -> Bắt 2 Tổng ${t1} và ${t2}`);
    }
  }

  const sortedTouches = Object.keys(touchScores).sort((a, b) => touchScores[b] - touchScores[a]);
  const top4Touches = sortedTouches.slice(0, 4);

  return {
    touches: top4Touches,
    allTouches: sortedTouches.slice(0, 6),
    vipNumbers: Array.from(vipNumbers),
    nuoiBoNumbers: Array.from(nuoiBoNumbers),
    traNhauTouches: [traTram, traDonVi],
    samTongs: samTongs,
    reasons: reasons,
    touchScores: touchScores
  };
};

// ============================================================================
// CHẤM ĐIỂM TOÀN DIỆN 100 SỐ 2D (THEO PHÂN TẦNG ƯU TIÊN)
// ============================================================================
export const calculateCauScore = (statsArray = [], scoredTongs = [], scoredSingles = [], rawData = []) => {
  const bn = getBacNhoAnalysis(rawData);
  const { touches, vipNumbers, nuoiBoNumbers, samTongs } = bn;
  const adaptive35 = getAdaptive3So5Tinh(rawData);
  const top3Single = adaptive35.dan3;

  const stats = [];
  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, '0');
    const d1 = num[0];
    const d2 = num[1];
    const tong = ((parseInt(d1) + parseInt(d2)) % 10).toString();

    let score = 0;
    const itemReasons = [];

    // TẦNG 1: BẠCH THỦ BẠC NHỚ VIP (+5000 ĐIỂM)
    if (vipNumbers.includes(num)) {
      score += 5000;
      itemReasons.push('Bạch Thủ Bạc Nhớ VIP');
    }

    // TẦNG 2: BỘ NUÔI LIÊN HOÀN BẠC NHỚ (+3500 ĐIỂM)
    if (nuoiBoNumbers.includes(num)) {
      score += 3500;
      itemReasons.push('Bộ Nuôi Bạc Nhớ');
    }

    // TẦNG 3: SỐ KẾT HỢP TỪ CẦU ĐANG ĂN THÔNG 5 TINH (+3000 ĐIỂM)
    if (top3Single.includes(d1) && top3Single.includes(d2)) {
      score += 3000;
      itemReasons.push('Bộ Cầu Đang Thông');
    } else if (top3Single.includes(d1) || top3Single.includes(d2)) {
      score += 1800;
      itemReasons.push('Chạm Cầu Thông');
    }

    // TẦNG 4: SIÊU CHẠM BẠC NHỚ (+1500 -> +800 ĐIỂM)
    if (d1 === touches[0] || d2 === touches[0]) {
      score += 1500;
      itemReasons.push(`Chạm Vàng (${touches[0]})`);
    } else if (d1 === touches[1] || d2 === touches[1]) {
      score += 1200;
      itemReasons.push(`Chạm Bạc (${touches[1]})`);
    } else if (d1 === touches[2] || d2 === touches[2]) {
      score += 1000;
      itemReasons.push(`Chạm Lót (${touches[2]})`);
    }

    // TẦNG 5: SÁM CÔ 2 TỔNG (+1200 ĐIỂM)
    if (samTongs.includes(tong)) {
      score += 1200;
      itemReasons.push(`Tổng Sám (${tong})`);
    }

    // TẦNG 6: KÉP BẰNG (+300 ĐIỂM)
    if (d1 === d2) {
      score += 300;
      itemReasons.push('Kép Bằng');
    }

    stats.push({
      number: num,
      cauScore: score,
      reasons: itemReasons
    });
  }

  return stats.sort((a, b) => b.cauScore - a.cauScore);
};

// ============================================================================
// HẠ DÀN THEO CẶP ĐỐI XỨNG & ĐIỂM SỐ VIP
// ============================================================================
export const generateReversibleSet = (pool, size) => {
  const result = [];
  const added = new Set();
  const sortedPool = [...pool].sort((a, b) => b.cauScore - a.cauScore);

  for (const item of sortedPool) {
    if (result.length >= size) break;
    if (added.has(item.number)) continue;

    const revNumber = item.number[1] + item.number[0];
    const isDouble = item.number === revNumber;

    if (isDouble) {
      result.push(item);
      added.add(item.number);
    } else {
      if (result.length + 2 <= size) {
        result.push(item);
        added.add(item.number);

        const revItem = sortedPool.find(p => p.number === revNumber);
        if (revItem) {
          result.push(revItem);
        } else {
          result.push({ number: revNumber, cauScore: item.cauScore, reasons: item.reasons });
        }
        added.add(revNumber);
      }
    }
  }

  return result;
};

export const generateReversibleSetFromDan = (sourceDan, scored2D, targetSize) => {
  const sourceNumbers = new Set(sourceDan.map(s => typeof s === 'string' ? s : s.number));
  const filteredScored = scored2D.filter(s => sourceNumbers.has(s.number));
  return generateReversibleSet(filteredScored, targetSize);
};

export const analyzeTong = (data) => {
  if (!data || data.length === 0) return [];
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
  }
  return Object.values(stats).sort((a, b) => b.score - a.score);
};

export const analyzeUnified2D = (data) => {
  if (!data || data.length === 0) return [];
  const stats = [];
  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, '0');
    stats.push({ number: num, cauScore: 0, reasons: [] });
  }
  return stats;
};
