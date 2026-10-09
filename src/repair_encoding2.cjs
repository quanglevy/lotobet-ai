const fs = require('fs');

try {
  let code = fs.readFileSync('src/App.jsx', 'utf8');

  // Fix Check/Cross emojis
  code = code.split('isHit ? "?" : "?"').join('isHit ? "✅" : "❌"');

  const replacements = {
    "B?ng Ch?t S?": "Bảng Chốt Số",
    "C? Ch? B?t C?u": "Cơ Chế Bắt Cầu",
    "TR?C TI?P": "TRỰC TIẾP",
    "K? v?a x?": "Kỳ vừa xổ",
    "Kỳ v?a x?": "Kỳ vừa xổ",
    "D? OAN KỲ QUAY TI?P THEO": "DỰ ĐOÁN KỲ QUAY TIẾP THEO",
    "H? DAN 2 S?": "HỆ DÀN 2 SỐ",
    "H? DÀN 2 SỐ": "HỆ DÀN 2 SỐ",
    "(B?ch Th?)": "(Bạch Thủ)",
    "(B?ch Thủ)": "(Bạch Thủ)",
    "Sieu n? (1 c?p lot)": "Siêu nổ (1 cặp lót)",
    "Siêu n? (1 c?p lót)": "Siêu nổ (1 cặp lót)",
    "H? DAN 4 S?": "HỆ DÀN 4 SỐ",
    "H? DÀN 4 SỐ": "HỆ DÀN 4 SỐ",
    "(T? Th?)": "(Tứ Thủ)",
    "(T? Thủ)": "(Tứ Thủ)",
    "?t pha (2 c?p lot)": "Đột phá (2 cặp lót)",
    "Đột phá (2 c?p lót)": "Đột phá (2 cặp lót)",
    "DAN 10 S? 2D": "DÀN 10 SỐ 2D",
    "Can b?ng v?n": "Cân bằng vốn",
    "Cân b?ng v?n": "Cân bằng vốn",
    "DAN 20 S? 2D": "DÀN 20 SỐ 2D",
    "An toan cao": "An toàn cao",
    "An toàn cao": "An toàn cao",
    "DAN 36 S? 2D": "DÀN 36 SỐ 2D",
    "T? l? th?ng": "Tỷ lệ thắng",
    "DAN 64 S? 2D": "DÀN 64 SỐ 2D",
    "K?T QU? K? QUAY V?A XONG": "KẾT QUẢ KỲ QUAY VỪA XONG",
    "K?T QU? KỲ QUAY V?A XONG": "KẾT QUẢ KỲ QUAY VỪA XONG",
    "Th?i gian c?n l?i:": "Thời gian còn lại:",
    "XOA K?T QU?": "XÓA KẾT QUẢ",
    "C?P NH?T K?T QU?": "CẬP NHẬT KẾT QUẢ",
    "XÓA K?T QU?": "XÓA KẾT QUẢ",
    "C?P NH?T KẾT QU?": "CẬP NHẬT KẾT QUẢ",
    "a copy": "Đã copy",
    "thanh cong!": "thành công!",
    "Phan Tich C?u Keo 3 S? 5 Tinh": "Phân Tích Cầu Kèo 3 Số 5 Tinh",
    "i?m:": "Điểm:",
    "Ly do b?t c?u:": "Lý do bắt cầu:",
    "Ch?a co d? li?u ?i chi?u k? tr??c.": "Chưa có dữ liệu đối chiếu kỳ trước.",
    "B?ng ?i Chi?u": "Bảng Đối Chiếu",
    "Xoa k? nay": "Xóa kỳ này",
    "K? ": "Kỳ ",
    "T?NG 5 S?": "TỔNG 5 SỐ",
    "K?T QU? K? QUAY TR??C": "KẾT QUẢ KỲ QUAY TRƯỚC",
    "H?y B?": "Hủy Bỏ",
    "XAC NH?N CH?T S?": "XÁC NHẬN CHỐT SỐ",
    "???": "🛡️",
    "??": "🎯",
    "?": "💎"
  };

  for (const [bad, good] of Object.entries(replacements)) {
    code = code.split(bad).join(good);
  }

  // Handle specific emoji spans securely without regex
  const emojiSpans = [
    ["<span style={{ color: '#ef4444' }}>🎯</span>", `<span style={{ color: '#ef4444' }}>🎯</span>`],
    ["<span style={{ color: '#eab308' }}>💎</span>", `<span style={{ color: '#eab308' }}>⚡</span>`],
    ["<span style={{ color: '#f97316' }}>🎯</span>", `<span style={{ color: '#f97316' }}>🛡️</span>`],
    ["<span style={{ color: '#10b981' }}>🎯</span>", `<span style={{ color: '#10b981' }}>🛡️</span>`],
    ["<span style={{ color: '#10b981' }}>🛡️</span>", `<span style={{ color: '#10b981' }}>🛡️</span>`],
    ["<span style={{ color: '#8b5cf6' }}>💎</span>", `<span style={{ color: '#8b5cf6' }}>💎</span>`],
    ["<span style={{ color: '#34d399' }}>🎯</span>", `<span style={{ color: '#34d399' }}>🟢</span>`],
    ["<span style={{ color: '#3b82f6' }}>🎯</span>", `<span style={{ color: '#3b82f6' }}>⚔️</span>`]
  ];

  for (const [bad, good] of emojiSpans) {
    code = code.split(bad).join(good);
  }

  fs.writeFileSync('src/App.jsx', code, 'utf8');
  console.log('Successfully repaired Vietnamese encoding and Emojis!');
} catch (e) {
  console.error("Error repairing App.jsx", e);
}
