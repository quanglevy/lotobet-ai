const fs = require('fs');
let c = fs.readFileSync('src/utils/statistics.js', 'utf8');

// --- Replace analyzeSingleDigits ---
const newAnalyzeSingle = `export const analyzeSingleDigits = (data) => {
  if (data.length === 0) return [];
  const ascData = [...data].reverse();
  const stats = {};
  for (let i = 0; i < 10; i++) {
    stats[i.toString()] = { number: i.toString(), score: 0, reason: [], countAll: 0 };
  }

  if (ascData.length === 0) return Object.values(stats);

  const bongDuong = d => ({'0':'5','5':'0','1':'6','6':'1','2':'7','7':'2','3':'8','8':'3','4':'9','9':'4'}[d]);
  
  const bacNhoMap = {
      '0': ['1', '9', '5'], '1': ['0', '2', '6'], '2': ['1', '3', '7'],
      '3': ['2', '4', '8'], '4': ['3', '5', '9'], '5': ['4', '6', '0'],
      '6': ['5', '7', '1'], '7': ['6', '8', '2'], '8': ['7', '9', '3'],
      '9': ['8', '0', '4']
  };

  const lastDraw = ascData[ascData.length - 1].Result;
  
  const addScore = (numStr, pts, rsn) => {
      if (stats[numStr]) {
          stats[numStr].score += pts;
          if (!stats[numStr].reason.includes(rsn)) stats[numStr].reason.push(rsn);
      }
  };

  const getPascal = (str) => {
      let current = str;
      while (current.length > 2) {
          let next = "";
          for (let i = 0; i < current.length - 1; i++) {
              next += ((parseInt(current[i]) + parseInt(current[i+1])) % 10).toString();
          }
          current = next;
      }
      return current;
  };
  
  const pascal = getPascal(lastDraw);
  addScore(pascal[0], 45, "Cầu Pascal");
  if (pascal[1] !== pascal[0]) addScore(pascal[1], 45, "Cầu Pascal");
  addScore(bongDuong(pascal[0]), 25, "Bóng Pascal");
  addScore(bongDuong(pascal[1]), 25, "Bóng Pascal");

  const tong5 = (lastDraw.split('').reduce((a,b) => a + parseInt(b), 0) % 10).toString();
  addScore(tong5, 35, "Chạm Tổng");
  addScore(bongDuong(tong5), 15, "Bóng Tổng");

  const hauNhi = lastDraw.slice(-2);
  const bn1 = bacNhoMap[hauNhi[0]];
  const bn2 = bacNhoMap[hauNhi[1]];
  [...bn1, ...bn2].forEach(n => addScore(n, 12, "Bạc Nhớ Âm Dương"));

  if (lastDraw[0] === lastDraw[2]) addScore(lastDraw[1], 30, "Kẹp Tiền");
  if (lastDraw[2] === lastDraw[4]) addScore(lastDraw[3], 30, "Kẹp Hậu");

  const dauDuoi = ((parseInt(lastDraw[0]) + parseInt(lastDraw[4])) % 10).toString();
  addScore(dauDuoi, 20, "Tổng Đầu Đuôi");

  const uniqueLast = [...new Set(lastDraw.split(''))];
  uniqueLast.forEach(d => {
      stats[d].score -= 15; 
  });

  return Object.values(stats).map(s => ({
      ...s,
      reason: s.reason.slice(0, 2).join(', ') || 'Ghép Cầu'
  })).sort((a, b) => b.score - a.score);
};`;

const parts1 = c.split('export const analyzeSingleDigits = (data) => {');
const tail1 = parts1[1].split(/export const (?:checkTXCL|calculateCauScore)/);
c = parts1[0] + newAnalyzeSingle + "\n\nexport const " + (c.includes("export const checkTXCL") ? "checkTXCL" : "calculateCauScore") + tail1[1];


// --- Replace predictTXCL ---
const newPredictTXCL = `export const predictTXCL = (data) => {
  if (data.length === 0) return { tx: 'TÀI', cl: 'CHẴN' };
  const ascData = [...data].reverse();
  
  const check = (str) => {
     const sum = str.split('').reduce((a, b) => a + parseInt(b), 0);
     return { tx: sum >= 23 ? 'TÀI' : 'XỈU', cl: sum % 2 === 0 ? 'CHẴN' : 'LẺ' };
  };

  const lastResult = ascData[ascData.length - 1].Result;
  const bongDuongMap = {'0':5,'1':6,'2':7,'3':8,'4':9,'5':0,'6':1,'7':2,'8':3,'9':4};
  
  let sumBong = 0;
  for (let i = 0; i < 5; i++) {
      sumBong += bongDuongMap[lastResult[i]];
  }
  
  const realSum = lastResult.split('').reduce((a, b) => a + parseInt(b), 0);
  
  let predTx = 'TÀI';
  if (realSum + sumBong >= 46 || realSum + sumBong <= 20) {
      predTx = 'XỈU'; 
  } else {
      predTx = sumBong >= 23 ? 'TÀI' : 'XỈU';
  }

  const getPascal = (str) => {
      let current = str;
      while (current.length > 1) {
          let next = "";
          for (let i = 0; i < current.length - 1; i++) {
              next += ((parseInt(current[i]) + parseInt(current[i+1])) % 10).toString();
          }
          current = next;
      }
      return current; 
  };
  const pDigit = parseInt(getPascal(lastResult));
  let predCl = pDigit % 2 === 0 ? 'CHẴN' : 'LẺ';

  if (ascData.length >= 3) {
      const txHistory = ascData.map(d => check(d.Result).tx);
      const clHistory = ascData.map(d => check(d.Result).cl);
      
      if (txHistory.slice(-3).every(x => x === 'TÀI')) predTx = 'TÀI';
      if (txHistory.slice(-3).every(x => x === 'XỈU')) predTx = 'XỈU';
      if (clHistory.slice(-3).every(x => x === 'CHẴN')) predCl = 'CHẴN';
      if (clHistory.slice(-3).every(x => x === 'LẺ')) predCl = 'LẺ';
  }

  return { tx: predTx, cl: predCl };
};`;

const oldTxclRegex = /export const predictTXCL = \(data\) => \{[\s\S]*?return \{ tx: predTx, cl: predCl \};\s*\};/;
c = c.replace(oldTxclRegex, newPredictTXCL);

fs.writeFileSync('src/utils/statistics.js', c, 'utf8');
