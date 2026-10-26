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
    '0': '9', '9': '0',
    '1': '2', '2': '1',
    '3': '6', '6': '3',
    '4': '8', '8': '4',
    '5': '7', '7': '5'
  };
  return map[d.toString()] || d.toString();
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
// NÂNG CẤP CẢNH GIỚI TỐI THƯỢNG: HỘI ĐỒNG 14 CẦU VỊ TRÍ ĐỘNG & TỰ THÍCH NGHI (ADAPTIVE ENSEMBLE AI)
// ============================================================================
export const predictTXCL = (data) => {
  if (!data || data.length === 0) {
    return { 
      tx: 'TÀI', 
      cl: 'CHẴN', 
      rate: '88%', 
      txRate: '88%', 
      clRate: '88%', 
      txPattern: 'Mặc định', 
      clPattern: 'Mặc định', 
      reason: 'Khởi tạo mặc định' 
    };
  }

  const ascData = [...data].reverse();
  const n = ascData.length;
  const lastDraw = ascData[n - 1].Result;

  // 1. HỘI ĐỒNG 7 CẦU TÀI XỈU CỐT LÕI (CORE POSITIONAL & RHYTHM BRIDGES FOR TX)
  const txBridges = [
    {
      id: 'tx_1',
      name: 'Cầu Tổng Tiền Nhị (Vạn+Ngàn)',
      baseWeight: 140,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[1])) % 10) >= 5 ? 'TÀI' : 'XỈU'
    },
    {
      id: 'tx_2',
      name: 'Cầu Tổng 3 Con Đầu + 1',
      baseWeight: 135,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[1]) + parseInt(res[2]) + 1) % 10) >= 5 ? 'TÀI' : 'XỈU'
    },
    {
      id: 'tx_3',
      name: 'Cầu Tổng 3 Con Cuối (Tam Càng)',
      baseWeight: 120,
      calc: (res) => ((parseInt(res[2]) + parseInt(res[3]) + parseInt(res[4])) % 10) >= 5 ? 'TÀI' : 'XỈU'
    },
    {
      id: 'tx_4',
      name: 'Cầu Trục Lẻ (Vạn+Trăm+ĐV)',
      baseWeight: 115,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[2]) + parseInt(res[4])) % 10) >= 5 ? 'TÀI' : 'XỈU'
    },
    {
      id: 'tx_5',
      name: 'Cầu Chéo Vạn + Chục',
      baseWeight: 110,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[3])) % 10) >= 5 ? 'TÀI' : 'XỈU'
    },
    {
      id: 'tx_6',
      name: 'Cầu Chéo Ngàn + ĐV + 7',
      baseWeight: 105,
      calc: (res) => ((parseInt(res[1]) + parseInt(res[4]) + 7) % 10) >= 5 ? 'TÀI' : 'XỈU'
    },
    {
      id: 'tx_7',
      name: 'Cầu Hậu Nhị + Vạn + 7',
      baseWeight: 105,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[3]) + parseInt(res[4]) + 7) % 10) >= 5 ? 'TÀI' : 'XỈU'
    }
  ];

  // 2. HỘI ĐỒNG 7 CẦU CHẴN LẺ CỐT LÕI (CORE POSITIONAL & RHYTHM BRIDGES FOR CL)
  const clBridges = [
    {
      id: 'cl_1',
      name: 'Cầu Trục Lẻ Vạn+Trăm+ĐV',
      baseWeight: 135,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[2]) + parseInt(res[4]) + 8) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    },
    {
      id: 'cl_2',
      name: 'Cầu Đối Cực Vạn + ĐV',
      baseWeight: 130,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[4]) + 6) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    },
    {
      id: 'cl_3',
      name: 'Cầu Trục Chẵn Ngàn + Chục',
      baseWeight: 125,
      calc: (res) => ((parseInt(res[1]) + parseInt(res[3]) + 1) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    },
    {
      id: 'cl_4',
      name: 'Cầu Chéo Vạn + Chục',
      baseWeight: 120,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[3]) + 6) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    },
    {
      id: 'cl_5',
      name: 'Cầu Tâm Sát Trăm + Chục',
      baseWeight: 115,
      calc: (res) => ((parseInt(res[2]) + parseInt(res[3]) + 9) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    },
    {
      id: 'cl_6',
      name: 'Cầu Tam Giác Ngàn+Trăm+ĐV',
      baseWeight: 115,
      calc: (res) => ((parseInt(res[1]) + parseInt(res[2]) + parseInt(res[4]) + 6) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    },
    {
      id: 'cl_7',
      name: 'Cầu Tiền Chục Vạn+Ngàn+Chục',
      baseWeight: 110,
      calc: (res) => ((parseInt(res[0]) + parseInt(res[1]) + parseInt(res[3]) + 9) % 10) >= 5 ? 'CHẴN' : 'LẺ'
    }
  ];

  // 3. Hàm chấm điểm tự thích nghi (Adaptive Rolling Backtest + Auto-Inversion)
  const evaluateEnsemble = (bridges, typeKey, posLabel, negLabel) => {
    let posVote = 0;
    let negVote = 0;
    let bestBridgeName = '';
    let bestBridgeScore = -1;

    bridges.forEach(b => {
      let wins = 0;
      let checked = 0;
      let streak = 0;
      let loseStreak = 0;
      let streakDone = false;

      const lookback = Math.min(3, n - 1);
      for (let i = n - 2; i >= Math.max(0, n - 1 - lookback); i--) {
        const pred = b.calc(ascData[i].Result);
        const actual = checkTXCL(ascData[i + 1].Result)[typeKey];
        const isWin = pred === actual;
        checked++;
        if (isWin) wins++;

        if (!streakDone) {
          if (streak === 0 && loseStreak === 0) {
            if (isWin) streak = 1;
            else loseStreak = 1;
          } else if (streak > 0 && isWin) {
            streak++;
          } else if (loseStreak > 0 && !isWin) {
            loseStreak++;
          } else {
            streakDone = true;
          }
        }
      }

      let rawPred = b.calc(lastDraw);
      let weight = b.baseWeight;

      if (checked > 0) {
        const winRate = wins / checked;
        if (winRate >= 0.7) {
          weight += winRate * 120 + streak * 35;
        } else if (winRate <= 0.25 && checked >= 3) {
          // Cầu đang chạy nghịch hoàn toàn -> tự động đảo chiều cầu (Bẻ Cầu Nghịch)!
          rawPred = rawPred === posLabel ? negLabel : posLabel;
          weight += (1 - winRate) * 90 + loseStreak * 25;
        } else {
          weight = weight * (0.5 + winRate) + streak * 20 - loseStreak * 30;
        }
      }

      weight = Math.max(10, weight);
      if (rawPred === posLabel) posVote += weight;
      else negVote += weight;

      if (weight > bestBridgeScore) {
        bestBridgeScore = weight;
        bestBridgeName = `${b.name} (${rawPred})`;
      }
    });

    const finalPred = posVote >= negVote ? posLabel : negLabel;
    const totalVote = posVote + negVote || 1;
    const winVote = Math.max(posVote, negVote);
    const conf = Math.min(96, Math.max(76, Math.round((winVote / totalVote) * 100 + 8)));

    return {
      pred: finalPred,
      conf,
      bestBridgeName
    };
  };

  const txRes = evaluateEnsemble(txBridges, 'tx', 'TÀI', 'XỈU');
  const clRes = evaluateEnsemble(clBridges, 'cl', 'CHẴN', 'LẺ');

  return {
    tx: txRes.pred,
    cl: clRes.pred,
    rate: `${Math.round((txRes.conf + clRes.conf) / 2)}%`,
    txRate: `${txRes.conf}%`,
    clRate: `${clRes.conf}%`,
    txPattern: txRes.bestBridgeName,
    clPattern: clRes.bestBridgeName,
    reason: `${txRes.bestBridgeName} • ${clRes.bestBridgeName}`
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
    name: 'Cầu 10 (Bóng Âm Chục Ngàn)',
    shortName: 'Cầu 10 (Bóng Âm Vạn)',
    calc: (res) => getBongAm(res[0]),
    calcFormula: (res) => {
      const digit = getBongAm(res[0]);
      return {
        formulaText: `Bóng âm của Chục Ngàn(${res[0]}) ➔ Loại ${digit}`,
        digit
      };
    }
  },
  {
    id: 'cau_11',
    name: 'Cầu 11 (Tổng 3 Con Đầu)',
    shortName: 'Cầu 11 (3 Con Đầu)',
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
  const prevDraw = nDraws >= 2 ? ascData[nDraws - 2].Result : null;

  const cVan = lastDraw[0];
  const cNgan = lastDraw[1];
  const cTram = lastDraw[2];
  const cChuc = lastDraw[3];
  const cDonVi = lastDraw[4];
  const bongDuongDV = getBongDuong(cDonVi);
  const bongDuongVan = getBongDuong(cVan);

  const charCounts = {};
  for (const ch of lastDraw) charCounts[ch] = (charCounts[ch] || 0) + 1;
  const maxCharRepeat = Math.max(...Object.values(charCounts));
  const hasTriple = maxCharRepeat >= 3;

  const prevHau = prevDraw ? prevDraw.slice(3, 5) : '';
  const isPrevHauKep = prevHau.length === 2 && prevHau[0] === prevHau[1];

  // 1. Phân tích 11 CẦU qua lịch sử các kỳ (Nâng cấp Supreme V2)
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
    const wins5 = history10.slice(0, 5).filter(h => h.isWin).length;
    const wins3 = history10.slice(0, 3).filter(h => h.isWin).length;

    // Phân tích trạng thái nhịp AI chi tiết:
    const h0 = history10[0]?.isWin;
    const h1 = history10[1]?.isWin;
    const h2 = history10[2]?.isWin;

    // 1. Phục hồi 1 kỳ trượt (1-Miss Recovery): kỳ gần nhất thắng, kỳ trước đó trượt, và trước đó nữa lại thắng
    const is1MissRecovery = h0 === true && h1 === false && (history10.length < 3 || h2 === true);
    
    // 2. Cầu siêu bền vừa lỡ nhịp 1 kỳ (1-Dip Resilience): tỷ lệ thắng >= 88%, ăn >= 4/5 kỳ gần nhất, vừa trượt đúng 1 tay
    let prevStreakBeforeDip = 0;
    if (h0 === false) {
      for (let i = 1; i < history10.length; i++) {
        if (history10[i].isWin) prevStreakBeforeDip++;
        else break;
      }
    }
    const is1DipResilient = h0 === false && hitStreak === 1 && winRate >= 88 && wins5 >= 4;

    // 3. Cầu gãy kép (Multi-loss): gãy liên tiếp >= 2 kỳ
    const isMultiLoss = h0 === false && h1 === false;

    // 4. Ưu tiên cấu trúc 8 cầu chủ lực có độ ổn định cao nhất
    const isPrimaryBridge = ['cau_1', 'cau_2', 'cau_3', 'cau_4', 'cau_5', 'cau_7', 'cau_8', 'cau_11'].includes(bridge.id);
    const primaryBonus = isPrimaryBridge ? 65 : -40;

    // TÍNH ĐIỂM AI SUPREME V2:
    let aiScore = winRate * 1.8 + wins5 * 35 + wins3 * 25 + primaryBonus;

    if (h0 === true) {
      aiScore += 60 + Math.min(streak, 10) * 28;
      if (is1MissRecovery) aiScore += 45;
    } else if (is1DipResilient) {
      aiScore += 55;
    } else {
      aiScore -= 250;
      if (isMultiLoss) aiScore -= 120;
    }

    let statusType = 'normal';
    let statusLabel = `Ăn ${streak} tay (${winRate}%)`;
    if (h0 === false) {
      if (is1DipResilient) {
        statusType = 'recovery';
        statusLabel = `🛡️ Siêu bền chờ hồi nhịp (${winRate}%)`;
      } else {
        statusType = 'broken';
        statusLabel = isMultiLoss ? `⚠️ Gãy ${hitStreak} tay liên tiếp` : `⚠️ Vừa gãy nhịp (${winRate}%)`;
      }
    } else if (is1MissRecovery) {
      statusType = 'recovery';
      statusLabel = `⚡ HỒI NHỊP (Trượt 1 nối lại)`;
    } else if (streak >= 5) {
      statusType = 'dragon';
      statusLabel = `🔥 RỒNG LỬA (Thông ${streak} tay)`;
    } else if (streak >= 3) {
      statusType = 'hot';
      statusLabel = `🔥 THÔNG ${streak} TAY`;
    } else {
      statusType = 'normal';
      statusLabel = `✅ Ăn ${streak} tay (${winRate}%)`;
    }

    const isRecommended = (h0 === true && (streak >= 3 || is1MissRecovery || (streak >= 2 && winRate >= 80))) || is1DipResilient;

    return {
      id: bridge.id,
      name: bridge.name,
      shortName: bridge.shortName,
      streak,
      hitStreak,
      totalWins,
      totalChecked,
      winRate,
      wins5,
      wins3,
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

  // 2. Xếp hạng 11 cầu theo AI Score, Streak, WinRate
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

  // 3. THUẬT TOÁN LỌC SỐ LOẠI SUPREME V2 (CHỐNG NHIỄM CẦU GÃY + LÁ CHẮN BẠC NHỚ CHỐNG CHẠM NỔ)
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

  // Tính điểm ưu tiên Supreme V2 cho từng con số loại:
  const candidateList = Array.from(digitMap.values())
    .filter(item => item.count > 0)
    .map(item => {
      const d = item.digit;
      const winningBridges = item.bridges.filter(b => b.history10[0]?.isWin === true || b.is1DipResilient);
      const justBrokenBridges = item.bridges.filter(b => b.history10[0]?.isWin === false && b.hitStreak === 1 && !b.is1DipResilient);
      const allBrokenBridges = item.bridges.filter(b => b.history10[0]?.isWin === false && !b.is1DipResilient);

      const activeWinCount = winningBridges.length;
      const activeLossCount = allBrokenBridges.length;

      const sortedWin = [...winningBridges].sort((a, b) => b.aiScore - a.aiScore);
      const bestBridge = sortedWin[0] || item.bridges[0];
      let finalScore = bestBridge ? bestBridge.aiScore : 0;

      // Cộng hưởng đồng thuận SẠCH (chỉ thưởng khi không bị vướng cầu gãy nào)
      if (winningBridges.length >= 2 && allBrokenBridges.length === 0) {
        finalScore += sortedWin[1].aiScore * 0.45 + 110;
      }

      // Phạt nặng nếu con số bị nhiễm cầu vừa gãy nhịp (hitStreak === 1) hoặc tụ tập quá đông kèm cầu gãy
      if (justBrokenBridges.length > 0) {
        finalScore -= justBrokenBridges.length * 600;
      }
      if (winningBridges.length >= 3 && allBrokenBridges.length > 0) {
        finalScore -= 800;
      }

      // LÁ CHẮN BẠC NHỚ CHỐNG CHẠM NỔ (HOT TOUCH SHIELD - Tuyệt đối bảo vệ không đưa chạm cực kết vào Top 4 Loại):
      if (d === cTram && d === bongDuongDV) {
        finalScore -= 1200; // Trùng Tâm Trăm + Bóng Dương ĐV -> Chạm cực nóng dễ nổ
      }
      if (hasTriple && (d === bongDuongDV || d === bongDuongVan)) {
        finalScore -= 1200; // Kỳ trước có Sám Cô -> Bóng dương ĐV / Vạn rất dễ nổ
      }
      if (isPrevHauKep && d === prevHau[0]) {
        finalScore -= 1200; // Bạc nhớ Kép Hậu Nhị cách 1 kỳ -> Rất dễ rơi lại chạm Kép đó
      }
      if (d === cNgan && cNgan === getBongAm(cVan)) {
        finalScore -= 1200; // Thế Ngàn = Bóng Âm Vạn -> Chạm khóa cổ rất hay rơi xuống Hậu Nhị
      }
      if ((d === cDonVi || d === cChuc) && (!bestBridge || bestBridge.winRate < 82)) {
        finalScore -= 900; // Không loại số bệt lại của Hậu Nhị kỳ trước nếu cầu không đạt độ bền >= 82%
      }

      const winMaxStreak = winningBridges.length > 0 ? Math.max(...winningBridges.map(b => b.streak)) : 0;
      const bridgeNames = item.bridges.map(b => b.shortName).join(' + ');

      let statusDesc = '';
      if (activeWinCount >= 2 && allBrokenBridges.length === 0) {
        statusDesc = `${activeWinCount} cầu đồng thuận sạch (Thông ${winMaxStreak}t)`;
      } else if (activeWinCount >= 1) {
        statusDesc = bestBridge.statusLabel;
      } else {
        statusDesc = `⚠️ ${activeLossCount} cầu đang gãy`;
      }

      return {
        ...item,
        activeWinCount,
        activeLossCount,
        winMaxStreak,
        finalScore,
        bridgeNames,
        statusDesc
      };
    });

  // Sắp xếp trực tiếp theo điểm tổng hợp Supreme V2 (finalScore)
  candidateList.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.winMaxStreak !== a.winMaxStreak) return b.winMaxStreak - a.winMaxStreak;
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
      aiScore: Math.round(item.finalScore > 0 ? item.finalScore : item.totalScore),
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

// ============================================================================
// THUẬT TOÁN BẮT 3 CHẠM CỨNG & 4 CHẠM CỨNG ĐA TẦNG (MULTI-TIER SMART TOUCHES)
// ============================================================================
export const calculateSmartTouches = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      sortedTouches: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      top4Touches: ['0', '1', '2', '3'],
      top3Touches: ['0', '1', '2'],
      top2Touches: ['0', '1'],
      dan64So: [],
      dan51So: [],
      dan36So: [],
      dan16Ghep: [],
      dan25Ghep: [],
      touchScores: {},
      touchReasons: {},
      touchDetails: []
    };
  }

  const ascData = [...rawData].reverse();
  const lastDraw = ascData[ascData.length - 1].Result;
  const lastHau = lastDraw.slice(3, 5); // 2 con cuối
  const cChuc = lastHau[0];
  const cDonVi = lastHau[1];
  const cTram = lastDraw[2];
  const cNgan = lastDraw[1];
  const cChucNgan = lastDraw[0];

  const prev2Draw = ascData.length >= 2 ? ascData[ascData.length - 2].Result : null;
  const prev2Hau = prev2Draw ? prev2Draw.slice(3, 5) : null;

  const sumHau = (parseInt(cChuc) + parseInt(cDonVi)) % 10;
  const sum5 = (parseInt(cChucNgan) + parseInt(cNgan) + parseInt(cTram) + parseInt(cChuc) + parseInt(cDonVi)) % 10;

  // 1. Phân tích 10 Cầu Loại
  const loaiInfo = getLoaiSoHauNhi(rawData);
  const bridgeStats = loaiInfo.bridgeStats || [];

  // Khởi tạo điểm cho 10 chạm (0..9)
  const touchScores = {};
  const touchReasons = {};
  for (let i = 0; i <= 9; i++) {
    touchScores[i.toString()] = 100; // Điểm nền
    touchReasons[i.toString()] = [];
  }

  // 2. CHẠM RƠI TRỰC TIẾP TỪ HẬU NHỊ KỲ TRƯỚC (Ưu tiên bậc nhất)
  touchScores[cChuc] += 280;
  touchReasons[cChuc].push(`Chạm Rơi Hàng Chục (${cChuc}) (+280đ)`);
  touchScores[cDonVi] += 290;
  touchReasons[cDonVi].push(`Chạm Rơi Hàng ĐV (${cDonVi}) (+290đ)`);

  // Bệt Chạm: Nếu kỳ trước nữa cũng có chạm này -> Chạm Bệt Đang Ăn Cực Mạnh
  if (prev2Hau) {
    if (prev2Hau.includes(cChuc)) {
      touchScores[cChuc] += 200;
      touchReasons[cChuc].push(`Chạm ${cChuc} Bệt 2 kỳ liên tiếp (+200đ)`);
    }
    if (prev2Hau.includes(cDonVi)) {
      touchScores[cDonVi] += 200;
      touchReasons[cDonVi].push(`Chạm ${cDonVi} Bệt 2 kỳ liên tiếp (+200đ)`);
    }
  }

  // 3. BÓNG DƯƠNG VÀ BÓNG ÂM CỦA HẬU NHỊ
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

  // 4. CHẠM TỔNG HẬU NHỊ & BÓNG CỦA TỔNG
  touchScores[sumHau.toString()] += 190;
  touchReasons[sumHau.toString()].push(`Chạm Tổng Hậu (${sumHau}) (+190đ)`);
  const bongSumHau = getBongDuong(sumHau.toString());
  touchScores[bongSumHau] += 180;
  touchReasons[bongSumHau].push(`Bóng Dương Tổng Hậu (${bongSumHau}) (+180đ)`);
  const bongAmSumHau = getBongAm(sumHau.toString());
  touchScores[bongAmSumHau] += 170;
  touchReasons[bongAmSumHau].push(`Bóng Âm Tổng Hậu (${bongAmSumHau}) (+170đ)`);

  // 5. CHẠM TỪ HÀNG TRĂM & BÓNG
  touchScores[cTram] += 160;
  touchReasons[cTram].push(`Chạm Tâm Hàng Trăm (${cTram}) (+160đ)`);
  const bongTram = getBongDuong(cTram);
  touchScores[bongTram] += 130;

  // 6. BỘ TRẢ NHAU BẠC NHỚ
  const traList = BO_TRA_NHAU[lastHau] || [];
  traList.forEach(num => {
    touchScores[num[0]] += 90;
    touchScores[num[1]] += 90;
  });

  // 7. PHÂN TÍCH TƯƠNG TÁC THÔNG MINH VỚI 10 CẦU LOẠI
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
        // CẦU GÃY BÁO LOẠI -> TÍN HIỆU BẺ CẦU NỔ NGƯỢC
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

  const touchDetails = sortedTouches.map((digit, idx) => {
    let rankBadge = `TOP ${idx + 1}`;
    if (idx === 0) rankBadge = '🥇 CHẠM 1';
    else if (idx === 1) rankBadge = '🥈 CHẠM 2';
    else if (idx === 2) rankBadge = '🥉 CHẠM 3';
    else if (idx === 3) rankBadge = '🎖️ CHẠM 4';

    return {
      digit,
      rank: idx + 1,
      rankBadge,
      score: touchScores[digit],
      reasons: touchReasons[digit] || [],
      isClean: !winningLoaiDigits.has(digit),
      isDrop: digit === cChuc || digit === cDonVi
    };
  });

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
    touchReasons,
    touchDetails
  };
};

