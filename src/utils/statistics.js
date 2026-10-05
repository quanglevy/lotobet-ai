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

export const getBongAm = (d) => {
  const map = {
    '0': '7', '7': '0',
    '1': '4', '4': '1',
    '2': '9', '9': '2',
    '3': '6', '6': '3',
    '5': '8', '8': '5',
    '4': '1', '6': '3', '8': '5', '9': '2'
  };
  return map[d.toString()] || '0';
};

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
// ============================================================================
// PHẦN A: THUẬT TOÁN AI DỰ ĐOÁN TÀI XỈU - CHẴN LẺ (TỔNG 5 SỐ - KHUNG 3 TAY)
// ============================================================================
export const predictTXCL = (data) => {
  if (!data || data.length === 0) {
    return { 
      tx: 'TÀI', 
      cl: 'CHẴN', 
      rate: '85%', 
      txRate: '85%', 
      clRate: '85%', 
      txPattern: 'Mặc định', 
      clPattern: 'Mặc định', 
      reason: 'Khởi tạo mặc định' 
    };
  }

  const ascData = [...data].reverse();
  const n = ascData.length;
  const lastDraw = ascData[n - 1].Result;
  const lastTien = lastDraw.substring(0, 2);
  const lastHau = lastDraw.substring(3, 5);
  const sum5 = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0);

  // 1. Phân tích chuỗi lịch sử kết quả gần nhất (TX & CL history)
  const txHistory = [];
  const clHistory = [];
  const sumsHistory = [];

  for (let i = Math.max(0, n - 15); i < n; i++) {
    const res = ascData[i].Result;
    const s = res.split('').reduce((a, b) => a + parseInt(b), 0);
    sumsHistory.push(s);
    txHistory.push(s >= 23 ? 'TÀI' : 'XỈU');
    clHistory.push(s % 2 === 0 ? 'CHẴN' : 'LẺ');
  }

  // 2. Phân tích Nhịp Cầu Tài Xỉu (Bệt / Đảo 1-1 / 2-2 / Mean Reversion)
  let txScore = 0; // > 0 -> TÀI, < 0 -> XỈU
  let txReasons = [];
  let txPattern = 'Theo nhịp tổng';

  const lastTX = txHistory[txHistory.length - 1];
  let currentTXStreak = 1;
  for (let i = txHistory.length - 2; i >= 0; i--) {
    if (txHistory[i] === lastTX) currentTXStreak++;
    else break;
  }

  // Kiểm tra Cầu Bệt Tài/Xỉu
  if (currentTXStreak >= 2 && currentTXStreak <= 4) {
    const delta = currentTXStreak * 30;
    txScore += (lastTX === 'TÀI' ? delta : -delta);
    txReasons.push(`Cầu Bệt ${lastTX} ${currentTXStreak} tay (Theo cầu bệt)`);
    txPattern = `Bệt ${lastTX} ${currentTXStreak}T`;
  } else if (currentTXStreak >= 5) {
    const opposite = lastTX === 'TÀI' ? 'XỈU' : 'TÀI';
    const delta = 60;
    txScore += (opposite === 'TÀI' ? delta : -delta);
    txReasons.push(`Cầu Bệt ${lastTX} ${currentTXStreak} tay (Bẻ sang ${opposite})`);
    txPattern = `Bẻ Bệt ${currentTXStreak}T ➔ ${opposite}`;
  } else {
    // Kiểm tra Cầu Đảo 1-1 (T-X-T-X)
    let is11 = true;
    if (txHistory.length >= 3) {
      for (let i = txHistory.length - 1; i >= txHistory.length - 3; i--) {
        if (txHistory[i] === txHistory[i - 1]) {
          is11 = false;
          break;
        }
      }
    } else {
      is11 = false;
    }

    if (is11) {
      const next11 = lastTX === 'TÀI' ? 'XỈU' : 'TÀI';
      txScore += (next11 === 'TÀI' ? 50 : -50);
      txReasons.push(`Cầu Đảo 1-1 (Nhịp Đảo ➔ Đánh ${next11})`);
      txPattern = `Đảo 1-1 ➔ ${next11}`;
    }
  }

  // Phân tích Mean Reversion trên Tổng 5 Số (Trung bình lý thuyết là 22.5)
  const recent3Sums = sumsHistory.slice(-3);
  const avg3Sums = recent3Sums.reduce((a, b) => a + b, 0) / (recent3Sums.length || 1);
  if (avg3Sums >= 28) {
    txScore -= 40; // Kéo về Xỉu
    txReasons.push(`Tổng 3 kỳ TB ${avg3Sums.toFixed(1)} (Quá tải ➔ Ép Xỉu)`);
  } else if (avg3Sums <= 16) {
    txScore += 40; // Kéo về Tài
    txReasons.push(`Tổng 3 kỳ TB ${avg3Sums.toFixed(1)} (Thấp kỷ lục ➔ Ép Tài)`);
  }

  // Phân tích Thế Số & Bạc Nhớ Kép
  const counts = {};
  for (const char of lastDraw) {
    counts[char] = (counts[char] || 0) + 1;
  }
  const values = Object.values(counts);

  if (counts['2'] === 3 && (counts['1'] >= 1 || counts['6'] >= 1)) {
    txScore += 45;
    txReasons.push('Thế 222 kẹp 1/6 (Tài 90%)');
  } else if (counts['9'] === 3 && (counts['4'] >= 1 || counts['5'] >= 1)) {
    txScore -= 45;
    txReasons.push('Thế 999 kẹp 4/5 (Xỉu 90%)');
  } else if (lastTien === '33' || lastHau === '33') {
    txScore += 40;
    txReasons.push('Bạc nhớ Kép 33 (Tài 95%)');
  } else if (lastTien === '01' || lastHau === '01') {
    txScore += 35;
    txReasons.push('Bạc nhớ 01 (Tài 90%)');
  } else if (lastTien === '98' || lastHau === '98') {
    txScore -= 40;
    txReasons.push('Bạc nhớ 98 (Xỉu 90%)');
  } else if (lastTien === '11' || lastHau === '11') {
    txScore -= 35;
    txReasons.push('Bạc nhớ Kép 11 (Xỉu 80%)');
  } else if (values.includes(3) && values.includes(2)) {
    // Cù lũ -> bẻ tổng
    if (sum5 >= 23) {
      txScore -= 30;
      txReasons.push(`Cù Lũ tổng ${sum5} (Bẻ Xỉu)`);
    } else {
      txScore += 30;
      txReasons.push(`Cù Lũ tổng ${sum5} (Bẻ Tài)`);
    }
  }

  // Tỷ lệ số lớn/nhỏ trong kỳ vừa xổ
  let bigDigits = 0;
  for (let i = 0; i < 5; i++) if (parseInt(lastDraw[i]) >= 5) bigDigits++;
  if (bigDigits >= 4) {
    txScore += 20;
    txReasons.push(`Thế 4-5 số lớn (Thuận Tài)`);
  } else if (bigDigits <= 1) {
    txScore -= 20;
    txReasons.push(`Thế 4-5 số nhỏ (Thuận Xỉu)`);
  }

  const txPrediction = txScore >= 0 ? 'TÀI' : 'XỈU';
  const txConfidence = Math.min(95, Math.max(70, 75 + Math.round(Math.abs(txScore) / 4)));

  // 3. Phân tích Nhịp Cầu Chẵn Lẻ (Parity AI)
  let clScore = 0; // > 0 -> CHẴN, < 0 -> LẺ
  let clReasons = [];
  let clPattern = 'Theo nhịp tổng';

  const lastCL = clHistory[clHistory.length - 1];
  let currentCLStreak = 1;
  for (let i = clHistory.length - 2; i >= 0; i--) {
    if (clHistory[i] === lastCL) currentCLStreak++;
    else break;
  }

  if (currentCLStreak >= 2 && currentCLStreak <= 4) {
    const delta = currentCLStreak * 30;
    clScore += (lastCL === 'CHẴN' ? delta : -delta);
    clReasons.push(`Cầu Bệt ${lastCL} ${currentCLStreak} tay`);
    clPattern = `Bệt ${lastCL} ${currentCLStreak}T`;
  } else if (currentCLStreak >= 5) {
    const opposite = lastCL === 'CHẴN' ? 'LẺ' : 'CHẴN';
    clScore += (opposite === 'CHẴN' ? 50 : -50);
    clReasons.push(`Cầu Bệt ${lastCL} ${currentCLStreak} tay (Bẻ sang ${opposite})`);
    clPattern = `Bẻ Bệt ➔ ${opposite}`;
  } else {
    let is11CL = true;
    if (clHistory.length >= 3) {
      for (let i = clHistory.length - 1; i >= clHistory.length - 3; i--) {
        if (clHistory[i] === clHistory[i - 1]) {
          is11CL = false;
          break;
        }
      }
    } else {
      is11CL = false;
    }
    if (is11CL) {
      const next11CL = lastCL === 'CHẴN' ? 'LẺ' : 'CHẴN';
      clScore += (next11CL === 'CHẴN' ? 45 : -45);
      clReasons.push(`Cầu Đảo Chẵn Lẻ 1-1 (Đánh ${next11CL})`);
      clPattern = `Đảo 1-1 ➔ ${next11CL}`;
    }
  }

  // Parity của 5 chữ số trong kết quả vừa xong
  let evenCount = 0;
  for (const char of lastDraw) {
    if (parseInt(char) % 2 === 0) evenCount++;
  }
  if (evenCount >= 4) {
    clScore -= 30; // Nhiều chẵn quá -> đảo sang lẻ
    clReasons.push(`${evenCount} số chẵn (Đảo Lẻ)`);
  } else if (evenCount <= 1) {
    clScore += 30; // Nhiều lẻ quá -> đảo sang chẵn
    clReasons.push(`${5 - evenCount} số lẻ (Đảo Chẵn)`);
  } else if (sum5 % 2 !== 0) {
    clScore += 15;
    clReasons.push('Đảo Tổng Lẻ (Đánh Chẵn)');
  } else {
    clScore -= 15;
    clReasons.push('Đảo Tổng Chẵn (Đánh Lẻ)');
  }

  const clPrediction = clScore >= 0 ? 'CHẴN' : 'LẺ';
  const clConfidence = Math.min(95, Math.max(70, 75 + Math.round(Math.abs(clScore) / 4)));

  const combinedReasons = [...txReasons.slice(0, 2), ...clReasons.slice(0, 2)].join(' • ');

  return {
    tx: txPrediction,
    cl: clPrediction,
    rate: `${Math.round((txConfidence + clConfidence) / 2)}%`,
    txRate: `${txConfidence}%`,
    clRate: `${clConfidence}%`,
    txPattern,
    clPattern,
    reason: combinedReasons || 'Thuận chu kỳ xác suất động'
  };
};

