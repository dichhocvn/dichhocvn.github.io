// ============================================================
// trungchauphai.js — Trung Châu phái Vương Đình Chi
// ============================================================

const ANSAO_TRUNGCHAU = (() => {
  const TU_HOA = [
    ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
    ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
    ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
    ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
    ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
    ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
    ['Thái Dương', 'Vũ Khúc', 'Thiên Phủ', 'Thiên Đồng'],
    ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],
    ['Thiên Lương', 'Tử Vi', 'Thiên Phủ', 'Vũ Khúc'],
    ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
  ];

  const SUC_MANH_LABEL = {
    'Tử Vi': ['B', 'M', 'M', 'V', 'B', 'V', 'M', 'M', 'V', 'B', '', 'V'],
    'Thiên Cơ': ['M', 'H', 'V', 'V', 'M', 'B', 'M', 'H', 'B', 'V', 'M', 'B'],
    'Thái Dương': ['H', 'H', 'V', 'M', 'V', 'V', 'M', 'B', '', '', 'H', 'H'],
    'Vũ Khúc': ['V', 'M', '', 'H', 'M', 'B', 'V', 'M', 'B', 'V', 'M', 'B'],
    'Thiên Đồng': ['V', 'H', '', 'M', 'B', 'M', 'H', 'H', 'V', 'B', 'B', 'M'],
    'Liêm Trinh': ['B', 'V', 'M', '', 'V', 'H', 'B', 'M', 'M', 'B', 'V', 'H'],
    'Thiên Phủ': ['M', 'M', 'M', 'B', 'M', 'B', 'V', 'M', 'B', 'B', 'M', 'V'],
    'Thái Âm': ['M', 'M', '', 'H', '', 'H', 'H', 'B', 'B', 'V', 'V', 'M'],
    'Tham Lang': ['V', 'M', 'B', 'B', 'M', 'H', 'V', 'M', 'B', 'B', 'M', 'H'],
    'Cự Môn': ['V', 'H', 'M', 'M', 'B', 'B', 'V', 'H', 'M', 'M', 'H', 'V'],
    'Thiên Tướng': ['M', 'M', 'M', 'H', 'V', 'B', 'V', '', 'M', 'H', '', 'B'],
    'Thiên Lương': ['M', 'V', 'M', 'M', 'V', 'H', 'M', 'V', 'H', 'B', 'V', 'H'],
    'Thất Sát': ['V', 'M', 'M', 'H', 'V', 'B', 'V', 'V', 'M', '', 'M', 'B'],
    'Phá Quân': ['M', 'V', 'H', 'V', 'V', '', 'M', 'M', 'H', 'H', 'V', 'B'],
    'Hỏa Tinh': ['B', 'V', 'M', 'B', '', 'V', 'M', '', 'H', 'H', 'M', 'B'],
    'Linh Tinh': ['H', 'H', 'M', 'M', 'V', 'V', 'M', 'V', 'V', 'H', 'M', 'M'],
    'Thiên Khôi': ['V', 'V', '', 'M', '', '', 'M', '', '', '', '', 'V'],
    'Thiên Việt': ['', '', 'V', '', '', 'V', '', 'V', 'M', 'M', '', ''],
    'Lộc Tồn': ['V', '', 'M', 'V', '', 'M', 'V', '', 'M', 'V', '', 'M'],
    'Kình Dương': ['H', 'M', '', 'H', 'M', '', 'B', 'M', '', 'H', 'M', ''],
    'Đà La': ['', 'M', 'H', '', 'M', 'H', '', 'M', 'H', '', 'M', 'H'],
    'Long Trì': ['V', 'B', 'B', 'M', 'M', 'H', '', 'M', 'B', 'M', 'H', 'V'],
    'Phượng Các': ['M', 'B', 'M', 'V', 'H', 'M', 'B', 'H', '', 'M', 'M', 'V'],
    'Văn Xương': ['V', 'M', 'V', 'B', 'M', 'V', 'V', 'H', 'M', 'B', 'M', 'V'],
    'Văn Khúc': ['V', 'M', 'V', 'B', 'M', 'V', 'V', 'H', 'M', 'B', 'M', 'V'],
    'Tả Phụ': ['V', 'B', 'M', 'M', 'M', 'V', 'M', 'B', 'V', 'M', 'M', 'B'],
    'Hữu Bật': ['V', 'B', 'V', 'M', 'M', 'B', 'V', 'M', 'V', 'B', 'M', 'M'],
    'Thiên Mã': ['', '', 'V', '', '', 'B', '', '', 'V', '', '', 'B'],
  };

  const HOA_TINH_KHOI = [6, 3, 2, 9, 6, 3, 6, 9, 2, 3, 2, 9];
  const LINH_TINH_KHOI = [2, 9, 10, 3, 2, 9, 10, 3, 2, 9, 10, 3];

  const SAO_THEO_THANG = {
    'Tả Phụ': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    'Hữu Bật': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    'Thiên Y': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    'Thiên Diêu': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    'Thiên Hình': [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    'Địa Giải': [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
    'Thiên Giải': [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
    'Thiên Nguyệt': [10, 5, 4, 2, 7, 3, 11, 7, 2, 6, 10, 2],
    'Âm Sát': [2, 0, 10, 8, 6, 4, 2, 0, 10, 8, 6, 4],
    'Nguyệt Giải': [8, 8, 10, 10, 0, 0, 2, 2, 4, 4, 6, 6],
    'Thiên Vu': [5, 8, 2, 11, 5, 8, 2, 11, 5, 8, 2, 11],
  };

  const SAO_HANH = {
    'Tử Vi': 'tho', 'Thiên Cơ': 'moc', 'Thái Dương': 'hoa', 'Vũ Khúc': 'kim', 'Thiên Đồng': 'thuy',
    'Liêm Trinh': 'hoa', 'Thiên Phủ': 'tho', 'Thái Âm': 'thuy', 'Tham Lang': 'moc-thuy', 'Cự Môn': 'tho-kim',
    'Thiên Tướng': 'thuy', 'Thiên Lương': 'tho', 'Thất Sát': 'kim', 'Phá Quân': 'thuy',
    'Tả Phụ': 'tho-kim', 'Hữu Bật': 'thuy-tho', 'Văn Xương': 'kim-tho', 'Văn Khúc': 'thuy-hoa',
    'Thiên Khôi': 'hoa-kim', 'Thiên Việt': 'hoa-moc', 'Lộc Tồn': 'tho-thuy', 'Thiên Mã': 'hoa',
    'Long Trì': 'thuy', 'Phượng Các': 'moc-tho', 'Ân Quang': 'moc', 'Thiên Quý': 'tho',
    'Tam Thai': 'thuy', 'Bát Tọa': 'moc', 'Thai Phụ': 'kim-tho', 'Phong Cáo': 'tho-thuy',
    'Thiên Tài': 'tho', 'Thiên Thọ': 'tho', 'Nguyệt Đức': 'hoa', 'Hồng Loan': 'thuy',
    'Thiên Hỉ': 'thuy', 'Giải Thần': 'moc', 'Đào Hoa': 'moc-thuy', 'Thiên Y': 'thuy',
    'Địa Giải': 'tho', 'Thiên Giải': 'hoa', 'Thiên Phúc': 'tho', 'Hóa Lộc': 'tho', 'Hóa Quyền': 'moc',
    'Hóa Khoa': 'thuy', 'Hóa Kỵ': 'thuy', 'Kình Dương': 'kim-hoa', 'Đà La': 'kim-hoa',
    'Hỏa Tinh': 'hoa', 'Linh Tinh': 'hoa', 'Địa Không': 'hoa', 'Địa Kiếp': 'hoa', 'Thiên Hình': 'hoa',
    'Thiên Diêu': 'thuy', 'Âm Sát': '', 'Thiên Nguyệt': '', 'Nguyệt Giải': '', 'Thiên Vu': '',
    'Bác Sĩ': 'thuy', 'Lực Sĩ': 'hoa', 'Thanh Long': 'thuy', 'Tiểu Hao': 'hoa', 'Tướng Quân': 'moc',
    'Tấu Thư': 'kim', 'Phi Liêm': 'hoa', 'Hỉ Thần': 'hoa', 'Bệnh Phù': 'tho-moc', 'Đại Hao': 'hoa',
    'Phục Binh': 'hoa', 'Quan Phủ': 'hoa', 'Quốc Ấn': 'tho', 'Đường Phù': 'moc', 'Thiên Quan': 'hoa',
    'Lưu Hà': 'thuy', 'Thiên Trù': 'tho', 'Thiên La': 'kim', 'Địa Võng': 'kim', 'Lưu Niên Văn Tinh': 'moc',
    'Đẩu Quân': 'hoa', 'Kiếp Sát': 'hoa', 'Hoa Cái': 'tho', 'Thiên Không': 'hoa', 'Thiên Khốc': 'kim',
    'Thiên Hư': 'thuy', 'Cô Thần': 'hoa', 'Quả Tú': 'hoa', 'Phá Toái': 'hoa-kim', 'Thiên Thương': 'thuy',
    'Thiên Sứ': 'thuy', 'Thái Tuế': 'hoa', 'Thiếu Dương': 'hoa', 'Tang Môn': 'moc', 'Thiếu Âm': 'thuy',
    'Quan Phù': 'hoa', 'Tử Phù': 'hoa', 'Tuế Phá': 'hoa', 'Long Đức': 'kim', 'Bạch Hổ': 'kim',
    'Phúc Đức': 'tho', 'Điếu Khách': 'hoa', 'Trực Phù': 'hoa',
  };

  const TABLES = {
    TU_HOA,
    SUC_MANH_LABEL: Object.fromEntries(
      Object.entries(SUC_MANH_LABEL).map(([star, labels]) => [
        star,
        labels.map((label) => (/^d$/i.test(String(label || "")) ? "Đ" : label)),
      ])
    ),
    HOA_TINH_KHOI,
    LINH_TINH_KHOI,
    SAO_THEO_THANG,
    SAO_HANH,
  };

  const D = { ...TUVI_DATA, ...TABLES };
  Object.assign(TUVI_DATA, TABLES); // compatibility bridge for modules still reading TUVI_DATA.*

  function compute(input) {
    return ANSAO_SHARED.computeByTrungChau(input, D);
  }
  return { compute, TABLES };
})();