// ============================================================================
// 🤖 THUẬT TOÁN AI PHÂN TÍCH & SO SÁNH: ĐÁNH TIỀN NHỊ HAY HẬU NHỊ TỐT HƠN?
// ============================================================================
export const analyzeTienVsHau = (historyList10 = [], smartTouches = null, mode = 'touch4') => {
  if (!historyList10 || historyList10.length === 0) {
    return {
      recommendation: 'HAU_NHI',
      badgeText: '⚡ ƯU TIÊN ĐÁNH HẬU NHỊ',
      subBadge: 'Đang thu thập thêm dữ liệu kỳ quay',
      tienRate10: 0,
      hauRate10: 0,
      tienWins10: 0,
      hauWins10: 0,
      tienWins5: 0,
      hauWins5: 0,
      total10: 0,
      total5: 0,
      tienStatusText: 'Chưa đủ dữ liệu',
      hauStatusText: 'Chưa đủ dữ liệu',
      reasonText: 'Cần tối thiểu 2 kỳ kết quả để AI đối chiếu tỷ lệ Tiền Nhị và Hậu Nhị.',
      confidence: 75,
      colorTheme: 'emerald'
    };
  }

  const hauKey = mode === 'touch4' ? 'isTouch4Hit' : (mode === 'touch3' ? 'isTouch3Hit' : 'isGhep25Hit');
  const tienKey = mode === 'touch4' ? 'isTouch4TienHit' : (mode === 'touch3' ? 'isTouch3TienHit' : 'isGhep25TienHit');
  const labelName = mode === 'touch4' ? '4 Chạm' : (mode === 'touch3' ? '3 Chạm' : 'Dàn 25s');
  const expectedBaseRate = mode === 'touch4' ? 60 : (mode === 'touch3' ? 50 : 25);

  const total10 = historyList10.length;
  const recent5List = historyList10.slice(0, Math.min(5, total10));
  const total5 = recent5List.length;

  const hauWins10 = historyList10.filter(h => h && h[hauKey]).length;
  const tienWins10 = historyList10.filter(h => h && h[tienKey]).length;
  const hauRate10 = total10 > 0 ? Math.round((hauWins10 / total10) * 100) : 0;
  const tienRate10 = total10 > 0 ? Math.round((tienWins10 / total10) * 100) : 0;

  const hauWins5 = recent5List.filter(h => h && h[hauKey]).length;
  const tienWins5 = recent5List.filter(h => h && h[tienKey]).length;
  const hauRate5 = total5 > 0 ? Math.round((hauWins5 / total5) * 100) : 0;
  const tienRate5 = total5 > 0 ? Math.round((tienWins5 / total5) * 100) : 0;

  // Tính chuỗi thông / chuỗi gãy hiện tại (từ kỳ mới nhất historyList10[0])
  const getStreak = (key) => {
    let winStreak = 0;
    let loseStreak = 0;
    for (let i = 0; i < historyList10.length; i++) {
      const isHit = Boolean(historyList10[i]?.[key]);
      if (i === 0) {
        if (isHit) winStreak = 1;
        else loseStreak = 1;
      } else {
        if (winStreak > 0 && isHit) winStreak++;
        else if (loseStreak > 0 && !isHit) loseStreak++;
        else break;
      }
    }
    return { winStreak, loseStreak };
  };

  const hauStreak = getStreak(hauKey);
  const tienStreak = getStreak(tienKey);

  // Đánh giá trạng thái nhịp và điểm thưởng/phạt cho từng miền (Tiền vs Hậu)
  const evaluateZone = (rate10, rate5, wins5, streak) => {
    let score = rate10 * 0.45 + rate5 * 0.40;
    let statusText = '';

    if (streak.winStreak >= 3) {
      score += 22;
      statusText = `🔥 Đang thông ${streak.winStreak} kỳ liên tiếp`;
    } else if (streak.winStreak === 2) {
      score += 18;
      statusText = `⚡ Đang thông 2 kỳ (Nhịp đều)`;
    } else if (streak.winStreak === 1) {
      score += 12;
      statusText = `✅ Vừa nổ kỳ trước (Đà thuận)`;
    } else if (streak.loseStreak === 1) {
      if (rate10 >= expectedBaseRate && wins5 >= Math.ceil(total5 * 0.5)) {
        score += 20;
        statusText = `💎 Vừa nghỉ 1 kỳ (Điểm vàng hồi nhịp)`;
      } else {
        score -= 8;
        statusText = `⚠️ Vừa trượt 1 kỳ (Phong độ thấp)`;
      }
    } else if (streak.loseStreak === 2) {
      if (rate10 >= expectedBaseRate + 10) {
        score += 5;
        statusText = `🔄 Nghỉ 2 kỳ (Canh hồi nhịp Tay 3)`;
      } else {
        score -= 25;
        statusText = `❌ Đang gãy 2 kỳ liên tiếp (Cầu yếu)`;
      }
    } else if (streak.loseStreak >= 3) {
      score -= 40;
      statusText = `🚨 Đang gãy ${streak.loseStreak} kỳ thông (Nên né)`;
    }

    return { score, statusText };
  };

  const tienEval = evaluateZone(tienRate10, tienRate5, tienWins5, tienStreak);
  const hauEval = evaluateZone(hauRate10, hauRate5, hauWins5, hauStreak);

  const diff = tienEval.score - hauEval.score;
  let recommendation = 'HAU_NHI';
  let badgeText = '';
  let subBadge = '';
  let reasonText = '';
  let colorTheme = 'emerald';
  let confidence = 80;

  if (diff >= 6) {
    recommendation = 'TIEN_NHI';
    colorTheme = 'amber';
    confidence = Math.min(95, Math.max(75, Math.round(72 + diff * 0.5)));
    badgeText = `🔥 AI KHUYÊN ĐÁNH: TIỀN NHỊ (2 SỐ ĐẦU) TỐT HƠN`;
    subBadge = `Ưu thế Tiền Nhị vượt trội (+${Math.round(diff)} điểm AI)`;
    reasonText = `Trong ${total10} kỳ qua, ${labelName} ăn TIỀN NHỊ ${tienWins10}/${total10} kỳ (${tienRate10}%), 5 kỳ gần nhất trúng ${tienWins5}/${total5} (${tienEval.statusText}). Vượt trội hơn HẬU NHỊ (${hauWins10}/${total10} kỳ - ${hauRate10}%, ${hauEval.statusText}).`;
  } else if (diff <= -6) {
    recommendation = 'HAU_NHI';
    colorTheme = 'emerald';
    confidence = Math.min(95, Math.max(75, Math.round(72 + Math.abs(diff) * 0.5)));
    badgeText = `⚡ AI KHUYÊN ĐÁNH: HẬU NHỊ (2 SỐ CUỐI) TỐT HƠN`;
    subBadge = `Ưu thế Hậu Nhị vượt trội (+${Math.round(Math.abs(diff))} điểm AI)`;
    reasonText = `Trong ${total10} kỳ qua, ${labelName} ăn HẬU NHỊ ${hauWins10}/${total10} kỳ (${hauRate10}%), 5 kỳ gần nhất trúng ${hauWins5}/${total5} (${hauEval.statusText}). Tốt hơn hẳn TIỀN NHỊ (${tienWins10}/${total10} kỳ - ${tienRate10}%, ${tienEval.statusText}).`;
  } else {
    // Chênh lệch nhỏ (-6 < diff < 6)
    if (tienRate10 >= expectedBaseRate && hauRate10 >= expectedBaseRate) {
      recommendation = 'CA_HAI';
      colorTheme = 'cyan';
      confidence = Math.min(92, Math.round((tienRate10 + hauRate10) / 2 + 5));
      const slightWinner = tienEval.score >= hauEval.score ? 'Tiền Nhị' : 'Hậu Nhị';
      badgeText = `💎 CẢ TIỀN NHỊ & HẬU NHỊ ĐỀU ĐẸP (ƯU TIÊN ${slightWinner.toUpperCase()})`;
      subBadge = `Cầu nổ song hành cả 2 đầu (${tienRate10}% vs ${hauRate10}%)`;
      reasonText = `Cả 2 miền đều đang ăn rất đều: Tiền Nhị trúng ${tienWins10}/${total10} (${tienRate10}% - ${tienEval.statusText}) và Hậu Nhị trúng ${hauWins10}/${total10} (${hauRate10}% - ${hauEval.statusText}). Có thể đánh song thủ hoặc nghiêng nhẹ về ${slightWinner}.`;
    } else if (tienEval.score >= hauEval.score) {
      recommendation = 'TIEN_NHI';
      colorTheme = 'amber';
      confidence = Math.max(68, tienRate10 + 10);
      badgeText = `🔥 AI KHUYÊN ĐÁNH: NGHIÊNG VỀ TIỀN NHỊ (2 SỐ ĐẦU)`;
      subBadge = `Nhịp Tiền Nhị ổn định hơn Hậu Nhị`;
      reasonText = `Tiền Nhị đạt ${tienWins10}/${total10} kỳ (${tienRate10}%, 5 kỳ gần ăn ${tienWins5}/${total5} - ${tienEval.statusText}), có nhịp cầu an toàn hơn Hậu Nhị (${hauWins10}/${total10} kỳ - ${hauRate10}%, ${hauEval.statusText}).`;
    } else {
      recommendation = 'HAU_NHI';
      colorTheme = 'emerald';
      confidence = Math.max(68, hauRate10 + 10);
      badgeText = `⚡ AI KHUYÊN ĐÁNH: NGHIÊNG VỀ HẬU NHỊ (2 SỐ CUỐI)`;
      subBadge = `Nhịp Hậu Nhị ổn định hơn Tiền Nhị`;
      reasonText = `Hậu Nhị đạt ${hauWins10}/${total10} kỳ (${hauRate10}%, 5 kỳ gần ăn ${hauWins5}/${total5} - ${hauEval.statusText}), có nhịp cầu an toàn hơn Tiền Nhị (${tienWins10}/${total10} kỳ - ${tienRate10}%, ${tienEval.statusText}).`;
    }
  }

  return {
    recommendation,
    badgeText,
    subBadge,
    tienRate10,
    hauRate10,
    tienWins10,
    hauWins10,
    tienWins5,
    hauWins5,
    tienRate5,
    hauRate5,
    total10,
    total5,
    tienStatusText: tienEval.statusText,
    hauStatusText: hauEval.statusText,
    tienScore: Math.round(tienEval.score),
    hauScore: Math.round(hauEval.score),
    reasonText,
    confidence,
    colorTheme
  };
};

