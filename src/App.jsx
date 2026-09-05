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
  loaiThuan,
  loaiDao,
  historyCheck, 
  historyList3 = [], 
  historyList10 = [],
  txcl, 
  handleCopy, 
  handleDeleteResult,
  bacNhoInfo
}) => {

  const thuanWins3 = historyList10.filter(h => h && h.isLoai3ThuanHit).length;
  const thuanTotal = historyList10.length;
  const thuanRate3 = thuanTotal > 0 ? Math.round((thuanWins3 / thuanTotal) * 100) : 0;

  const daoWins3 = historyList10.filter(h => h && h.isLoai3DaoHit).length;
  const daoTotal = historyList10.length;
  const daoRate3 = daoTotal > 0 ? Math.round((daoWins3 / daoTotal) * 100) : 0;

  const renderStreak10 = (mode = 'thuan') => {
    if (!historyList10 || historyList10.length === 0) return null;
    const wins3 = mode === 'thuan' ? thuanWins3 : daoWins3;
    const total = historyList10.length;
    const rate = mode === 'thuan' ? thuanRate3 : daoRate3;

    return (
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'bold' }}>
            📊 THỐNG KÊ 10 KỲ ({mode === 'thuan' ? 'THUẬN' : 'ĐẢO'} - LOẠI 3 SỐ):
          </span>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: wins3 >= 7 ? '#34d399' : (wins3 >= 5 ? '#fbbf24' : '#f87171'), backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #475569' }}>
            {wins3}/{total} Trúng ({rate}%)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[...historyList10].reverse().map((h, idx) => {
            const isWin = mode === 'thuan' ? h.isLoai3ThuanHit : h.isLoai3DaoHit;
            const drawNum = h.drawId ? h.drawId.slice(-3) : (idx + 1);
            const pLoai = mode === 'thuan' ? h.pLoaiThuan : h.pLoaiDao;
            return (
              <div 
                key={idx}
                title={`Kỳ ${drawNum}: ${isWin ? 'Trúng (Thắng)' : 'Trượt (Thua)'} | Về Hậu: ${h.resultHau || ''} | Cắt: [${(pLoai?.loai3 || []).join(',')}]`}
                style={{
                  backgroundColor: isWin ? '#065f46' : '#991b1b',
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
    <div className="p-2 md:p-8 flex flex-col gap-8 w-full overflow-hidden">
      
      <div className="dashboard-layout">
        
        {/* CỘT 1: DỰ ĐOÁN KỲ TIẾP THEO */}
        <div className="dashboard-col-main">
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            🎯 DỰ ĐOÁN KỲ QUAY TIẾP THEO
          </div>

          {/* ========================================================================= */}
          {/* KHU VỰC 1: 🟢 THUẬN CẦU (THEO BÓNG & BỆT HẬU NHỊ) */}
          {/* ========================================================================= */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '14px', borderRadius: '12px', border: '1px solid #10b981', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#064e3b', padding: '8px 12px', borderRadius: '8px', border: '1px solid #059669' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🟢 CẦU THUẬN (THEO BÓNG & BỆT HẬU NHỊ)
              </span>
              <span style={{ fontSize: '11px', color: '#a7f3d0' }}>Khuyên dùng</span>
            </div>

            {loaiThuan?.activeBridgeName && (
              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '6px 12px', color: '#38bdf8', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>🎯 {loaiThuan.activeBridgeName}</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Cầu nổ ➔ Lấy Bóng Dương/Âm; Cầu gãy ➔ Loại</span>
              </div>
            )}

            {loaiThuan?.trendReason && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', padding: '6px 12px', color: '#34d399', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {loaiThuan.trendReason}
              </div>
            )}

            {/* 1. MỤC LOẠI 3 SỐ (THUẬN CẦU) */}
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="#ef4444" /> 🛡️ KÈO LOẠI 3 SỐ (THUẬN CẦU):
                </span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>Khuyên dùng (An toàn)</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 3 Số Bỏ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', width: '95px' }}>❌ LOẠI 3 SỐ:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(loaiThuan?.loai3 || []).map((n, i) => (
                      <span key={i} style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: '900', fontSize: '1.25rem', padding: '2px 12px', borderRadius: '6px', textDecoration: 'line-through', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nút copy dàn 49 số & dàn 9 số */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {renderCopyButton(loaiThuan?.dan49 || [], "Dàn 49 Số (Đánh 7 Số - Thuận)")}
                  {renderCopyButton(loaiThuan?.dan9 || [], "🎯 Dàn 9 Số (Bắt 3 Số Loại - Thuận)")}
                </div>
              </div>
            </div>

            {/* 2. MỤC LOẠI 4 SỐ (THUẬN CẦU) */}
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={18} color="#f59e0b" /> ⚡ KÈO LOẠI 4 SỐ (THUẬN CẦU):
                </span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>Vốn ít (Lãi to)</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 4 Số Bỏ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', width: '95px' }}>❌ LOẠI 4 SỐ:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(loaiThuan?.loai4 || []).map((n, i) => (
                      <span key={i} style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: '900', fontSize: '1.25rem', padding: '2px 12px', borderRadius: '6px', textDecoration: 'line-through', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nút copy dàn 36 số & dàn 16 số */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {renderCopyButton(loaiThuan?.dan36 || [], "Dàn 36 Số (Đánh 6 Số - Thuận)")}
                  {renderCopyButton(loaiThuan?.dan16 || [], "⚡ Dàn 16 Số (Bắt 4 Số Loại - Thuận)")}
                </div>
              </div>
            </div>

            {/* Thống kê 10 kỳ gần nhất */}
            {renderStreak10('thuan')}

          </div>

          {/* ========================================================================= */}
          {/* KHU VỰC 2: 🔄 ĐẢO CẦU (ĐÓN BẺ CẦU / BẮT NGHỊCH HẬU NHỊ) */}
          {/* ========================================================================= */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '14px', borderRadius: '12px', border: '1px solid #f59e0b', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#78350f', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d97706' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fde68a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔄 CẦU ĐẢO (ĐÓN BẺ CẦU / BẮT SỐ LOẠI HẬU NHỊ)
              </span>
              <span style={{ fontSize: '11px', color: '#fef3c7' }}>Đón nhịp bẻ cầu</span>
            </div>

            {loaiDao?.activeBridgeName && (
              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '6px 12px', color: '#38bdf8', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>🎯 {loaiDao.activeBridgeName}</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Cầu nổ ➔ Đảo bắt số loại; Cầu gãy ➔ Giữ lại</span>
              </div>
            )}

            {loaiDao?.trendReason && (
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 12px', color: '#fbbf24', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {loaiDao.trendReason}
              </div>
            )}

            {/* 1. MỤC LOẠI 3 SỐ (ĐẢO CẦU) */}
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="#ef4444" /> 🛡️ KÈO LOẠI 3 SỐ (ĐẢO CẦU):
                </span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>Bắt đảo nhịp</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 3 Số Bỏ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', width: '95px' }}>❌ LOẠI 3 SỐ:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(loaiDao?.loai3 || []).map((n, i) => (
                      <span key={i} style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: '900', fontSize: '1.25rem', padding: '2px 12px', borderRadius: '6px', textDecoration: 'line-through', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nút copy dàn 49 số & dàn 9 số */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {renderCopyButton(loaiDao?.dan49 || [], "Dàn 49 Số (Đánh 7 Số - Đảo)")}
                  {renderCopyButton(loaiDao?.dan9 || [], "🎯 Dàn 9 Số (Bắt 3 Số Loại - Đảo)")}
                </div>
              </div>
            </div>

            {/* 2. MỤC LOẠI 4 SỐ (ĐẢO CẦU) */}
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={18} color="#f59e0b" /> ⚡ KÈO LOẠI 4 SỐ (ĐẢO CẦU):
                </span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>Bắt đảo nhịp</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 4 Số Bỏ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', width: '95px' }}>❌ LOẠI 4 SỐ:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(loaiDao?.loai4 || []).map((n, i) => (
                      <span key={i} style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: '900', fontSize: '1.25rem', padding: '2px 12px', borderRadius: '6px', textDecoration: 'line-through', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nút copy dàn 36 số & dàn 16 số */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {renderCopyButton(loaiDao?.dan36 || [], "Dàn 36 Số (Đánh 6 Số - Đảo)")}
                  {renderCopyButton(loaiDao?.dan16 || [], "⚡ Dàn 16 Số (Bắt 4 Số Loại - Đảo)")}
                </div>
              </div>
            </div>

            {/* Thống kê 10 kỳ gần nhất */}
            {renderStreak10('dao')}

          </div>
          
          {/* Dàn 2 số */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '10px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ef4444' }}>🎯</span> HỆ DÀN 2 SỐ (Bạch Thủ Bạc Nhớ)
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Siêu nổ (1 cặp lót)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan2)}
            </div>
            {renderCopyButton(dan2, "Dàn 2 Số Bạch Thủ")}
          </div>

          {/* Dàn 4 số */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#eab308' }}>⚡</span> HỆ DÀN 4 SỐ (Tứ Thủ Bạc Nhớ)
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Đột phá (2 cặp lót)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan4)}
            </div>
            {renderCopyButton(dan4, "Dàn 4 Số Tứ Thủ")}
          </div>

          {/* Dàn 10 số */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#f97316' }}>🛡️</span> DÀN 10 SỐ 2D
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Cân bằng vốn</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan10, false)}
            </div>
            {renderCopyButton(dan10, "Dàn 10 Số")}
          </div>

          {/* Dàn 20 số */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#f97316' }}>🛡️</span> DÀN 20 SỐ 2D
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>An toàn cao</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan20, true)}
            </div>
            {renderCopyButton(dan20, "Dàn 20 Số")}
          </div>

          {/* Dàn 36 số */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{ color: '#10b981' }}>🛡️</span> DÀN 36 SỐ 2D
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Tỷ lệ thắng 36% (Đánh đều tay - Ép Siêu Chạm)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan36, true)}
            </div>
            {renderCopyButton(dan36, "Dàn 36 Số")}
          </div>

          {/* Dàn 50 số */}
          <div style={{ marginBottom: '16px', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{ color: '#3b82f6' }}>🔥</span> DÀN 50 SỐ 2D (SIÊU AN TOÀN - TỶ LỆ 50%)
            </div>
            <div style={{ color: '#38bdf8', fontSize: '11px', marginBottom: '4px' }}>Bao 1/2 bảng số - Bất bại rỉa vốn & Đánh chắc tay</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan50, true)}
            </div>
            {renderCopyButton(dan50, "Dàn 50 Số")}
          </div>

          {/* Dàn 64 số */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{ color: '#8b5cf6' }}>💎</span> DÀN 64 SỐ 2D
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Tỷ lệ thắng 64% (Bao sân rỉa máu - Bất bại)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {renderBalls(dan64, true)}
            </div>
            {renderCopyButton(dan64, "Dàn 64 Số")}
          </div>

          {/* 3 Số 5 Tinh */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '8px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '12px' }}>
              <span style={{ color: '#facc15' }}>⭐</span> 3 SỐ 5 TINH (ĐA CẦU TỰ THÍCH ỨNG)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', width: '100%' }}>
              <div>
                <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>DÀN 3 SỐ</div>
                <div style={{ display: 'flex', gap: '8px', color: '#facc15', fontWeight: 'bold' }}>
                  {(topSingles || []).slice(0,3).map(s => typeof s === 'string' ? s : (s?.number || '')).filter(Boolean).join(', ')}
                </div>
              </div>
              <div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>DÀN 4 SỐ</div>
                <div style={{ display: 'flex', gap: '8px', color: '#10b981', fontWeight: 'bold' }}>
                  {(topSingles || []).slice(0,4).map(s => typeof s === 'string' ? s : (s?.number || '')).filter(Boolean).join(', ')}
                </div>
              </div>
              <div>
                <div style={{ color: "#facc15", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>DÀN 5 SỐ</div>
                <div style={{ display: 'flex', gap: '8px', color: '#facc15', fontWeight: 'bold' }}>
                  {(topSingles || []).slice(0,5).map(s => typeof s === 'string' ? s : (s?.number || '')).filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Tài Xỉu & Chẵn Lẻ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ec4899' }}>🎲</span> TÀI XỈU - CHẴN LẺ (TỔNG 5 SỐ - KHUNG 3 TAY)
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '6px', color: '#06b6d4', fontWeight: 'bold', fontSize: '1.25rem', border: '1px solid #334155' }}>
                {txcl.tx} <span style={{ fontSize: '0.75rem', color: '#10b981' }}>({txcl.rate})</span>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '6px', color: '#ec4899', fontWeight: 'bold', fontSize: '1.25rem', border: '1px solid #334155' }}>
                {txcl.cl}
              </div>
            </div>
            {txcl.reason && (
              <div style={{ color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>
                Lý do cầu: <span style={{ color: '#e5e7eb' }}>{txcl.reason}</span>
              </div>
            )}
          </div>

        </div>

        {/* CỘT 2: KẾT QUẢ KỲ VỪA XONG (ĐỐI CHIẾU) */}
        <div className="dashboard-col-main">
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            📊 KẾT QUẢ KỲ QUAY VỪA XONG
          </div>
          
          {historyCheck ? (
            <>
              {/* Đối chiếu Loại 3 Số & Loại 4 Số Hậu Nhị */}
              {/* Đối chiếu Song Song: Thuận Cầu & Đảo Cầu */}
              {(historyCheck.pLoaiThuan || historyCheck.pLoaiDao) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {/* BẢNG 1: ĐỐI CHIẾU THUẬN CẦU */}
                  <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.9rem' }}>
                        🟢 ĐỐI CHIẾU THUẬN CẦU:
                      </span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Theo bóng & bệt</span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                      <div style={{ backgroundColor: historyCheck.isLoai3ThuanHit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '6px 8px', borderRadius: '6px', border: historyCheck.isLoai3ThuanHit ? '1px solid #059669' : '1px solid #ef4444' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: historyCheck.isLoai3ThuanHit ? '#34d399' : '#f87171' }}>
                          Loại 3: {historyCheck.isLoai3ThuanHit ? '✅ THẮNG (7s)' : '❌ THUA'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                          Cắt: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>[{(historyCheck.pLoaiThuan?.loai3 || []).join(',')}]</span>
                        </div>
                      </div>

                      <div style={{ backgroundColor: historyCheck.isLoai4ThuanHit ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '6px 8px', borderRadius: '6px', border: historyCheck.isLoai4ThuanHit ? '1px solid #d97706' : '1px solid #ef4444' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: historyCheck.isLoai4ThuanHit ? '#fbbf24' : '#f87171' }}>
                          Loại 4: {historyCheck.isLoai4ThuanHit ? '✅ THẮNG (6s)' : '❌ THUA'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                          Cắt: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>[{(historyCheck.pLoaiThuan?.loai4 || []).join(',')}]</span>
                        </div>
                      </div>
                    </div>
                    {/* Thống kê 10 kỳ gần nhất */}
                    {renderStreak10('thuan')}
                  </div>

                  {/* BẢNG 2: ĐỐI CHIẾU ĐẢO CẦU */}
                  <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '0.9rem' }}>
                        🔄 ĐỐI CHIẾU ĐẢO CẦU (BẺ CẦU):
                      </span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Bắt đảo nhịp</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                      <div style={{ backgroundColor: historyCheck.isLoai3DaoHit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '6px 8px', borderRadius: '6px', border: historyCheck.isLoai3DaoHit ? '1px solid #059669' : '1px solid #ef4444' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: historyCheck.isLoai3DaoHit ? '#34d399' : '#f87171' }}>
                          Loại 3: {historyCheck.isLoai3DaoHit ? '✅ THẮNG (7s)' : '❌ THUA'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                          Cắt: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>[{(historyCheck.pLoaiDao?.loai3 || []).join(',')}]</span>
                        </div>
                      </div>

                      <div style={{ backgroundColor: historyCheck.isLoai4DaoHit ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '6px 8px', borderRadius: '6px', border: historyCheck.isLoai4DaoHit ? '1px solid #d97706' : '1px solid #ef4444' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: historyCheck.isLoai4DaoHit ? '#fbbf24' : '#f87171' }}>
                          Loại 4: {historyCheck.isLoai4DaoHit ? '✅ THẮNG (6s)' : '❌ THUA'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                          Cắt: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>[{(historyCheck.pLoaiDao?.loai4 || []).join(',')}]</span>
                        </div>
                      </div>
                    </div>
                    {/* Thống kê 10 kỳ gần nhất */}
                    {renderStreak10('dao')}
                  </div>

                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>🎯</span> HỆ DÀN 2 SỐ (Bạch Thủ)
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Siêu nổ (1 cặp lót)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD2, false, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#eab308' }}>⚡</span> HỆ DÀN 4 SỐ (Tứ Thủ)
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Đột phá (2 cặp lót)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD4, false, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f97316' }}>🛡️</span> DÀN 10 SỐ 2D
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Cân bằng vốn</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD10, false, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#f97316' }}>🛡️</span> DÀN 20 SỐ 2D
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>An toàn cao</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD20, true, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981' }}>🛡️</span> DÀN 36 SỐ 2D
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Tỷ lệ thắng 36%</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD36, true, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              {/* Dàn 50 đối chiếu */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '6px', borderRadius: '4px' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#3b82f6' }}>🔥</span> DÀN 50 SỐ 2D
                </div>
                <div style={{ color: '#38bdf8', fontSize: '11px', marginBottom: '4px' }}>Tỷ lệ thắng 50%</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD50, true, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#8b5cf6' }}>💎</span> DÀN 64 SỐ 2D
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Tỷ lệ thắng 64%</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {renderBalls(historyCheck.pD64, true, historyCheck.resultHau, historyCheck.resultTien)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '8px' }}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '12px' }}>
                  <span style={{ color: '#facc15' }}>⭐</span> 3 SỐ 5 TINH (ĐỐI CHIẾU)
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', width: '100%' }}>
                  <div>
                    <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>DÀN 3 SỐ</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {renderSingles((historyCheck.pSingles || []).slice(0,3).map(s => typeof s === 'string' ? s : (s?.number || '')), historyCheck.fullResult)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>DÀN 4 SỐ</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {renderSingles((historyCheck.pSingles || []).slice(0,4).map(s => typeof s === 'string' ? s : (s?.number || '')), historyCheck.fullResult)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#facc15", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "0.25rem" }}>DÀN 5 SỐ</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {renderSingles((historyCheck.pSingles || []).slice(0,5).map(s => typeof s === 'string' ? s : (s?.number || '')), historyCheck.fullResult)}
                    </div>
                  </div>
                </div>
              </div>

              {historyCheck.actualTXCL && historyCheck.pTXCL && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ec4899' }}>🎲</span> TÀI XỈU - CHẴN LẺ (KẾT QUẢ ĐỐI CHIẾU)
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    Tổng 5 số: <span style={{ color: 'white', fontWeight: 'bold' }}>{historyCheck.actualTXCL.sum}</span> ({historyCheck.actualTXCL.tx} - {historyCheck.actualTXCL.cl})
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    {renderTXCLHit(historyCheck.pTXCL.tx, historyCheck.actualTXCL.tx)}
                    {renderTXCLHit(historyCheck.pTXCL.cl, historyCheck.actualTXCL.cl)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '2rem' }}>
              Chưa có dữ liệu đối chiếu kỳ trước (cần tối thiểu 2 kỳ kết quả).
            </div>
          )}
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

      {/* LỊCH SỬ THỐNG KÊ (3 KỲ GẦN NHẤT) */}
      <div className="mt-8 w-full flex flex-col gap-4 overflow-x-auto">
         <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase' }}>
            📜 LỊCH SỬ THỐNG KÊ (3 KỲ GẦN NHẤT)
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {historyList3.map((hist, idx) => (
                <div key={idx} style={{ padding: '1rem', backgroundColor: '#0f1225', borderRadius: '8px', border: '1px solid #1f2937', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    
                    <div style={{ width: '170px' }}>
                       <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Kỳ {hist.drawId ? hist.drawId.slice(-3) : ''}</div>
                       <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>{hist.fullResult || ''}</div>
                       <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Đã về: <span style={{ color: "#facc15", fontWeight: "bold" }}>{hist.resultTien || ''}</span> và <span style={{ color: "#facc15", fontWeight: "bold" }}>{hist.resultHau || ''}</span></div>
                       
                       {/* Badge Thống kê Song Song: Thuận Cầu & Đảo Cầu */}
                       {(hist.pLoaiThuan || hist.pLoaiDao || hist.pLoaiHauNhi) && (
                         <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#1e293b', padding: '6px', borderRadius: '6px' }}>
                           <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ color: '#34d399', fontWeight: 'bold' }}>🟢 Thuận:</span>
                             <span style={{ color: hist.isLoai3ThuanHit ? '#34d399' : '#ef4444', fontWeight: 'bold' }}>L3: {hist.isLoai3ThuanHit ? '✅ Ăn' : '❌'}</span>
                             <span style={{ color: hist.isLoai4ThuanHit ? '#fbbf24' : '#ef4444', fontWeight: 'bold' }}>L4: {hist.isLoai4ThuanHit ? '✅ Ăn' : '❌'}</span>
                           </div>
                           <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🔄 Đảo:</span>
                             <span style={{ color: hist.isLoai3DaoHit ? '#34d399' : '#ef4444', fontWeight: 'bold' }}>L3: {hist.isLoai3DaoHit ? '✅ Ăn' : '❌'}</span>
                             <span style={{ color: hist.isLoai4DaoHit ? '#fbbf24' : '#ef4444', fontWeight: 'bold' }}>L4: {hist.isLoai4DaoHit ? '✅ Ăn' : '❌'}</span>
                           </div>
                         </div>
                       )}

                       {hist.actualTXCL && hist.pTXCL && (
                         <>
                           <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                             Tổng 5 số: <span style={{ color: 'white', fontWeight: 'bold' }}>{hist.actualTXCL.sum}</span> ({hist.actualTXCL.tx} - {hist.actualTXCL.cl})
                           </div>
                           <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                             {renderTXCLHit(hist.pTXCL.tx, hist.actualTXCL.tx)}
                             {renderTXCLHit(hist.pTXCL.cl, hist.actualTXCL.cl)}
                           </div>
                         </>
                       )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🎯 DÀN 10:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD10, true, hist.resultHau, hist.resultTien)}
                          </div>
                          {renderCopyButton(hist.pD10, `Dàn 10 Số (Kỳ ${hist.drawId ? hist.drawId.slice(-3) : ''})`)}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🛡️ DÀN 36:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD36, true, hist.resultHau, hist.resultTien)}
                          </div>
                          {renderCopyButton(hist.pD36, `Dàn 36 Số (Kỳ ${hist.drawId ? hist.drawId.slice(-3) : ''})`)}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.875rem', width: '90px', paddingTop: '4px' }}>🔥 DÀN 50:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                             {renderBalls(hist.pD50, true, hist.resultHau, hist.resultTien)}
                          </div>
                          {renderCopyButton(hist.pD50, `Dàn 50 Số (Kỳ ${hist.drawId ? hist.drawId.slice(-3) : ''})`)}
                       </div>
                    </div>

                </div>
            ))}
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
    const pLoaiThuan = getLoaiSoHauNhi(dataSlice, 'thuan');
    const pLoaiDao = getLoaiSoHauNhi(dataSlice, 'dao');
    const pLoaiHauNhi = mode === 'dao' ? pLoaiDao : pLoaiThuan;

    let isLoai2Hit = false;
    let isLoai3Hit = false;
    let isLoai4Hit = false;
    let isLoai3ThuanHit = false;
    let isLoai4ThuanHit = false;
    let isLoai3DaoHit = false;
    let isLoai4DaoHit = false;

    if (actualNextDraw) {
      const actHau = actualNextDraw.Result ? actualNextDraw.Result.slice(3, 5) : '';
      if (actHau.length === 2) {
        const actChuc = actHau[0];
        const actDv = actHau[1];
        
        // Thuận
        if (pLoaiThuan) {
          const g8T = pLoaiThuan.giu8 || [];
          const g7T = pLoaiThuan.giu7 || [];
          const g6T = pLoaiThuan.giu6 || [];
          isLoai3ThuanHit = g7T.includes(actChuc) && g7T.includes(actDv);
          isLoai4ThuanHit = g6T.includes(actChuc) && g6T.includes(actDv);
        }

        // Đảo
        if (pLoaiDao) {
          const g7D = pLoaiDao.giu7 || [];
          const g6D = pLoaiDao.giu6 || [];
          isLoai3DaoHit = g7D.includes(actChuc) && g7D.includes(actDv);
          isLoai4DaoHit = g6D.includes(actChuc) && g6D.includes(actDv);
        }

        // Mode hiện tại
        if (pLoaiHauNhi) {
          const g8 = pLoaiHauNhi.giu8 || [];
          const g7 = pLoaiHauNhi.giu7 || [];
          const g6 = pLoaiHauNhi.giu6 || [];
          isLoai2Hit = g8.includes(actChuc) && g8.includes(actDv);
          isLoai3Hit = g7.includes(actChuc) && g7.includes(actDv);
          isLoai4Hit = g6.includes(actChuc) && g6.includes(actDv);
        }
      }
    }

    return {
      drawId: dataSlice[0].Draw_ID,
      pSingles: pScoredSingles,
      pD2, pD4, pD10, pD20, pD36, pD50, pD64,
      pTXCL,
      pLoaiHauNhi,
      pLoaiThuan,
      pLoaiDao,
      isLoai2Hit,
      isLoai3Hit,
      isLoai4Hit,
      isLoai3ThuanHit,
      isLoai4ThuanHit,
      isLoai3DaoHit,
      isLoai4DaoHit,
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
  const loaiThuan = getLoaiSoHauNhi(rawData, 'thuan');
  const loaiDao = getLoaiSoHauNhi(rawData, 'dao');

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
              loaiThuan={loaiThuan}
              loaiDao={loaiDao}
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