// ============================================================================
// HỆ THỐNG 10 CẦU BẮT SỐ LOẠI HẬU NHỊ & THUẬT TOÁN XẾP HẠNG ĐỘNG AI
// ============================================================================

export const CORE_BRIDGES = [
  {
    id: 'cau_1',
    name: 'Cầu 1 (Tổng Chục Ngàn + Trăm + 1)',
    shortName: 'Cầu 1 (Vạn+Trăm+1)',
    calc: (res) => ((parseInt(res[0]) + parseInt(res[2]) + 1) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[0]) + parseInt(res[2]) + 1;
      const digit = (sum % 10).toString();
      return {
        formulaText: `[ChụcNgàn(${res[0]}) + Trăm(${res[2]})] + 1 = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_2',
    name: 'Cầu 2 (Tổng Chục Ngàn + ĐV + 1)',
    shortName: 'Cầu 2 (Vạn+ĐV+1)',
    calc: (res) => ((parseInt(res[0]) + parseInt(res[4]) + 1) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[0]) + parseInt(res[4]) + 1;
      const digit = (sum % 10).toString();
      return {
        formulaText: `[ChụcNgàn(${res[0]}) + ĐV(${res[4]})] + 1 = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_3',
    name: 'Cầu 3 (Tổng Ngàn + Đơn Vị)',
    shortName: 'Cầu 3 (Ngàn + ĐV)',
    calc: (res) => ((parseInt(res[1]) + parseInt(res[4])) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[1]) + parseInt(res[4]);
      const digit = (sum % 10).toString();
      return {
        formulaText: `Ngàn(${res[1]}) + ĐV(${res[4]}) = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_4',
    name: 'Cầu 4 (Tổng Trăm + ĐV + 1)',
    shortName: 'Cầu 4 (Trăm+ĐV+1)',
    calc: (res) => ((parseInt(res[2]) + parseInt(res[4]) + 1) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[2]) + parseInt(res[4]) + 1;
      const digit = (sum % 10).toString();
      return {
        formulaText: `[Trăm(${res[2]}) + ĐV(${res[4]})] + 1 = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_5',
    name: 'Cầu 5 (Đơn Vị x 2 + 1)',
    shortName: 'Cầu 5 (ĐV x2 + 1)',
    calc: (res) => ((parseInt(res[4]) * 2 + 1) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[4]) * 2 + 1;
      const digit = (sum % 10).toString();
      return {
        formulaText: `[ĐV(${res[4]}) x 2] + 1 = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_6',
    name: 'Cầu 6 (Đơn Vị x 2 - 1)',
    shortName: 'Cầu 6 (ĐV x2 - 1)',
    calc: (res) => (((parseInt(res[4]) * 2 - 1) % 10 + 10) % 10).toString(),
    calcFormula: (res) => {
      const raw = parseInt(res[4]) * 2 - 1;
      const digit = (((raw % 10) + 10) % 10).toString();
      return {
        formulaText: `[ĐV(${res[4]}) x 2] - 1 = ${raw} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_7',
    name: 'Cầu 7 (Tổng 3 Con Cuối)',
    shortName: 'Cầu 7 (3 Con Cuối)',
    calc: (res) => ((parseInt(res[2]) + parseInt(res[3]) + parseInt(res[4])) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[2]) + parseInt(res[3]) + parseInt(res[4]);
      const digit = (sum % 10).toString();
      return {
        formulaText: `Trăm(${res[2]}) + Chục(${res[3]}) + ĐV(${res[4]}) = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_8',
    name: 'Cầu 8 (Bóng Âm Đơn Vị)',
    shortName: 'Cầu 8 (Bóng Âm ĐV)',
    calc: (res) => getBongAm(res[4]),
    calcFormula: (res) => {
      const digit = getBongAm(res[4]);
      return {
        formulaText: `Bóng âm của Đơn Vị(${res[4]}) ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_9',
    name: 'Cầu 9 (Bóng Âm Hàng Trăm)',
    shortName: 'Cầu 9 (Bóng Âm Trăm)',
    calc: (res) => getBongAm(res[2]),
    calcFormula: (res) => {
      const digit = getBongAm(res[2]);
      return {
        formulaText: `Bóng âm của Trăm(${res[2]}) ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_10',
    name: 'Cầu 10 (Tổng 3 Con Đầu)',
    shortName: 'Cầu 10 (3 Con Đầu)',
    calc: (res) => ((parseInt(res[0]) + parseInt(res[1]) + parseInt(res[2])) % 10).toString(),
    calcFormula: (res) => {
      const sum = parseInt(res[0]) + parseInt(res[1]) + parseInt(res[2]);
      const digit = (sum % 10).toString();
      return {
        formulaText: `ChụcNgàn(${res[0]}) + Ngàn(${res[1]}) + Trăm(${res[2]}) = ${sum} ➔ Loại ${digit}`,
        digit
      };
    }
  }
];

export const FIVE_BRIDGES = CORE_BRIDGES;

export const analyzeSingleDigits = (data) => [];

export const getLoaiSoHauNhi = (rawData) => {
  if (!rawData || rawData.length === 0 || CORE_BRIDGES.length === 0) {
    return {
      bridgeStats: [],
      rankedBridges: [],
      recommendedBridges: [],
      digitCounts: {},
      digitBridges: {},
      loai4Details: [],
      loai3Details: [],
      loai3: [],
      giu7: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      loai4: [],
      giu6: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      dan64: [],
      dan49: [],
      dan36: [],
      dan9: [],
      dan16: [],
      activeBridgeName: '',
      trendReason: 'Đang chờ thiết lập công thức cầu mới'
    };
  }

  const ascData = [...rawData].reverse();
  const nDraws = ascData.length;
  const lastDraw = ascData[nDraws - 1].Result;

  // 1. Phân tích 9 CẦU qua lịch sử các kỳ
  const bridgeStats = CORE_BRIDGES.map(bridge => {
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
    const winRate = totalChecked > 0 ? Math.round((totalWins / totalChecked) * 100) : 75;

    // Phân tích trạng thái nhịp AI chi tiết:
    const h0 = history10[0]?.isWin;
    const h1 = history10[1]?.isWin;
    const h2 = history10[2]?.isWin;

    // 1. Phục hồi 1 kỳ trượt (1-Miss Recovery): kỳ gần nhất thắng, kỳ trước đó trượt, và trước đó nữa lại thắng
    const is1MissRecovery = h0 === true && h1 === false && (history10.length < 3 || h2 === true);
    
    // 2. Cầu siêu bền vừa lỡ nhịp 1 kỳ (1-Dip Resilience): kỳ gần nhất trượt nhưng trước đó là chuỗi thông dài >= 2 tay
    let prevStreakBeforeDip = 0;
    if (h0 === false) {
      for (let i = 1; i < history10.length; i++) {
        if (history10[i].isWin) prevStreakBeforeDip++;
        else break;
      }
    }
    const is1DipResilient = h0 === false && prevStreakBeforeDip >= 2;

    // 3. Cầu gãy kép (Multi-loss): gãy liên tiếp >= 2 kỳ
    const isMultiLoss = h0 === false && h1 === false;

    // Tính điểm AI Động Toàn Diện (Dynamic AI Score)
    let aiScore = winRate * 1.5; // Điểm nền tảng độ bền dài hạn (0 -> 150)
    aiScore += (streak * 18);    // Mỗi tay thông +18đ

    if (streak >= 3) aiScore += 30; // Thưởng phong độ cao
    if (streak >= 5) aiScore += 45; // Thưởng rồng lửa

    // Thưởng điểm phục hồi 1-miss recovery (+90đ - Ưu tiên hàng đầu)
    if (is1MissRecovery) {
      aiScore += 90;
    }
    // Thưởng điểm bền bỉ nếu vừa lỡ 1 nhịp sau chuỗi dài (Ăn 8 gãy 1 ➔ +75đ + 8*10 = +155đ)
    if (is1DipResilient) {
      aiScore += 75 + (prevStreakBeforeDip * 10);
    }
    // Phạt nặng nếu gãy liên tiếp >= 2 kỳ (-80đ)
    if (isMultiLoss) {
      aiScore -= 80;
    }

    let statusType = 'normal';
    let statusLabel = `Ăn ${streak} tay (${winRate}%)`;
    if (is1MissRecovery) {
      statusType = 'recovery';
      statusLabel = `⚡ HỒI NHỊP (Trượt 1 nối lại)`;
    } else if (is1DipResilient) {
      statusType = 'resilient';
      statusLabel = `🛡️ SIÊU BỀN (Ăn ${prevStreakBeforeDip} gãy 1 ➔ Chờ Nổ Lại)`;
    } else if (streak >= 5) {
      statusType = 'dragon';
      statusLabel = `🔥 RỒNG LỬA (Thông ${streak} tay)`;
    } else if (streak >= 3) {
      statusType = 'hot';
      statusLabel = `🔥 THÔNG ${streak} TAY`;
    } else if (streak >= 1) {
      statusType = 'normal';
      statusLabel = `✅ Ăn ${streak} tay (${winRate}%)`;
    } else {
      statusType = 'broken';
      statusLabel = `⚠️ Gãy nhịp (${winRate}%)`;
    }

    const isRecommended = streak >= 3 || is1MissRecovery || is1DipResilient || (streak >= 2 && winRate >= 80);

    return {
      id: bridge.id,
      name: bridge.name,
      shortName: bridge.shortName,
      streak,
      hitStreak,
      totalWins,
      totalChecked,
      winRate,
      aiScore,
      is1MissRecovery,
      is1DipResilient,
      prevStreakBeforeDip,
      statusType,
      statusLabel,
      isRecommended,
      predDigit: digit,
      formulaText,
      history10
    };
  });

  // 2. Xếp hạng 10 cầu theo AI Score, Streak, WinRate
  const rankedBridges = [...bridgeStats].sort((a, b) => {
    if (b.aiScore !== a.aiScore) return b.aiScore - a.aiScore;
    if (b.streak !== a.streak) return b.streak - a.streak;
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return 0;
  }).map((b, idx) => ({
    ...b,
    rank: idx + 1,
    rankBadge: idx === 0 ? '🥇 TOP 1' : (idx === 1 ? '🥈 TOP 2' : (idx === 2 ? '🥉 TOP 3' : (idx === 3 ? '🎖️ TOP 4' : `TOP ${idx + 1}`)))
  }));

  // 3. THUẬT TOÁN ĐỒNG THUẬN ĐA CẦU (MULTI-BRIDGE CONSENSUS) CHỌN 4 SỐ & 3 SỐ LOẠI TỐI ƯU
  // Gom nhóm 10 cầu theo số dự đoán loại (0..9) để tìm các số được nhiều cầu đồng thuận chỉ ra nhất
  const digitMap = new Map();
  for (let i = 0; i <= 9; i++) {
    digitMap.set(i.toString(), {
      digit: i.toString(),
      bridges: [],
      count: 0,
      totalScore: 0,
      maxStreak: 0,
      maxWinRate: 0
    });
  }

  for (const b of bridgeStats) {
    const d = b.predDigit;
    if (d !== undefined && d !== null && digitMap.has(d.toString())) {
      const entry = digitMap.get(d.toString());
      entry.bridges.push(b);
      entry.count += 1;
      entry.totalScore += b.aiScore;
      if (b.streak > entry.maxStreak) entry.maxStreak = b.streak;
      if (b.winRate > entry.maxWinRate) entry.maxWinRate = b.winRate;
    }
  }

  // Tính điểm ưu tiên cho từng con số loại
  const candidateList = Array.from(digitMap.values())
    .filter(item => item.count > 0)
    .map(item => {
      // Điểm thưởng đồng thuận đa cầu: 2 cầu trùng -> +600đ, 3 cầu trùng -> +1200đ
      const consensusBonus = item.count >= 2 ? (item.count - 1) * 600 : 0;
      
      // Tổng điểm chất lượng AI của các cầu chỉ ra số này
      const qualityScore = item.totalScore;
      
      // Thưởng streak thông tay của cầu tốt nhất
      const streakBonus = item.maxStreak * 20;
      
      // Thưởng tỷ lệ thắng
      const winRateBonus = item.maxWinRate * 1.5;

      const finalScore = consensusBonus + qualityScore + streakBonus + winRateBonus;

      // Tóm tắt tên cầu: ví dụ "Cầu 6 + Cầu 8"
      const bridgeNames = item.bridges.map(b => b.shortName).join(' + ');

      // Nhãn trạng thái
      let statusDesc = '';
      if (item.count >= 2) {
        statusDesc = `${item.count} cầu trùng (Thông ${item.maxStreak}t)`;
      } else {
        statusDesc = item.bridges[0]?.statusLabel || `Ăn ${item.maxStreak} tay`;
      }

      return {
        ...item,
        finalScore,
        bridgeNames,
        statusDesc
      };
    });

  // Sắp xếp ưu tiên:
  // 1. Số lượng cầu đồng thuận (2 cầu > 1 cầu)
  // 2. Tổng điểm cuối cùng (tổng điểm AI + streak + winRate)
  // 3. Chuỗi thông lớn nhất
  candidateList.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.maxStreak !== a.maxStreak) return b.maxStreak - a.maxStreak;
    return b.totalScore - a.totalScore;
  });

  const selectedLoai4 = [];
  const loai4Details = [];
  const seenDigits = new Set();

  for (let i = 0; i < candidateList.length; i++) {
    if (selectedLoai4.length >= 4) break;
    const item = candidateList[i];
    selectedLoai4.push(item.digit);
    seenDigits.add(item.digit);
    loai4Details.push({
      digit: item.digit,
      rank: selectedLoai4.length,
      rankBadge: selectedLoai4.length === 1 ? '🥇 TOP 1' : (selectedLoai4.length === 2 ? '🥈 TOP 2' : (selectedLoai4.length === 3 ? '🥉 TOP 3' : '🎖️ TOP 4')),
      bridgeName: item.bridgeNames,
      statusLabel: item.statusDesc,
      aiScore: Math.round(item.totalScore),
      bridgeCount: item.count
    });
  }

  // Nếu chưa đủ 4 số (do quá nhiều cầu trùng nhau), bù thêm từ các số có tần suất xuất hiện thấp nhất trong lịch sử Hậu Nhị
  if (selectedLoai4.length < 4) {
    const digitFreq = {};
    for (let i = 0; i < 10; i++) digitFreq[i.toString()] = 0;
    const checkLen = Math.min(15, ascData.length);
    for (let i = ascData.length - checkLen; i < ascData.length; i++) {
      const h = ascData[i].Result.slice(3, 5);
      for (const char of h) digitFreq[char] = (digitFreq[char] || 0) + 1;
    }
    const leastFreq = Object.keys(digitFreq).sort((a, b) => digitFreq[a] - digitFreq[b]);
    for (const d of leastFreq) {
      if (selectedLoai4.length >= 4) break;
      if (!seenDigits.has(d)) {
        seenDigits.add(d);
        selectedLoai4.push(d);
        loai4Details.push({
          digit: d,
          rank: selectedLoai4.length,
          rankBadge: `TOP ${selectedLoai4.length}`,
          bridgeName: 'Tần suất thấp',
          statusLabel: 'Ít nổ gần đây',
          aiScore: 60,
          bridgeCount: 0
        });
      }
    }
  }

  const loai4 = selectedLoai4.slice(0, 4);
  const loai3 = selectedLoai4.slice(0, 3);
  const loai3Details = loai4Details.slice(0, 3);

  const allDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const giu6 = allDigits.filter(d => !loai4.includes(d)).sort((a, b) => a - b);
  const giu7 = allDigits.filter(d => !loai3.includes(d)).sort((a, b) => a - b);

  // Sinh dàn 49 số & 50 số & 36 số (đánh số giữ lại)
  const dan49 = [];
  for (const d1 of giu7) for (const d2 of giu7) dan49.push(d1 + d2);

  const dan50 = [...dan49];
  const candidateExtra = allDigits.find(d => !giu7.includes(d));
  if (candidateExtra && dan50.length === 49) {
    dan50.push(candidateExtra + candidateExtra);
  }

  const dan36 = [];
  for (const d1 of giu6) for (const d2 of giu6) dan36.push(d1 + d2);

  const dan64 = [];
  const giu8 = allDigits.filter(d => !loai4.slice(0, 2).includes(d)).sort((a, b) => a - b);
  for (const d1 of giu8) for (const d2 of giu8) dan64.push(d1 + d2);

  // Sinh dàn 9 số & 16 số (bắt số loại)
  const dan9 = [];
  for (const d1 of loai3) for (const d2 of loai3) dan9.push(d1 + d2);

  const dan16 = [];
  for (const d1 of loai4) for (const d2 of loai4) dan16.push(d1 + d2);

  const digitCounts = {};
  const digitBridges = {};
  for (let i = 0; i < 10; i++) {
    const d = i.toString();
    digitCounts[d] = 0;
    digitBridges[d] = [];
  }
  rankedBridges.forEach(b => {
    if (b.predDigit) {
      digitCounts[b.predDigit] = (digitCounts[b.predDigit] || 0) + 1;
      digitBridges[b.predDigit].push(b.shortName);
    }
  });

  const recommendedBridges = rankedBridges.filter(b => b.isRecommended);

  let activeBridgeName = 'Cầu Bắt Chạm Loại Động (10 Cầu AI)';
  if (rankedBridges.length > 0) {
    const top1 = rankedBridges[0];
    activeBridgeName = `⭐ ${top1.rankBadge}: ${top1.shortName} (${top1.statusLabel})`;
  }

  const streakSummaries = rankedBridges.slice(0, 4)
    .map(b => `${b.rankBadge} ${b.shortName}: Loại ${b.predDigit} (${b.statusLabel})`);

  const trendReason = `⚡ TOP Cầu Dẫn Đầu: ${streakSummaries.join(' • ')}`;

  // 4. Danh sách 10 cầu theo thứ tự tĩnh cố định (Cầu 1 -> Cầu 10), gắn kèm thứ hạng AI
  const staticBridgeStats = bridgeStats.map(b => {
    const r = rankedBridges.find(x => x.id === b.id);
    return {
      ...b,
      rank: r ? r.rank : 10,
      rankBadge: r ? r.rankBadge : 'TOP 10'
    };
  });

  return {
    bridgeStats: staticBridgeStats,
    rankedBridges,
    recommendedBridges,
    digitCounts,
    digitBridges,
    loai4Details,
    loai3Details,
    loai3,
    giu7,
    loai4,
    giu6,
    giu8,
    dan64,
    dan50,
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
  addTouches([traTram, traDonVi], 30, `Bộ Số Trả Nhau Kubet: Trăm ${tram} trả ${traTram}, Đơn vị ${donVi} trả ${traDonVi}`);

  const sortedTouches = Object.keys(touchScores).sort((a, b) => touchScores[b] - touchScores[a]);
  const top4Touches = sortedTouches.slice(0, 4);

  return {
    touches: top4Touches,
    allTouches: sortedTouches.slice(0, 6),
    vipNumbers: Array.from(vipNumbers),
    nuoiBoNumbers: Array.from(nuoiBoNumbers),
    traNhauTouches: [traTram, traDonVi],
    samTongs: [],
    reasons: reasons,
    touchScores: touchScores
  };
};

// ============================================================================
// CHẤM ĐIỂM TOÀN DIỆN 100 SỐ 2D (THUẬT TOÁN CẦU KÈO TRẢ SỐ ĐỘNG KUBET)
// ============================================================================
export const calculateCauScore = (statsArray = [], scoredTongs = [], scoredSingles = [], rawData = [], loaiSo = null) => {
  if (!rawData || rawData.length === 0) return [];

  const ascData = [...rawData].reverse();
  const lastDraw = ascData[ascData.length - 1].Result;
  const lastHau = lastDraw.substring(3, 5);
  const lastChuc = lastHau[0];
  const lastDv = lastHau[1];
  const lastTram = lastDraw[2];

  // Lấy 4 số loại và các số giữ từ 10 Cầu Bắt Kèo
  const lSo = loaiSo || getLoaiSoHauNhi(rawData);
  const loai4 = lSo?.loai4 || [];
  const giu6 = lSo?.giu6 || [];
  const giu7 = lSo?.giu7 || [];
  const giu8 = lSo?.giu8 || [];

  // 1. THUẬT TOÁN CẦU KÈO TRẢ SỐ ĐỐI ỨNG KUBET
  const traChuc = BO_TRA_NHAU[lastChuc] || lastChuc;
  const traDv = BO_TRA_NHAU[lastDv] || lastDv;
  const traTram = BO_TRA_NHAU[lastTram] || lastTram;

  // 2. BÓNG DƯƠNG & BÓNG ÂM
  const bdChuc = getBongDuong(lastChuc);
  const bdDv = getBongDuong(lastDv);
  const bdTram = getBongDuong(lastTram);
  const baChuc = getBongAm(lastChuc);
  const baDv = getBongAm(lastDv);

  // 3. TỔNG TRẢ SỐ
  const sumHau = (parseInt(lastChuc) + parseInt(lastDv)) % 10;
  const sum5 = lastDraw.split('').reduce((a, b) => a + parseInt(b), 0) % 10;
  const bdSumHau = getBongDuong(sumHau.toString());

  // 4. CHẠM TRẢ SỐ TRỌNG ĐIỂM
  const touchWeights = {};
  for (let i = 0; i < 10; i++) touchWeights[i.toString()] = 0;

  // Thưởng chạm trả số đối ứng
  touchWeights[traDv] = (touchWeights[traDv] || 0) + 600;
  touchWeights[traChuc] = (touchWeights[traChuc] || 0) + 500;
  touchWeights[traTram] = (touchWeights[traTram] || 0) + 400;

  // Thưởng chạm bóng
  touchWeights[bdDv] = (touchWeights[bdDv] || 0) + 450;
  touchWeights[bdChuc] = (touchWeights[bdChuc] || 0) + 400;
  touchWeights[bdTram] = (touchWeights[bdTram] || 0) + 350;
  touchWeights[baDv] = (touchWeights[baDv] || 0) + 300;
  touchWeights[baChuc] = (touchWeights[baChuc] || 0) + 250;

  // Thưởng chạm tổng
  touchWeights[sumHau.toString()] = (touchWeights[sumHau.toString()] || 0) + 350;
  touchWeights[sum5.toString()] = (touchWeights[sum5.toString()] || 0) + 300;
  touchWeights[bdSumHau] = (touchWeights[bdSumHau] || 0) + 250;

  // Thưởng chạm bệt 3 kỳ gần nhất
  const recent3 = ascData.slice(-3);
  recent3.forEach(d => {
    const h = d.Result.slice(3, 5);
    touchWeights[h[0]] = (touchWeights[h[0]] || 0) + 150;
    touchWeights[h[1]] = (touchWeights[h[1]] || 0) + 150;
  });

  const stats = [];
  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, '0');
    const d1 = num[0];
    const d2 = num[1];

    let score = 0;
    const itemReasons = [];

    // Phạt số bị loại bởi 10 Cầu Bắt Kèo
    if (loai4.includes(d1) || loai4.includes(d2)) {
      score -= 10000;
    } else {
      // Điểm cơ bản cho số thuộc dàn giữ
      if (giu6.includes(d1) && giu6.includes(d2)) {
        score += 3000;
        itemReasons.push('Số Giữ Dàn 36s');
      } else if (giu7.includes(d1) && giu7.includes(d2)) {
        score += 2000;
        itemReasons.push('Số Giữ Dàn 50s');
      } else if (giu8.includes(d1) && giu8.includes(d2)) {
        score += 1000;
        itemReasons.push('Số Giữ Dàn 64s');
      }

      // Điểm Cầu Kèo Trả Số từ Chạm Trọng Điểm
      const tScore1 = touchWeights[d1] || 0;
      const tScore2 = touchWeights[d2] || 0;
      score += (tScore1 + tScore2);

      if (tScore1 >= 500 || tScore2 >= 500) {
        itemReasons.push('Chạm Trả Số Đối Ứng');
      }

      // Điểm thưởng cặp số trả nhau đối ứng
      if (d1 === traChuc && d2 === traDv) {
        score += 900;
        itemReasons.push('Cặp Trả Số Đối Ứng');
      }
      if (d1 === bdChuc && d2 === bdDv) {
        score += 700;
        itemReasons.push('Cặp Trả Số Bóng Dương');
      }

      // Kép bằng
      if (d1 === d2) {
        score += 350;
        itemReasons.push('Kép Trả Số');
      }
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