// ============================================================================
// 🏆 HỆ THỐNG QUẢN LÝ & MÔ PHỎNG NUÔI KHUNG 3 KỲ QUAY (TỰ ĐỘNG RESET VỀ TAY 1 KHI TRÚNG)
// ============================================================================
export const calculateKhung3Ky = (rawData, strategyType = 'touch3') => {
  if (!rawData || rawData.length < 3) {
    return {
      currentKhung: null,
      historyKhungs: [],
      stats: { totalKhung: 0, winCount: 0, winRate: 0, winStep1: 0, winStep2: 0, winStep3: 0, lossCount: 0 }
    };
  }

  const ascData = [...rawData].reverse(); // Từ kỳ cũ nhất đến kỳ mới nhất
  const n = ascData.length;
  const historyKhungs = [];
  let i = 2; // Khởi đầu sau khi đã có tối thiểu 2-3 kỳ làm dữ liệu phân tích

  const isTienMode = strategyType === 'touch4_tien' || strategyType === 'touch3_tien';

  const getPredForSlice = (slice) => {
    if (strategyType === 'touch3' || strategyType === 'touch3_tien') {
      const touches = calculateSmartTouches(slice);
      const modeLabel = strategyType === 'touch3_tien' ? 'Tiền Nhị' : 'Hậu Nhị';
      return {
        predNumbers: touches.dan51So || [],
        title: `TOP 3 Chạm Cứng (${modeLabel})`,
        shortBadge: `3 Chạm ${modeLabel} [${(touches.top3Touches || []).join(',')}]`,
        danSize: (touches.dan51So || []).length,
        extraInfo: `3 Chạm (${modeLabel}): ${(touches.top3Touches || []).join(', ')}`,
        touches: touches.top3Touches || [],
        isTien: strategyType === 'touch3_tien'
      };
    } else if (strategyType === 'touch4' || strategyType === 'touch4_tien') {
      const touches = calculateSmartTouches(slice);
      const modeLabel = strategyType === 'touch4_tien' ? 'Tiền Nhị' : 'Hậu Nhị';
      return {
        predNumbers: touches.dan64So || [],
        title: `TOP 4 Chạm Cứng (${modeLabel})`,
        shortBadge: `4 Chạm ${modeLabel} [${(touches.top4Touches || []).join(',')}]`,
        danSize: (touches.dan64So || []).length,
        extraInfo: `4 Chạm (${modeLabel}): ${(touches.top4Touches || []).join(', ')}`,
        touches: touches.top4Touches || [],
        isTien: strategyType === 'touch4_tien'
      };
    } else if (strategyType === 'loai4_dan36') {
      const loai = getLoaiSoHauNhi(slice);
      return {
        predNumbers: loai.dan36 || [],
        title: 'Dàn 36 Số (Kèo Loại 4 Số)',
        shortBadge: `Bỏ 4 số [${(loai.loai4 || []).join(',')}]`,
        danSize: (loai.dan36 || []).length,
        extraInfo: `Bỏ số: ${(loai.loai4 || []).join(', ')}`,
        loai4: loai.loai4 || []
      };
    } else if (strategyType === 'ghep25') {
      const touches = calculateSmartTouches(slice);
      return {
        predNumbers: touches.dan25Ghep || [],
        title: 'Dàn Ghép Trong 25 Số',
        shortBadge: `Ghép 5 Chạm [${(touches.sortedTouches || []).slice(0, 5).join(',')}]`,
        danSize: (touches.dan25Ghep || []).length,
        extraInfo: `Ghép chạm: ${(touches.sortedTouches || []).slice(0, 5).join(', ')}`
      };
    } else if (strategyType === 'txcl') {
      const txclPred = predictTXCL(slice);
      return {
        predNumbers: [],
        title: `Tài Xỉu (${txclPred.tx})`,
        shortBadge: `Tài Xỉu: ${txclPred.tx}`,
        danSize: 50,
        extraInfo: `Dự đoán: ${txclPred.tx} (${txclPred.rate || '85%'})`,
        txcl: txclPred
      };
    }

    // Default fallback to touch3
    const touches = calculateSmartTouches(slice);
    return {
      predNumbers: touches.dan51So || [],
      title: 'TOP 3 Chạm Cứng',
      shortBadge: `3 Chạm [${(touches.top3Touches || []).join(',')}]`,
      danSize: (touches.dan51So || []).length,
      extraInfo: `3 Chạm: ${(touches.top3Touches || []).join(', ')}`,
      touches: touches.top3Touches || []
    };
  };

  const isWinCheck = (predObj, resDraw) => {
    if (!resDraw || !resDraw.Result || resDraw.Result.length < 5) return false;
    const resTarget = isTienMode ? resDraw.Result.slice(0, 2) : resDraw.Result.slice(3, 5);
    if (strategyType === 'txcl') {
      const actual = checkTXCL(resDraw.Result);
      return actual.tx === predObj.txcl?.tx;
    }
    return (predObj.predNumbers || []).includes(resTarget);
  };

  let currentKhung = null;

  while (i < n) {
    const slice = ascData.slice(0, i + 1).reverse();
    const predObj = getPredForSlice(slice);
    const startDraw = ascData[i];
    const startDrawId = startDraw.Draw_ID;

    // 1. Kiểm tra Tay 1 (Kỳ i + 1)
    if (i + 1 >= n) {
      currentKhung = {
        step: 1,
        maxSteps: 3,
        startDrawId,
        predObj,
        betRatio: '1x (Tỉ lệ 1)',
        stepHistory: []
      };
      break;
    }

    const d1 = ascData[i + 1];
    const resHau1 = isTienMode ? d1.Result.slice(0, 2) : d1.Result.slice(3, 5);
    const win1 = isWinCheck(predObj, d1);

    if (win1) {
      historyKhungs.push({
        khungIndex: historyKhungs.length + 1,
        startDrawId,
        endDrawId: d1.Draw_ID,
        predObj,
        status: 'WIN',
        hitStep: 1,
        steps: [
          { step: 1, drawId: d1.Draw_ID, result: d1.Result, resultHau: resHau1, isHit: true }
        ]
      });
      i += 1; // Ăn Tay 1 -> Reset ngay về Tay 1 cho kỳ tiếp theo
      continue;
    }

    // 2. Trượt Tay 1 -> Kiểm tra Tay 2 (Kỳ i + 2)
    if (i + 2 >= n) {
      currentKhung = {
        step: 2,
        maxSteps: 3,
        startDrawId,
        predObj,
        betRatio: '3x (Tỉ lệ 3)',
        stepHistory: [
          { step: 1, drawId: d1.Draw_ID, result: d1.Result, resultHau: resHau1, isHit: false }
        ]
      };
      break;
    }

    const d2 = ascData[i + 2];
    const resHau2 = isTienMode ? d2.Result.slice(0, 2) : d2.Result.slice(3, 5);
    const win2 = isWinCheck(predObj, d2);

    if (win2) {
      historyKhungs.push({
        khungIndex: historyKhungs.length + 1,
        startDrawId,
        endDrawId: d2.Draw_ID,
        predObj,
        status: 'WIN',
        hitStep: 2,
        steps: [
          { step: 1, drawId: d1.Draw_ID, result: d1.Result, resultHau: resHau1, isHit: false },
          { step: 2, drawId: d2.Draw_ID, result: d2.Result, resultHau: resHau2, isHit: true }
        ]
      });
      i += 2; // Ăn Tay 2 -> Reset ngay về Tay 1 cho kỳ tiếp theo
      continue;
    }

    // 3. Trượt Tay 2 -> Kiểm tra Tay 3 (Kỳ i + 3)
    if (i + 3 >= n) {
      currentKhung = {
        step: 3,
        maxSteps: 3,
        startDrawId,
        predObj,
        betRatio: '8x (Tỉ lệ 8)',
        stepHistory: [
          { step: 1, drawId: d1.Draw_ID, result: d1.Result, resultHau: resHau1, isHit: false },
          { step: 2, drawId: d2.Draw_ID, result: d2.Result, resultHau: resHau2, isHit: false }
        ]
      };
      break;
    }

    const d3 = ascData[i + 3];
    const resHau3 = isTienMode ? d3.Result.slice(0, 2) : d3.Result.slice(3, 5);
    const win3 = isWinCheck(predObj, d3);

    if (win3) {
      historyKhungs.push({
        khungIndex: historyKhungs.length + 1,
        startDrawId,
        endDrawId: d3.Draw_ID,
        predObj,
        status: 'WIN',
        hitStep: 3,
        steps: [
          { step: 1, drawId: d1.Draw_ID, result: d1.Result, resultHau: resHau1, isHit: false },
          { step: 2, drawId: d2.Draw_ID, result: d2.Result, resultHau: resHau2, isHit: false },
          { step: 3, drawId: d3.Draw_ID, result: d3.Result, resultHau: resHau3, isHit: true }
        ]
      });
      i += 3; // Ăn Tay 3 -> Reset ngay về Tay 1 cho kỳ tiếp theo
      continue;
    } else {
      // Gãy Khung (Trượt cả 3 Tay)
      historyKhungs.push({
        khungIndex: historyKhungs.length + 1,
        startDrawId,
        endDrawId: d3.Draw_ID,
        predObj,
        status: 'LOSS',
        hitStep: null,
        steps: [
          { step: 1, drawId: d1.Draw_ID, result: d1.Result, resultHau: resHau1, isHit: false },
          { step: 2, drawId: d2.Draw_ID, result: d2.Result, resultHau: resHau2, isHit: false },
          { step: 3, drawId: d3.Draw_ID, result: d3.Result, resultHau: resHau3, isHit: false }
        ]
      });
      i += 3; // Hết khung 3 tay -> Reset sang Khung mới ở Tay 1
      continue;
    }
  }

  // Đảo ngược danh sách lịch sử khung để hiển thị khung mới nhất lên đầu
  const reversedHistoryKhungs = [...historyKhungs].reverse();

  const totalKhung = historyKhungs.length;
  const winCount = historyKhungs.filter(k => k.status === 'WIN').length;
  const winRate = totalKhung > 0 ? Math.round((winCount / totalKhung) * 100) : 0;
  const winStep1 = historyKhungs.filter(k => k.hitStep === 1).length;
  const winStep2 = historyKhungs.filter(k => k.hitStep === 2).length;
  const winStep3 = historyKhungs.filter(k => k.hitStep === 3).length;
  const lossCount = historyKhungs.filter(k => k.status === 'LOSS').length;

  return {
    currentKhung,
    historyKhungs: reversedHistoryKhungs,
    stats: {
      totalKhung,
      winCount,
      winRate,
      winStep1,
      winStep2,
      winStep3,
      lossCount
    }
  };
};

