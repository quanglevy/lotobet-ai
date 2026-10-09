const fs = require('fs');
let c = fs.readFileSync('src/utils/statistics.js', 'utf8');

const oldFuncRegex = /export const predictTXCL = \(data\) => \{[\s\S]*?return \{ tx: predTx, cl: predCl \};\s*\};/;

const newFunc = `export const predictTXCL = (data) => {
  if (data.length < 2) return { tx: 'TÀI', cl: 'CHẴN' };
  
  const ascData = [...data].reverse();
  const txHistory = ascData.map(d => checkTXCL(d.Result).tx);
  const clHistory = ascData.map(d => checkTXCL(d.Result).cl);

  const recentTX = txHistory.slice(-5);
  const recentCL = clHistory.slice(-5);
  
  const countInArray = (arr, val) => arr.filter(x => x === val).length;

  let predTx = 'TÀI';
  if (countInArray(recentTX, 'TÀI') > countInArray(recentTX, 'XỈU')) predTx = 'TÀI';
  else if (countInArray(recentTX, 'TÀI') < countInArray(recentTX, 'XỈU')) predTx = 'XỈU';
  else {
     const lastTx = txHistory[txHistory.length - 1];
     let tCount = 0; let xCount = 0;
     for (let i = 0; i < txHistory.length - 1; i++) {
        if (txHistory[i] === lastTx) {
           if (txHistory[i+1] === 'TÀI') tCount++; else xCount++;
        }
     }
     predTx = tCount >= xCount ? 'TÀI' : 'XỈU';
  }

  let predCl = 'CHẴN';
  if (countInArray(recentCL, 'CHẴN') > countInArray(recentCL, 'LẺ')) predCl = 'CHẴN';
  else if (countInArray(recentCL, 'CHẴN') < countInArray(recentCL, 'LẺ')) predCl = 'LẺ';
  else {
     const lastCl = clHistory[clHistory.length - 1];
     let cCount = 0; let lCount = 0;
     for (let i = 0; i < clHistory.length - 1; i++) {
        if (clHistory[i] === lastCl) {
           if (clHistory[i+1] === 'CHẴN') cCount++; else lCount++;
        }
     }
     predCl = cCount >= lCount ? 'CHẴN' : 'LẺ';
  }

  if (txHistory.slice(-3).every(x => x === 'TÀI')) predTx = 'TÀI';
  if (txHistory.slice(-3).every(x => x === 'XỈU')) predTx = 'XỈU';
  if (clHistory.slice(-3).every(x => x === 'CHẴN')) predCl = 'CHẴN';
  if (clHistory.slice(-3).every(x => x === 'LẺ')) predCl = 'LẺ';

  const tL4 = txHistory.slice(-4);
  if (tL4.length === 4 && tL4[0] === tL4[2] && tL4[1] === tL4[3] && tL4[0] !== tL4[1]) predTx = tL4[2];
  
  const cL4 = clHistory.slice(-4);
  if (cL4.length === 4 && cL4[0] === cL4[2] && cL4[1] === cL4[3] && cL4[0] !== cL4[1]) predCl = cL4[2];

  return { tx: predTx, cl: predCl };
};`;

c = c.replace(oldFuncRegex, newFunc);
fs.writeFileSync('src/utils/statistics.js', c, 'utf8');
