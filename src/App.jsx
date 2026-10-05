import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Brain, Plus, Copy, Trash2, ShieldCheck, Flame } from 'lucide-react';
import { 
  analyzeUnified2D, 
  calculateCauScore, 
  generateReversibleSet, 
  analyzeSingleDigits, 
  analyzeTong, 
  generateReversibleSetFromDan, 
  predictTXCL, 
  checkTXCL,
  getBacNhoAnalysis,
  getLoaiSoHauNhi
} from "./utils/statistics";

const ExecutiveDashboard = ({ 
  data, 
  dan2, 
  dan4, 
  dan10, 
  dan20, 
  dan36, 
  dan50, 
  dan64, 
  topSingles, 
  loaiSo,
  historyCheck, 
  historyList3 = [], 
  historyList10 = [],
  txcl, 
  handleCopy, 
  handleDeleteResult,
  bacNhoInfo
}) => {

  const wins4 = historyList10.filter(h => h && h.isLoai4Hit).length;
  const wins3 = historyList10.filter(h => h && h.isLoai3Hit).length;
  const winsTX = historyList10.filter(h => h && h.pTXCL && h.actualTXCL && h.pTXCL.tx === h.actualTXCL.tx).length;
  const winsCL = historyList10.filter(h => h && h.pTXCL && h.actualTXCL && h.pTXCL.cl === h.actualTXCL.cl).length;
  const total = historyList10.length;
  const rate4 = total > 0 ? Math.round((wins4 / total) * 100) : 0;
  const rate3 = total > 0 ? Math.round((wins3 / total) * 100) : 0;
  const rateTX = total > 0 ? Math.round((winsTX / total) * 100) : 0;
  const rateCL = total > 0 ? Math.round((winsCL / total) * 100) : 0;

  const renderStreak10Loai4 = () => {
    if (!historyList10 || historyList10.length === 0) return null;

    return (
      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
            ⚡ KẾT QUẢ 10 KỲ GẦN NHẤT (KÈO LOẠI 4 SỐ - ĐÁNH 6S):
          </span>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: wins4 >= 7 ? '#34d399' : (wins4 >= 5 ? '#fbbf24' : '#f87171'), backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569' }}>
            {wins4}/{total} Trúng ({rate4}%)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[...historyList10].reverse().map((h, idx) => {
            const isWin = h.isLoai4Hit;
            const drawNum = h.drawId ? h.drawId.slice(-3) : (idx + 1);
            return (
              <div 
                key={idx}
                title={`Kỳ ${drawNum}: ${isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Về Hậu: ${h.resultHau || ''} | Bỏ 4 số: [${(h.pLoaiSo?.loai4 || []).join(',')}]`}
                style={{
                  backgroundColor: isWin ? '#065f46' : '#7f1d1d',
                  border: isWin ? '1px solid #34d399' : '1px solid #ef4444',
                  color: 'white',
                  borderRadius: '5px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  boxShadow: isWin ? '0 1px 4px rgba(52, 211, 153, 0.4)' : '0 1px 4px rgba(239, 68, 68, 0.4)'
                }}
              >
                <span style={{ color: '#cbd5e1', fontSize: '10px' }}>{drawNum}:</span>
                <span style={{ fontSize: '12px' }}>{isWin ? '✅' : '❌'}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStreak10Loai3 = () => {
    if (!historyList10 || historyList10.length === 0) return null;

    return (
      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>
            🛡️ KẾT QUẢ 10 KỲ GẦN NHẤT (KÈO LOẠI 3 SỐ - ĐÁNH 7S):
          </span>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: wins3 >= 7 ? '#34d399' : (wins3 >= 5 ? '#fbbf24' : '#f87171'), backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569' }}>
            {wins3}/{total} Trúng ({rate3}%)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[...historyList10].reverse().map((h, idx) => {
            const isWin = h.isLoai3Hit;
            const drawNum = h.drawId ? h.drawId.slice(-3) : (idx + 1);
            return (
              <div 
                key={idx}
                title={`Kỳ ${drawNum}: ${isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Về Hậu: ${h.resultHau || ''} | Bỏ 3 số: [${(h.pLoaiSo?.loai3 || []).join(',')}]`}
                style={{
                  backgroundColor: isWin ? '#065f46' : '#7f1d1d',
                  border: isWin ? '1px solid #34d399' : '1px solid #ef4444',
                  color: 'white',
                  borderRadius: '5px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  boxShadow: isWin ? '0 1px 4px rgba(52, 211, 153, 0.4)' : '0 1px 4px rgba(239, 68, 68, 0.4)'
                }}
              >
                <span style={{ color: '#cbd5e1', fontSize: '10px' }}>{drawNum}:</span>
                <span style={{ fontSize: '12px' }}>{isWin ? '✅' : '❌'}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStreak10TXCL = () => {
    if (!historyList10 || historyList10.length === 0) return null;

    return (
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Dòng 1: Thống kê 10 kỳ Tài Xỉu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>
              🎲 KẾT QUẢ 10 KỲ (TÀI XỈU):
            </span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: winsTX >= 7 ? '#34d399' : (winsTX >= 5 ? '#fbbf24' : '#f87171'), backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569' }}>
              {winsTX}/{total} Trúng ({rateTX}%)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[...historyList10].reverse().map((h, idx) => {
              const isWin = h.pTXCL && h.actualTXCL && h.pTXCL.tx === h.actualTXCL.tx;
              const drawNum = h.drawId ? h.drawId.slice(-3) : (idx + 1);
              const predTX = h.pTXCL ? h.pTXCL.tx : '';
              const actTX = h.actualTXCL ? h.actualTXCL.tx : '';
              const actSum = h.actualTXCL ? h.actualTXCL.sum : '';

              return (
                <div 
                  key={idx}
                  title={`Kỳ ${drawNum}: ${isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Dự đoán: ${predTX} | Thực tế: Tổng ${actSum} (${actTX})`}
                  style={{
                    backgroundColor: isWin ? '#065f46' : '#7f1d1d',
                    border: isWin ? '1px solid #34d399' : '1px solid #ef4444',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '2px 6px',
                    fontSize: '10.5px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    boxShadow: isWin ? '0 1px 4px rgba(52, 211, 153, 0.4)' : '0 1px 4px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <span style={{ color: '#cbd5e1', fontSize: '10px' }}>{drawNum}:</span>
                  <span style={{ fontSize: '10px', color: '#e2e8f0' }}>{predTX}</span>
                  <span style={{ fontSize: '11px' }}>{isWin ? '✅' : '❌'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dòng 2: Thống kê 10 kỳ Chẵn Lẻ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#f472b6', fontWeight: 'bold' }}>
              ⚖️ KẾT QUẢ 10 KỲ (CHẴN LẺ):
            </span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: winsCL >= 7 ? '#34d399' : (winsCL >= 5 ? '#fbbf24' : '#f87171'), backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569' }}>
              {winsCL}/{total} Trúng ({rateCL}%)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[...historyList10].reverse().map((h, idx) => {
              const isWin = h.pTXCL && h.actualTXCL && h.pTXCL.cl === h.actualTXCL.cl;
              const drawNum = h.drawId ? h.drawId.slice(-3) : (idx + 1);
              const predCL = h.pTXCL ? h.pTXCL.cl : '';
              const actCL = h.actualTXCL ? h.actualTXCL.cl : '';
              const actSum = h.actualTXCL ? h.actualTXCL.sum : '';

              return (
                <div 
                  key={idx}
                  title={`Kỳ ${drawNum}: ${isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Dự đoán: ${predCL} | Thực tế: Tổng ${actSum} (${actCL})`}
                  style={{
                    backgroundColor: isWin ? '#065f46' : '#7f1d1d',
                    border: isWin ? '1px solid #34d399' : '1px solid #ef4444',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '2px 6px',
                    fontSize: '10.5px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    boxShadow: isWin ? '0 1px 4px rgba(52, 211, 153, 0.4)' : '0 1px 4px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <span style={{ color: '#cbd5e1', fontSize: '10px' }}>{drawNum}:</span>
                  <span style={{ fontSize: '10px', color: '#e2e8f0' }}>{predCL}</span>
                  <span style={{ fontSize: '11px' }}>{isWin ? '✅' : '❌'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDanStreak10Mini = (key) => {
    if (!historyList10 || historyList10.length === 0) return null;
    const wins = historyList10.filter(h => h && h[key]).length;
    const total = historyList10.length;
    const rate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '10.5px', color: '#94a3b8', marginRight: '2px' }}>
          10 kỳ: <strong style={{ color: wins >= 7 ? '#34d399' : (wins >= 5 ? '#fbbf24' : '#f87171') }}>{wins}/{total} ({rate}%)</strong>
        </span>
        {[...historyList10].reverse().map((h, idx) => {
          const isWin = h[key];
          const drawNum = h.drawId ? h.drawId.slice(-3) : (idx + 1);
          return (
            <span 
              key={idx}
              title={`Kỳ ${drawNum}: ${isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Về Hậu: ${h.resultHau || ''}`}
              style={{
                backgroundColor: isWin ? '#065f46' : '#7f1d1d',
                border: isWin ? '1px solid #34d399' : '1px solid #ef4444',
                color: 'white',
                borderRadius: '3px',
                padding: '1px 4px',
                fontSize: '9.5px',
                fontWeight: 'bold'
              }}
            >
              {drawNum}:{isWin ? '✅' : '❌'}
            </span>
          );
        })}
      </div>
    );
  };

  const renderTXCLHit = (prediction, actual) => {
    const isHit = prediction === actual;
    return (
      <div style={{ 
         backgroundColor: isHit ? "#ef4444" : "rgba(107, 114, 128, 0.2)", 
         color: isHit ? "white" : "#6b7280",
         padding: "0.4rem 0.8rem", 
         borderRadius: "6px", 
         fontWeight: "bold", 
         fontSize: "1.1rem",
         display: "flex",
         alignItems: "center",
         gap: "6px",
         border: isHit ? "none" : "1px solid rgba(107, 114, 128, 0.5)"
      }}>
        <span style={{ textDecoration: isHit ? "none" : "line-through" }}>{prediction}</span> 
        <span style={{ fontSize: "14px", fontWeight: "900" }}>{isHit ? "✅" : "❌"}</span>
      </div>
    );
  };

  const renderCopyButton = (balls = [], label = "") => (
    <button 
      onClick={() => handleCopy(balls || [], label)}
      style={{ 
        width: "fit-content", 
        alignSelf: "flex-start", 
        backgroundColor: "#1f2937", 
        color: "#d1d5db", 
        padding: "0.25rem 0.75rem", 
        borderRadius: "0.25rem", 
        border: "1px solid #374151", 
        fontSize: "0.75rem", 
        display: "flex", 
        alignItems: "center", 
        gap: "0.25rem", 
        cursor: "pointer" 
      }}
    >
      <Copy size={12} /> COPY
    </button>
  );

  const renderBalls = (balls = [], small = false, highlightHau = null, highlightTien = null) => {
    if (!balls || !Array.isArray(balls)) return null;
    return balls.map((b, i) => {
      let isHit = false;
      const numStr = typeof b === 'string' ? b : (b?.number || '');
      if (!numStr) return null;
      if (highlightHau && highlightTien) {
        if (numStr === highlightHau || numStr === highlightTien) isHit = true;
      } else if (highlightHau) {
        if (numStr === highlightHau) isHit = true;
      }
      return (
        <div key={i} style={{
          color: isHit ? '#ef4444' : '#06b6d4',
          fontWeight: 'bold',
          fontSize: small ? '0.875rem' : '1.125rem',
          marginRight: small ? '6px' : '12px',
          marginBottom: small ? '4px' : '8px',
          display: 'inline-block',
          backgroundColor: isHit ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
          padding: isHit ? '0 4px' : '0',
          borderRadius: '3px'
        }}>
          {numStr}{isHit ? '✓' : ''}
        </div>
      );
    });
  };

  const renderSingles = (singlesArray = [], actualResult = null) => {
    if (!singlesArray || !Array.isArray(singlesArray)) return null;
    return singlesArray.map((s, i) => {
       const isHit = actualResult && typeof actualResult === 'string' && actualResult.includes(s);
       return (
         <span key={i} style={{ 
           color: isHit ? '#ef4444' : '#facc15', 
           fontWeight: 'bold', 
           marginRight: '8px',
           backgroundColor: isHit ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
           padding: isHit ? '0 4px' : '0',
           borderRadius: '3px'
         }}>
           {s}{isHit ? '✓' : ''}
         </span>
       );
    });
  };

  return (
    <div className="p-2 md:p-8 flex flex-col gap-6 w-full overflow-hidden">
      
      {/* ========================================================================= */}
      {/* KHU VỰC TOP: 3 TỔNG HỢP KÈO CHỦ LỰC (LOẠI 4 SỐ, LOẠI 3 SỐ, TÀI XỈU - CHẴN LẺ) */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        
        {/* 1. MỤC LOẠI 4 SỐ (KÈO CHỦ LỰC - ƯU TIÊN TOP 1..4) */}
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1.5px solid #f59e0b', boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={18} color="#f59e0b" /> ⚡ TỔNG HỢP KÈO LOẠI 4 SỐ (HẬU NHỊ):
            </span>
            <span style={{ backgroundColor: '#78350f', color: '#fde68a', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', border: '1px solid #b45309' }}>
              Đánh 6 Số (Dàn 36 Số)
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 4 Số Bỏ Cụ Thể (Cầu 10, 7, 5, 6) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem', width: '95px' }}>⚡ BỎ 4 SỐ:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(loaiSo?.loai4Details || []).length > 0 ? (
                  loaiSo.loai4Details.map((item, i) => (
                    <div 
                      key={i} 
                      title={`${item.rankBadge}: ${item.bridgeName} | Trạng thái: ${item.statusLabel} | Điểm AI: ${item.aiScore}đ`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        backgroundColor: '#1e293b', 
                        padding: '3px 10px', 
                        borderRadius: '8px', 
                        boxShadow: i === 0 ? '0 0 8px rgba(245, 158, 11, 0.35)' : '0 2px 4px rgba(0,0,0,0.4)',
                        border: i === 0 ? '1.5px solid #f59e0b' : '1px solid #334155'
                      }}
                    >
                      <span style={{ color: i === 0 ? '#facc15' : '#ffffff', fontWeight: '900', fontSize: '1.35rem' }}>
                        {item.digit}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '10px', lineHeight: '1.15' }}>
                        <span style={{ color: i === 0 ? '#fde047' : (i === 1 ? '#93c5fd' : (i === 2 ? '#fdba74' : '#86efac')), fontWeight: 'bold' }}>{item.rankBadge}</span>
                        <span style={{ color: '#94a3b8' }}>{item.bridgeName}</span>
                      </div>
                    </div>
                  ))
                ) : (loaiSo?.loai4 || []).map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#1e293b', padding: '3px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.35rem' }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút copy dàn 36 số & dàn 16 số */}
            {(loaiSo?.dan36 || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {renderCopyButton(loaiSo?.dan36 || [], "Dàn 36 Số Hậu Nhị (Đánh 6 Số Giữ)")}
                {renderCopyButton(loaiSo?.dan16 || [], "⚡ Dàn 16 Số (Bắt 4 Số Loại)")}
              </div>
            )}

            {/* Thống kê 10 kỳ trực tiếp ngay trong Kèo Loại 4 Số */}
            {renderStreak10Loai4()}
          </div>
        </div>

        {/* 2. MỤC LOẠI 3 SỐ (AN TOÀN CAO - ƯU TIÊN TOP 1..3) */}
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="#38bdf8" /> 🛡️ TỔNG HỢP KÈO LOẠI 3 SỐ (AN TOÀN CAO):
            </span>
            <span style={{ backgroundColor: '#0c4a6e', color: '#bae6fd', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', border: '1px solid #0284c7' }}>
              Đánh 7 Số (Dàn 49 Số)
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 3 Số Bỏ Cụ Thể (Cầu 10, 7, 5) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem', width: '95px' }}>🛡️ BỎ 3 SỐ:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(loaiSo?.loai3Details || []).length > 0 ? (
                  loaiSo.loai3Details.map((item, i) => (
                    <div 
                      key={i} 
                      title={`${item.rankBadge}: ${item.bridgeName} | Trạng thái: ${item.statusLabel} | Điểm AI: ${item.aiScore}đ`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        backgroundColor: '#1e293b', 
                        padding: '3px 10px', 
                        borderRadius: '8px', 
                        boxShadow: i === 0 ? '0 0 8px rgba(56, 189, 248, 0.35)' : '0 2px 4px rgba(0,0,0,0.4)',
                        border: i === 0 ? '1.5px solid #38bdf8' : '1px solid #334155'
                      }}
                    >
                      <span style={{ color: i === 0 ? '#38bdf8' : '#ffffff', fontWeight: '900', fontSize: '1.35rem' }}>
                        {item.digit}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '10px', lineHeight: '1.15' }}>
                        <span style={{ color: i === 0 ? '#7dd3fc' : (i === 1 ? '#93c5fd' : '#fdba74'), fontWeight: 'bold' }}>{item.rankBadge}</span>
                        <span style={{ color: '#94a3b8' }}>{item.bridgeName}</span>
                      </div>
                    </div>
                  ))
                ) : (loaiSo?.loai3 || []).map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#1e293b', padding: '3px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.35rem' }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút copy dàn 49 số & dàn 9 số */}
            {(loaiSo?.dan49 || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {renderCopyButton(loaiSo?.dan49 || [], "Dàn 49 Số Hậu Nhị (Đánh 7 Số Giữ)")}
                {renderCopyButton(loaiSo?.dan9 || [], "🎯 Dàn 9 Số (Bắt 3 Số Loại)")}
              </div>
            )}

            {/* Thống kê 10 kỳ trực tiếp ngay trong Kèo Loại 3 Số */}
            {renderStreak10Loai3()}
          </div>
        </div>

        {/* 3. MỤC TÀI XỈU & CHẴN LẺ (TỔNG 5 SỐ - KHUNG 3 TAY) */}
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1.5px solid #ec4899', boxShadow: '0 0 10px rgba(236, 72, 153, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ color: '#f472b6', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px' }}>🎲</span> ⚡ TỔNG HỢP KÈO TÀI XỈU - CHẴN LẺ (TỔNG 5 SỐ):
            </span>
            <span style={{ backgroundColor: '#831843', color: '#fbcfe8', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', border: '1px solid #db2777' }}>
              Khung 3 Tay - Bắt Nhịp AI
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 2 Khung Dự Đoán: TÀI XỈU & CHẴN LẺ */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Dự đoán Tài Xỉu */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: '#1e293b', 
                padding: '6px 14px', 
                borderRadius: '8px', 
                border: '1.5px solid #06b6d4',
                boxShadow: '0 0 8px rgba(6, 182, 212, 0.25)'
              }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TÀI XỈU:</span>
                <span style={{ color: txcl.tx === 'TÀI' ? '#38bdf8' : '#fb923c', fontWeight: '900', fontSize: '1.35rem' }}>
                  {txcl.tx}
                </span>
                <span style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', fontSize: '10.5px', fontWeight: 'bold', padding: '2px 7px', borderRadius: '4px' }}>
                  {txcl.txRate || txcl.rate || '85%'}
                </span>
              </div>

              {/* Dự đoán Chẵn Lẻ */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: '#1e293b', 
                padding: '6px 14px', 
                borderRadius: '8px', 
                border: '1.5px solid #ec4899',
                boxShadow: '0 0 8px rgba(236, 72, 153, 0.25)'
              }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>CHẴN LẺ:</span>
                <span style={{ color: txcl.cl === 'CHẴN' ? '#facc15' : '#f472b6', fontWeight: '900', fontSize: '1.35rem' }}>
                  {txcl.cl}
                </span>
                <span style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#fbcfe8', fontSize: '10.5px', fontWeight: 'bold', padding: '2px 7px', borderRadius: '4px' }}>
                  {txcl.clRate || '80%'}
                </span>
              </div>
            </div>

            {/* Lý do cầu AI */}
            {txcl.reason && (
              <div style={{ fontSize: '11.5px', color: '#cbd5e1', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '5px 10px', borderRadius: '5px', borderLeft: '3px solid #ec4899' }}>
                <strong style={{ color: '#f472b6' }}>Cơ sở cầu:</strong> {txcl.reason}
              </div>
            )}

            {/* Thống kê 10 kỳ trực tiếp của Tài Xỉu & Chẵn Lẻ */}
            {renderStreak10TXCL()}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* KHU VỰC CHÍNH: SONG SONG BẢNG 10 CẦU BẮT SỐ & ĐỐI CHIẾU 10 CẦU KỲ VỪA XỔ */}
      {/* ========================================================================= */}
      <div className="dashboard-layout">
        
        <div className="dashboard-col-main">
          
          {/* Header song song 2 cột */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
            {/* Header Cột Trái */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#064e3b', padding: '8px 12px', borderRadius: '8px', border: '1px solid #059669', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🟢 BẢNG 10 CẦU BẮT SỐ (CẦU 1 ➔ CẦU 10)
              </span>
              <span style={{ fontSize: '11px', color: '#a7f3d0' }}>Đối Chiếu Song Song Cố Định</span>
            </div>

            {/* Header Cột Phải */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#064e3b', padding: '8px 12px', borderRadius: '8px', border: '1px solid #059669', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🟢 ĐỐI CHIẾU 10 CẦU KỲ VỪA XỔ (CẦU 1 ➔ CẦU 10):
              </span>
              <span style={{ fontSize: '11px', color: '#a7f3d0' }}>
                Về Hậu Nhị: <strong style={{ color: '#facc15' }}>{historyCheck?.resultHau || '--'}</strong>
              </span>
            </div>

          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8', paddingLeft: '4px', fontStyle: 'italic', marginTop: '-12px' }}>
            * Bố cục cố định từ Cầu 1 đến Cầu 10 xếp song song trực tiếp với kết quả đối chiếu từng kỳ xổ.
          </div>

          {/* 10 HÀNG SONG SONG CHO 10 CẦU */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(loaiSo?.bridgeStats || []).map((b, idx) => {
              const isTop1 = b.rank === 1;
              const isTop2 = b.rank === 2;
              const isTop3 = b.rank === 3;
              const isTop4 = b.rank === 4;
              const isTop = isTop1 || isTop2 || isTop3 || isTop4;

              let borderColor = '#334155';
              let bgColor = '#0f172a';
              if (isTop1) {
                borderColor = '#facc15';
                bgColor = 'rgba(120, 53, 15, 0.35)';
              } else if (isTop2) {
                borderColor = '#38bdf8';
                bgColor = 'rgba(12, 74, 110, 0.35)';
              } else if (isTop3) {
                borderColor = '#fb923c';
                bgColor = 'rgba(124, 45, 18, 0.3)';
              } else if (isTop4) {
                borderColor = '#10b981';
                bgColor = 'rgba(6, 78, 59, 0.35)';
              }

              // Lấy đối chiếu kỳ trước của riêng cầu này
              const prevBridge = historyCheck?.pLoaiSo?.bridgeStats?.find(x => x.id === b.id) || historyCheck?.pLoaiSo?.bridgeStats?.[idx];
              const isWinPrev = (prevBridge && historyCheck?.resultHau) ? !historyCheck.resultHau.includes(prevBridge.predDigit) : null;
              
              const hist10 = b.history10 || [];
              const wins10 = hist10.filter(h => h.isWin).length;
              const total10 = hist10.length;
              const rate10 = total10 > 0 ? Math.round((wins10 / total10) * 100) : 0;

              return (
                <div key={b.id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>
                  
                  {/* CARD BÊN TRÁI: DỰ ĐOÁN KỲ TỚI */}
                  <div 
                    style={{
                      backgroundColor: bgColor,
                      border: isTop ? `1.5px solid ${borderColor}` : '1px solid #334155',
                      boxShadow: isTop1 ? '0 0 14px rgba(250, 204, 21, 0.35)' : (isTop ? `0 0 8px ${borderColor}40` : 'none'),
                      borderRadius: '10px',
                      padding: '9px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '5px'
                    }}
                  >
                    {/* Hàng 1: Badge + Tên cầu + Tag trạng thái | Số Loại */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexWrap: 'wrap' }}>
                        <span style={{ 
                          backgroundColor: isTop1 ? '#ca8a04' : (isTop2 ? '#0284c7' : (isTop3 ? '#c2410c' : (isTop4 ? '#059669' : '#334155'))), 
                          color: isTop1 ? 'black' : 'white', 
                          fontWeight: '900', 
                          fontSize: '11px', 
                          padding: '2px 7px', 
                          borderRadius: '5px',
                          flexShrink: 0,
                          boxShadow: isTop ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                        }}>
                          {b.rankBadge}
                        </span>
                        
                        <span style={{ fontWeight: 'bold', fontSize: '12.5px', color: isTop ? '#f8fafc' : '#cbd5e1' }}>
                          {b.name}
                        </span>

                        {b.is1MissRecovery && (
                          <span style={{ backgroundColor: '#0284c7', color: 'white', fontWeight: '900', fontSize: '9.5px', padding: '1px 6px', borderRadius: '9999px', boxShadow: '0 0 6px rgba(56, 189, 248, 0.8)', flexShrink: 0 }}>
                            ⚡ HỒI NHỊP
                          </span>
                        )}
                        {!b.is1MissRecovery && b.streak >= 3 && (
                          <span style={{ backgroundColor: '#10b981', color: '#022c22', fontWeight: '900', fontSize: '9.5px', padding: '1px 6px', borderRadius: '9999px', boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)', flexShrink: 0 }}>
                            🔥 THÔNG {b.streak} TAY
                          </span>
                        )}
                        {!b.is1MissRecovery && b.is1DipResilient && (
                          <span style={{ backgroundColor: '#d97706', color: 'white', fontWeight: 'bold', fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
                            🛡️ SIÊU BỀN
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: 'auto' }}>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '11.5px' }}>LOẠI:</span>
                        <span style={{ backgroundColor: '#1e293b', color: '#f8fafc', fontWeight: '900', fontSize: '1.25rem', padding: '1px 9px', borderRadius: '6px', border: '1px solid #475569', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: '1.2' }}>
                          {b.predDigit}
                        </span>
                      </div>
                    </div>

                    {/* Hàng 2: Công thức + Điểm AI */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px', fontSize: '11px' }}>
                      <div style={{ color: '#38bdf8', fontWeight: '500' }}>
                        📐 {b.formulaText}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '10.5px', display: 'flex', gap: '6px' }}>
                        <span>Tỷ lệ ăn: <strong style={{ color: b.winRate >= 80 ? '#34d399' : '#fbbf24' }}>{b.totalWins}/{b.totalChecked} ({b.winRate}%)</strong></span>
                        <span>• Điểm AI: <strong style={{ color: '#facc15' }}>{b.aiScore}đ</strong></span>
                      </div>
                    </div>

                    {/* Hàng 3: 10 kỳ mini */}
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', alignItems: 'center', marginTop: '1px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '9.5px', marginRight: '2px' }}>10 kỳ:</span>
                      {(b.history10 || []).map((h, i) => (
                        <span 
                          key={i} 
                          title={`Kỳ ${h.drawId}: ${h.isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Về Hậu: ${h.nextHau} | Loại: ${h.predDigit}`}
                          style={{
                            backgroundColor: h.isWin ? '#065f46' : '#991b1b',
                            border: h.isWin ? '1px solid #34d399' : '1px solid #ef4444',
                            color: 'white',
                            borderRadius: '3px',
                            padding: '1px 4px',
                            fontSize: '9.5px',
                            fontWeight: 'bold'
                          }}
                        >
                          {h.drawId ? h.drawId.slice(-3) : (i+1)}:{h.isWin ? '✅' : '❌'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CARD BÊN PHẢI: ĐỐI CHIẾU KỲ VỪA XỔ */}
                  <div 
                    style={{
                      backgroundColor: isWinPrev === true ? 'rgba(16, 185, 129, 0.12)' : (isWinPrev === false ? 'rgba(239, 68, 68, 0.12)' : '#0f172a'),
                      border: isWinPrev === true ? '1.5px solid #059669' : (isWinPrev === false ? '1.5px solid #ef4444' : '1px solid #334155'),
                      borderRadius: '10px',
                      padding: '9px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '5px'
                    }}
                  >
                    {/* Hàng 1: Tên cầu, TOP badge, Số loại & Kết quả kỳ vừa xổ */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexWrap: 'wrap' }}>
                        <span style={{ 
                          backgroundColor: isTop1 ? '#ca8a04' : (isTop2 ? '#0284c7' : (isTop3 ? '#c2410c' : (isTop4 ? '#059669' : '#334155'))), 
                          color: isTop1 ? 'black' : 'white', 
                          fontSize: '10.5px', 
                          fontWeight: 'bold', 
                          padding: '2px 7px', 
                          borderRadius: '4px',
                          flexShrink: 0
                        }}>
                          {b.rankBadge}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#f1f5f9' }}>{b.name}</span>
                      </div>
                      
                      {prevBridge ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: 'auto' }}>
                          <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Loại:</span>
                          <span style={{ 
                            backgroundColor: '#1e293b', 
                            color: '#facc15', 
                            fontWeight: '900', 
                            fontSize: '1.25rem', 
                            padding: '1px 9px', 
                            borderRadius: '6px', 
                            border: '1px solid #eab308',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: '1.2'
                          }}>
                            {prevBridge.predDigit}
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 'bold', 
                            color: isWinPrev ? '#34d399' : '#f87171',
                            backgroundColor: isWinPrev ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            border: isWinPrev ? '1px solid #059669' : '1px solid #ef4444'
                          }}>
                            {isWinPrev ? '✅ THẮNG' : '❌ THUA'}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '10.5px', color: '#64748b', fontStyle: 'italic', flexShrink: 0 }}>Chờ đối chiếu...</span>
                      )}
                    </div>

                    {/* Hàng 2: Thống kê 10 kỳ gần nhất của cầu này */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px', paddingTop: '3px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                        10 kỳ: <strong style={{ color: wins10 >= 8 ? '#34d399' : (wins10 >= 6 ? '#fbbf24' : '#f87171') }}>{wins10}/{total10} Trúng ({rate10}%)</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {hist10.map((h, i) => (
                          <span 
                            key={i} 
                            title={`Kỳ ${h.drawId}: ${h.isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Hậu Nhị: ${h.nextHau} | Loại: ${h.predDigit}`}
                            style={{
                              backgroundColor: h.isWin ? '#065f46' : '#7f1d1d',
                              border: h.isWin ? '1px solid #34d399' : '1px solid #ef4444',
                              color: 'white',
                              borderRadius: '3px',
                              padding: '1px 4px',
                              fontSize: '9.5px',
                              fontWeight: 'bold'
                            }}
                          >
                            {h.drawId ? h.drawId.slice(-3) : (i + 1)}:{h.isWin ? '✅' : '❌'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* KHU VỰC DÀN SỐ 2D BẠC NHỚ & ĐỐI CHIẾU DÀN SỐ */}
          {/* ========================================================================= */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
            
            {/* Cột Trái: Dàn số dự đoán */}
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #475569', paddingBottom: '6px' }}>
                🎯 HỆ THỐNG DÀN SỐ DỰ ĐOÁN (KỲ TỚI)
              </div>

              {/* Dàn 2 số */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#ef4444' }}>🎯</span> HỆ DÀN 2 SỐ (Bạch Thủ Bạc Nhớ)
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Siêu nổ (1 cặp lót)</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan2)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  {renderCopyButton(dan2, "Dàn 2 Số Bạch Thủ")}
                  {renderDanStreak10Mini('isD2Hit')}
                </div>
              </div>

              {/* Dàn 4 số */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#eab308' }}>⚡</span> HỆ DÀN 4 SỐ (Tứ Thủ Bạc Nhớ)
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Đột phá (2 cặp lót)</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan4)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  {renderCopyButton(dan4, "Dàn 4 Số Tứ Thủ")}
                  {renderDanStreak10Mini('isD4Hit')}
                </div>
              </div>

              {/* Dàn 10 số */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#f97316' }}>🛡️</span> DÀN 10 SỐ 2D
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Chắt lọc TOP điểm</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan10, false)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  {renderCopyButton(dan10, "Dàn 10 Số")}
                  {renderDanStreak10Mini('isD10Hit')}
                </div>
              </div>

              {/* Dàn 20 số */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#f97316' }}>🛡️</span> DÀN 20 SỐ 2D
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Khung ổn định</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan20, true)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  {renderCopyButton(dan20, "Dàn 20 Số")}
                  {renderDanStreak10Mini('isD20Hit')}
                </div>
              </div>

              {/* Dàn 36 số */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#10b981' }}>🛡️</span> DÀN 36 SỐ 2D (ĐÁNH 6 SỐ GIỮ)
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#6ee7b7' }}>Chủ lực bạc nhớ</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan36, true)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  {renderCopyButton(dan36, "Dàn 36 Số")}
                  {renderDanStreak10Mini('isD36Hit')}
                </div>
              </div>

              {/* Dàn 50 số */}
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#3b82f6' }}>🔥</span> DÀN 50 SỐ 2D (TỶ LỆ 50%)
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#93c5fd' }}>Ăn chắc mặc bền</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan50, true)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(59, 130, 246, 0.2)' }}>
                  {renderCopyButton(dan50, "Dàn 50 Số")}
                  {renderDanStreak10Mini('isD50Hit')}
                </div>
              </div>

              {/* Dàn 64 số */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#8b5cf6' }}>💎</span> DÀN 64 SỐ 2D (BẤT BẠI 64%)
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#c084fc' }}>Bao phủ tối đa</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderBalls(dan64, true)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  {renderCopyButton(dan64, "Dàn 64 Số")}
                  {renderDanStreak10Mini('isD64Hit')}
                </div>
              </div>
            </div>

            {/* Cột Phải: Đối chiếu dàn số kỳ vừa xong */}
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', borderBottom: '1px solid #475569', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📊 ĐỐI CHIẾU DÀN SỐ KỲ VỪA XONG</span>
                {historyCheck?.resultHau && <span style={{ color: '#facc15', fontSize: '11px' }}>Về Hậu: {historyCheck.resultHau}</span>}
              </div>

              {historyCheck ? (
                <>
                  {/* Dàn 2 số */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#ef4444' }}>🎯</span> HỆ DÀN 2 SỐ (Bạch Thủ)
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD2Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD2Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD2Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD2Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD2, false, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>

                  {/* Dàn 4 số */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#eab308' }}>⚡</span> HỆ DÀN 4 SỐ (Tứ Thủ)
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD4Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD4Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD4Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD4Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD4, false, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>

                  {/* Dàn 10 số */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#f97316' }}>🛡️</span> DÀN 10 SỐ 2D
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD10Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD10Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD10Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD10Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD10, false, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>

                  {/* Dàn 20 số */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#f97316' }}>🛡️</span> DÀN 20 SỐ 2D
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD20Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD20Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD20Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD20Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD20, true, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>

                  {/* Dàn 36 số */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#10b981' }}>🛡️</span> DÀN 36 SỐ 2D
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD36Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD36Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD36Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD36Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD36, true, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>

                  {/* Dàn 50 số */}
                  <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#3b82f6' }}>🔥</span> DÀN 50 SỐ 2D
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD50Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD50Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD50Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD50Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD50, true, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>

                  {/* Dàn 64 số */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#8b5cf6' }}>💎</span> DÀN 64 SỐ 2D
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: historyCheck.isD64Hit ? '#34d399' : '#f87171',
                        backgroundColor: historyCheck.isD64Hit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: historyCheck.isD64Hit ? '1px solid #059669' : '1px solid #ef4444'
                      }}>
                        {historyCheck.isD64Hit ? '✅ TRÚNG' : '❌ TRƯỢT'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {renderBalls(historyCheck.pD64, true, historyCheck.resultHau, historyCheck.resultTien)}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ color: '#6b7280', fontStyle: 'italic', padding: '1rem' }}>
                  Chưa có dữ liệu đối chiếu kỳ trước (cần tối thiểu 2 kỳ kết quả).
                </div>
              )}
            </div>

          </div>

        </div>

        {/* CỘT 3: 10 KỲ QUAY GẦN NHẤT */}
        <div className="dashboard-col-side">
          <div style={{ backgroundColor: 'black', border: '1px solid #3b82f6', padding: '1rem', width: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
            <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase' }}>
              10 Kỳ Gần Nhất
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
              {data.slice(0, 10).map((draw, idx) => (
                 <div key={draw.Draw_ID || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em', padding: '4px 0', borderBottom: '1px solid #1f2937' }}>
                  <span>Kỳ {draw.Draw_ID ? draw.Draw_ID.slice(-3) : idx}: <strong style={{ color: '#facc15' }}>{draw.Result}</strong></span>
                  <button 
                     onClick={() => handleDeleteResult(draw.Draw_ID)}
                     style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 4px', fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1' }}
                     title="Xóa kỳ này"
                  >
                    ×
                  </button>
                 </div>
              ))}
              {data.length === 0 && <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Chưa có dữ liệu</div>}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('executive');
  
  const DEFAULT_DRAWS = [
    { Draw_ID: "2608211005", Result: "72384", Draw_Time: "12:00:00" },
    { Draw_ID: "2608211004", Result: "19405", Draw_Time: "11:57:00" },
    { Draw_ID: "2608211003", Result: "58273", Draw_Time: "11:54:00" },
    { Draw_ID: "2608211002", Result: "34912", Draw_Time: "11:51:00" },
    { Draw_ID: "2608211001", Result: "80159", Draw_Time: "11:48:00" }
  ];

  const [rawData, setRawData] = useState(() => {
    try {
      const saved = localStorage.getItem('lotobet_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(d => d && typeof d.Result === 'string' && /^\d{5}$/.test(d.Result));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.warn('localStorage access denied or failed:', e);
    }
    return DEFAULT_DRAWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lotobet_data', JSON.stringify(rawData));
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }
  }, [rawData]);

  const [showInputModal, setShowInputModal] = useState(false);
  const [newResult, setNewResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 180);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDeleteResult = (drawId) => {
    setRawData(prev => prev.filter(d => d.Draw_ID !== drawId));
  };

  const handleAddNewResult = () => {
    const cleaned = newResult.replace(/\D/g, '');
    if (cleaned.length !== 5) {
      alert('Vui lòng nhập đúng 5 chữ số từ 0-9 (Ví dụ: 31485)!');
      return;
    }

    const lastId = rawData.length > 0 ? (parseInt(rawData[0].Draw_ID.replace(/\D/g, '')) || 1000) : 1000;
    const nextIdStr = (lastId + 1).toString();
    
    const newDraw = {
      Draw_ID: nextIdStr.length > 6 ? nextIdStr : `260821${nextIdStr}`,
      Draw_Date: new Date().toISOString().split('T')[0],
      Draw_Time: new Date().toLocaleTimeString(),
      Result: cleaned,
      Source: "Live Input",
      Update_Time: new Date().toISOString()
    };

    setRawData(prev => [newDraw, ...prev]);
    setNewResult('');
    setShowInputModal(false);
    setTimeLeft(180);
  };

  const handleCopy = (numbers, type) => {
    const str = numbers.map(s => typeof s === 'string' ? s : s.number).join(',');
    navigator.clipboard.writeText(str).then(() => {
      alert(`Đã copy ${type} thành công!`);
    });
  };

  const getPredictionsForData = (dataSlice, actualNextDraw = null, mode = 'thuan') => {
    if (!dataSlice || dataSlice.length === 0) return null;
    
    const pScoredSingles = analyzeSingleDigits(dataSlice);
    const pScoredTongs = analyzeTong(dataSlice);
    const pScored2D = analyzeUnified2D(dataSlice);
    const pCauScore = calculateCauScore(pScored2D, pScoredTongs, pScoredSingles, dataSlice);

    const pD64 = generateReversibleSet(pCauScore, 64);
    const pD50 = generateReversibleSetFromDan(pD64, pCauScore, 50);
    const pD36 = generateReversibleSetFromDan(pD64, pCauScore, 36);
    const pD20 = generateReversibleSetFromDan(pD36, pCauScore, 20);
    const pD10 = generateReversibleSetFromDan(pD20, pCauScore, 10);
    const pD4 = generateReversibleSetFromDan(pD10, pCauScore, 4);
    const pD2 = generateReversibleSetFromDan(pD4, pCauScore, 2);
    
    const pTXCL = predictTXCL(dataSlice);
    const pLoaiSo = getLoaiSoHauNhi(dataSlice);

    let isLoai2Hit = false;
    let isLoai3Hit = false;
    let isLoai4Hit = false;
    let isD2Hit = false;
    let isD4Hit = false;
    let isD10Hit = false;
    let isD20Hit = false;
    let isD36Hit = false;
    let isD50Hit = false;
    let isD64Hit = false;

    if (actualNextDraw) {
      const actHau = actualNextDraw.Result ? actualNextDraw.Result.slice(3, 5) : '';
      if (actHau.length === 2) {
        const actChuc = actHau[0];
        const actDv = actHau[1];
        
        if (pLoaiSo) {
          const g7 = pLoaiSo.giu7 || [];
          const g6 = pLoaiSo.giu6 || [];
          isLoai3Hit = g7.includes(actChuc) && g7.includes(actDv);
          isLoai4Hit = g6.includes(actChuc) && g6.includes(actDv);
        }

        const checkDanHit = (dan, num) => {
          if (!dan || !Array.isArray(dan) || !num) return false;
          return dan.some(item => {
            const str = typeof item === 'string' ? item : (item?.number || '');
            return str === num;
          });
        };

        isD2Hit = checkDanHit(pD2, actHau);
        isD4Hit = checkDanHit(pD4, actHau);
        isD10Hit = checkDanHit(pD10, actHau);
        isD20Hit = checkDanHit(pD20, actHau);
        isD36Hit = checkDanHit(pD36, actHau);
        isD50Hit = checkDanHit(pD50, actHau);
        isD64Hit = checkDanHit(pD64, actHau);
      }
    }

    return {
      drawId: dataSlice[0].Draw_ID,
      pSingles: pScoredSingles,
      pD2, pD4, pD10, pD20, pD36, pD50, pD64,
      pTXCL,
      pLoaiSo,
      isLoai2Hit,
      isLoai3Hit,
      isLoai4Hit,
      isD2Hit,
      isD4Hit,
      isD10Hit,
      isD20Hit,
      isD36Hit,
      isD50Hit,
      isD64Hit,
      actualTXCL: actualNextDraw ? checkTXCL(actualNextDraw.Result) : null,
      fullResult: actualNextDraw ? actualNextDraw.Result : null,
      resultTien: actualNextDraw ? actualNextDraw.Result.slice(0, 2) : null,
      resultHau: actualNextDraw ? actualNextDraw.Result.slice(3, 5) : null
    };
  };

  const scoredSingles = analyzeSingleDigits(rawData);
  const scoredTongs = analyzeTong(rawData);
  const scored2D = analyzeUnified2D(rawData);
  const cauScore = calculateCauScore(scored2D, scoredTongs, scoredSingles, rawData);
  const dan64 = generateReversibleSet(cauScore, 64);
  const dan50 = generateReversibleSetFromDan(dan64, cauScore, 50);
  const dan36 = generateReversibleSetFromDan(dan64, cauScore, 36);
  const dan20 = generateReversibleSetFromDan(dan36, cauScore, 20);
  const dan10 = generateReversibleSetFromDan(dan20, cauScore, 10);
  const dan4 = generateReversibleSetFromDan(dan10, cauScore, 4);
  const dan2 = generateReversibleSetFromDan(dan4, cauScore, 2);
  const txcl = predictTXCL(rawData);
  const bacNhoInfo = getBacNhoAnalysis(rawData);
  const loaiSo = getLoaiSoHauNhi(rawData);

  let historyCheck = null;
  const historyList3 = [];
  const historyList10 = [];

  if (rawData.length >= 2) {
    historyCheck = getPredictionsForData(rawData.slice(1), rawData[0]);
  }

  for (let i = 1; i <= 3; i++) {
    if (rawData.length > i) {
      historyList3.push(getPredictionsForData(rawData.slice(i), rawData[i-1]));
    }
  }

  const maxCheck10 = Math.min(10, rawData.length - 1);
  for (let i = 1; i <= maxCheck10; i++) {
    historyList10.push(getPredictionsForData(rawData.slice(i), rawData[i-1]));
  }

  return (
    <div className="layout-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo gradient-text">LOTO AI</h1>
        </div>
        <div className="nav-menu">
          <button onClick={() => setActiveTab('executive')} className={`nav-item ${activeTab === 'executive' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Bảng Chốt Số (Dashboard)
          </button>
          <button onClick={() => setActiveTab('prediction')} className={`nav-item ${activeTab === 'prediction' ? 'active' : ''}`}>
            <Brain size={20} /> Cơ Chế Bắt Cầu Bạc Nhớ
          </button>
        </div>
      </nav>

      <main className="main-content">
        <header className="header-row px-6 py-3 border-b border-[#1f2937] bg-[#0f1225]">
          <div className="flex flex-wrap items-center gap-3">
            {rawData[0] && (
              <>
                <span className="px-2 py-0.5 bg-[#064e3b] text-[#34d399] text-[10px] md:text-xs font-bold rounded-full border border-[#047857]">TRỰC TIẾP</span>
                <span className="text-gray-400 text-xs md:text-sm">Kỳ vừa xổ ({rawData[0].Draw_ID}):</span>
                <span className="font-bold text-white text-lg md:text-xl tracking-widest">{rawData[0].Result}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-gray-400 text-[10px] md:text-xs">Thời gian các kỳ tới:</span>
              <span className={`font-mono text-sm md:text-base font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-[#34d399]'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <button 
              onClick={() => {
                if(window.confirm('Bạn có chắc muốn xóa toàn bộ kết quả để nhập lại từ đầu?')) {
                  setRawData([]);
                  try { localStorage.removeItem('lotobet_data'); } catch(e) {}
                }
              }}
              className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-red-600 text-white font-bold text-[10px] md:text-xs rounded hover:bg-red-700 transition-colors"
            >
              <Trash2 size={14} />
              XÓA KẾT QUẢ
            </button>
            <button 
              onClick={() => setShowInputModal(true)}
              className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-white text-black font-bold text-[10px] md:text-xs rounded hover:bg-gray-200 transition-colors"
            >
              <Plus size={14} />
              CẬP NHẬT KẾT QUẢ
            </button>
          </div>
        </header>

        {showInputModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
            <div className="card w-full max-w-[500px] border-2 border-[var(--accent-primary)] shadow-[0_0_40px_rgba(0,242,254,0.3)] p-6 md:p-8 bg-[#0b0e1d] rounded-2xl">
              <h2 className="mb-2 text-center gradient-text text-2xl md:text-3xl font-bold">Nhập Kết Quả Kỳ Vừa Xổ</h2>
              <p className="text-gray-300 mb-6 text-center text-sm md:text-base">
                Nhập đúng 5 chữ số từ bảng KUBET (Ví dụ: <strong className="text-yellow-400">31485</strong>). AI sẽ tính lại toàn bộ cầu kèo và bạc nhớ ngay lập tức!
              </p>
              <div className="mb-6">
                <input 
                  type="tel" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  maxLength={5}
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNewResult();
                    }
                  }}
                  className="w-full text-center text-4xl sm:text-5xl font-bold tracking-[0.4em] py-5 bg-[#0f1225] border-2 border-[var(--accent-primary)] rounded-xl text-white focus:outline-none shadow-inner"
                  placeholder="31485"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowInputModal(false)}
                  className="flex-1 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 text-base font-bold transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button 
                  onClick={handleAddNewResult}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-95 text-base shadow-lg transition-transform active:scale-95"
                >
                  XÁC NHẬN CHỐT SỐ
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="page-content mt-6">
          {activeTab === 'executive' && (
            <ExecutiveDashboard 
              data={rawData} 
              dan2={dan2} 
              dan4={dan4} 
              dan10={dan10} 
              dan20={dan20} 
              dan36={dan36} 
              dan50={dan50}
              dan64={dan64} 
              topSingles={scoredSingles} 
              loaiSo={loaiSo}
              handleCopy={handleCopy} 
              historyCheck={historyCheck} 
              historyList3={historyList3} 
              historyList10={historyList10}
              txcl={txcl} 
              handleDeleteResult={handleDeleteResult}
              bacNhoInfo={bacNhoInfo}
            />
          )}

          {activeTab === 'prediction' && (
            <div style={{ color: 'white', padding: '1rem md:2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#0f1225', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                  🧠 PHÂN TÍCH BÍ KÍP BẠC NHỚ LOTOBET KUBET (SẢNH A & C)
                </h2>
                
                {/* 1. Bộ Số Trả Nhau & Siêu Chạm */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      🔄 Bộ Số Trả Nhau (Hàng Trăm & Đơn Vị)
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      Lấy mốc Hàng Trăm và Đơn Vị của kỳ vừa xổ. Chạm đối ứng kích hoạt kỳ này:
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {bacNhoInfo.traNhauTouches.map((t, idx) => (
                        <span key={idx} style={{ backgroundColor: '#0284c7', color: 'white', fontWeight: 'bold', padding: '4px 12px', borderRadius: '4px' }}>
                          Chạm {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ color: '#facc15', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      👑 Top 4 Siêu Chạm Bạc Nhớ
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      Tổng hợp từ 7 quy luật bắt chạm (Sảnh, Tứ quý, Kép 77/88, Bệt tâm càng, Kẹp 999):
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {bacNhoInfo.touches.map((t, idx) => (
                        <span key={idx} style={{ backgroundColor: '#ca8a04', color: 'black', fontWeight: 'bold', padding: '4px 12px', borderRadius: '4px' }}>
                          Chạm {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Dấu hiệu kích hoạt kỳ này */}
                <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    ⚡ Dấu Hiệu Bạc Nhớ Nhận Diện Kỳ Này:
                  </div>
                  {bacNhoInfo.reasons && bacNhoInfo.reasons.length > 0 ? (
                    <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#e5e7eb' }}>
                      {bacNhoInfo.reasons.map((r, idx) => (
                        <li key={idx} style={{ listStyleType: 'disc' }}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>Không có thế cầu dị biệt, đang chạy thuật toán tối ưu tiêu chuẩn.</div>
                  )}
                </div>

                {/* 3. Bạch Thủ & Bộ Nuôi VIP */}
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {bacNhoInfo.vipNumbers.length > 0 && (
                    <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #ef4444' }}>
                      <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        🎯 Bạch Thủ VIP Bạc Nhớ:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {bacNhoInfo.vipNumbers.map((n, idx) => (
                          <span key={idx} style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {bacNhoInfo.nuoiBoNumbers.length > 0 && (
                    <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #10b981' }}>
                      <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        🛡️ Dàn Bộ Nuôi Bạc Nhớ Kích Hoạt:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {bacNhoInfo.nuoiBoNumbers.map((n, idx) => (
                          <span key={idx} style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px', border: '1px solid #059669' }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
