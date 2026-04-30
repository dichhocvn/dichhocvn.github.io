// ============================================================
// thaithulang.js — Thái Thứ Lang
// Đợt hiện tại: áp dụng các bảng TTL đã cung cấp
// ============================================================

const ANSAO_THAITHULANG = (() => {
  const D = { ...TUVI_DATA };
  const CHI_KEYS = TUVI_DIACHI_UTIL.KEYS;
  // Nhóm sao TTL an theo GIỜ sinh.
  const TTL_SAO_THEO_GIO = {
    "Văn Xương": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    "Văn Khúc": [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    "Thai Phụ": [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
    "Phong Cáo": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
    "Địa Không": [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "Địa Kiếp": [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

  // Nhóm sao TTL an theo CHI NĂM sinh.
  const TTL_SAO_THEO_NAM = {
    "Thiên Mã": [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
    "Phá Toái": [5, 1, 9, 5, 1, 9, 5, 1, 9, 5, 1, 9],
    "Cô Thần": [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2],
    "Quả Tú": [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10],
    "Thiên Không": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    "Thiên Khốc": [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7],
    "Thiên Hư": [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
    "Thiên Đức": [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    "Nguyệt Đức": [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
    "Hồng Loan": [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4],
    "Đào Hoa": [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0],
    "Thiên Hỉ": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10],
    "Long Trì": [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    "Phượng Các": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    "Giải Thần": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
  };

  // Nhóm sao TTL an theo THÁNG âm sinh.
  const TTL_SAO_THEO_THANG = {
    "Hữu Bật": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    "Tả Phụ": [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    "Thiên Y": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    "Thiên Diêu": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    "Thiên Hình": [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    "Địa Giải": [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
    "Thiên Giải": [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
  };

  // Nhóm sao TTL an theo THIÊN CAN năm sinh.
  const TTL_SAO_THEO_CAN = {
    "Đà La": [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
    "Lộc Tồn": [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
    "Kình Dương": [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
    "Quốc Ấn": [10, 11, 1, 2, 1, 2, 4, 5, 7, 8],
    "Đường Phù": [7, 8, 10, 11, 10, 11, 1, 2, 4, 5],
    "Lưu Niên Văn Tinh": [5, 6, 8, 9, 8, 9, 11, 0, 9, 3],
    "Thiên Khôi": [1, 0, 11, 11, 1, 0, 2, 2, 3, 3],
    "Thiên Việt": [7, 8, 9, 9, 7, 8, 6, 6, 5, 5],
    "Thiên Quan": [7, 4, 5, 2, 3, 9, 11, 9, 10, 6],
    "Thiên Phúc": [9, 8, 0, 11, 3, 2, 6, 5, 6, 5],
    "Lưu Hà": [9, 10, 7, 8, 0, 6, 3, 4, 11, 2],
    "Thiên Trù": [5, 6, 0, 5, 6, 8, 2, 6, 9, 10],
    "Thiên La": [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    "Địa Võng": [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  };

  // Bảng Tứ Hóa của TTL theo can năm.
  const TTL_TU_HOA = [
    ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
    ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
    ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
    ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
    ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
    ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
    ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
    ['Cự Môn', 'Thiên Lương', 'Văn Khúc', 'Văn Xương'],
    ['Thiên Lương', 'Tử Vi', 'Tả Phụ', 'Vũ Khúc'],
    ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
  ];

  // Nguồn chuẩn: /Users/ducanhnguyen/Documents/tuvi/data-app/TTL/to mau/to_mau.csv
  const TTL_SAO_HANH = {
    'Bác Sỹ': 'thuy',
    'Bát Tọa': 'moc',
    'Bạch Hổ': 'kim',
    'Bệnh': '',
    'Bệnh Phù': 'tho-moc',
    'Chỉ Bối': '',
    'Cô Thần': 'tho',
    'Cự Môn': 'thuy',
    'Dưỡng': '',
    'Giải Thần': 'moc',
    'Hoa Cái': 'kim',
    'Hóa Khoa': 'moc-thuy',
    'Hóa Kị': 'thuy',
    'Hóa Lộc': 'moc-tho',
    'Hóa Quyền': 'moc-thuy',
    'Hỉ Thần': 'hoa',
    'Hỏa Tinh': 'hoa',
    'Hồng Loan': 'thuy',
    'Hữu Bật': 'thuy-tho',
    'Kiếp Sát': 'hoa',
    'Kình Dương': 'kim-hoa',
    'Linh Tinh': 'hoa',
    'Liêm Trinh': 'hoa',
    'Long Trì': 'thuy',
    'Long Đức': 'kim',
    'Lâm Quan': '',
    'Lưu Hà': 'thuy',
    'Lưu Niên Văn Tinh': 'kim',
    'Lộc Tồn': 'tho-thuy',
    'Lực Sĩ': 'hoa',
    'Mộ': '',
    'Mộc Dục': '',
    'Nguyệt Sát': '',
    'Nguyệt Đức': 'hoa',
    'Phan An': '',
    'Phi Liêm': 'hoa',
    'Phong Cáo': 'tho-thuy',
    'Phá Quân': 'thuy',
    'Phá Toái': 'hoa-kim',
    'Phúc Đức': 'tho',
    'Phượng Các': 'moc-tho',
    'Phục Binh': 'hoa',
    'Quan Phù': 'hoa',
    'Quan Phủ': 'hoa',
    'Quan Đới': '',
    'Quả Tú': 'tho',
    'Quốc Ấn': 'tho',
    'Suy': '',
    'Tai Sát': '',
    'Tam Thai': 'thuy',
    'Tang Môn': 'moc',
    'Thai': '',
    'Thai Phụ': 'kim-tho',
    'Tham Lang': 'moc-thuy',
    'Thanh Long': 'thuy',
    'Thiên Cơ': 'moc',
    'Thiên Diêu': 'thuy',
    'Thiên Giải': 'hoa',
    'Thiên Hình': 'hoa',
    'Thiên Hư': 'thuy',
    'Thiên Hỉ': 'thuy',
    'Thiên Khôi': 'hoa-kim',
    'Thiên Không': 'hoa',
    'Thiên Khốc': 'kim',
    'Thiên La': 'kim',
    'Thiên Lương': 'tho',
    'Thiên Mã': 'hoa',
    'Thiên Phúc': 'tho',
    'Thiên Phủ': 'tho',
    'Thiên Quan': 'hoa',
    'Thiên Quý': 'tho',
    'Thiên Sát': '',
    'Thiên Sứ': 'thuy',
    'Thiên Thương': 'tho',
    'Thiên Thọ': 'tho',
    'Thiên Trù': 'tho',
    'Thiên Tài': 'tho',
    'Thiên Tướng': 'thuy',
    'Thiên Việt': 'hoa-moc',
    'Thiên Y': 'thuy',
    'Thiên Đồng': 'thuy',
    'Thiên Đức': 'hoa',
    'Thiếu Dương': 'hoa',
    'Thiếu Âm': 'thuy',
    'Thái Dương': 'hoa',
    'Thái Tuế': 'hoa',
    'Thái Âm': 'thuy',
    'Thất Sát': 'kim',
    'Tiểu Hao': 'hoa',
    'Trường Sinh': '',
    'Trực Phù': 'hoa',
    'Tuyệt': '',
    'Tuế Dịch': '',
    'Tuế Phá': 'hoa',
    'Tướng Quân': 'moc',
    'Tướng Tinh': '',
    'Tả Phụ': 'tho-kim',
    'Tấu Thư': 'kim',
    'Tức Thần': '',
    'Tử': '',
    'Tử Phù': 'hoa',
    'Tử Vi': 'tho',
    'Vong Thần': '',
    'Văn Khúc': 'thuy-hoa',
    'Văn Xương': 'kim-tho',
    'Vũ Khúc': 'kim',
    'Ân Quang': 'moc',
    'Điếu Khách': 'hoa',
    'Đà La': 'kim-hoa',
    'Đào Hoa': 'moc-thuy',
    'Đường Phù': 'moc',
    'Đại Hao': 'hoa',
    'Đẩu Quân': 'hoa',
    'Đế Vượng': '',
    'Địa Giải': 'tho',
    'Địa Không': 'hoa',
    'Địa Kiếp': 'hoa',
    'Địa Võng': 'kim',
  };

  const TTL_SUC_MANH_RAW = {
    "Cự Môn": { ty: "v", suu: "h", dan: "v", mao: "m", thin: "h", ti: "h", ngo: "v", mui: "h", than: "d", dau: "m", tuat: "h", hoi: "d" },
    "Liêm Trinh": { ty: "v", suu: "d", dan: "v", mao: "h", thin: "m", ti: "h", ngo: "v", mui: "d", than: "v", dau: "h", tuat: "m", hoi: "h" },
    "Phá Quân": { ty: "m", suu: "v", dan: "h", mao: "h", thin: "d", ti: "h", ngo: "m", mui: "v", than: "h", dau: "h", tuat: "d", hoi: "h" },
    "Tham Lang": { ty: "h", suu: "m", dan: "d", mao: "h", thin: "v", ti: "h", ngo: "h", mui: "m", than: "d", dau: "h", tuat: "v", hoi: "h" },
    "Thái Âm": { ty: "v", suu: "d", dan: "h", mao: "h", thin: "h", ti: "h", ngo: "h", mui: "d", than: "v", dau: "m", tuat: "m", hoi: "m" },
    "Thái Dương": { ty: "h", suu: "d", dan: "v", mao: "v", thin: "v", ti: "m", ngo: "m", mui: "d", than: "h", dau: "h", tuat: "h", hoi: "h" },
    "Thất Sát": { ty: "m", suu: "d", dan: "m", mao: "h", thin: "h", ti: "v", ngo: "m", mui: "d", than: "m", dau: "h", tuat: "h", hoi: "v" },
    "Thiên Cơ": { ty: "d", suu: "d", dan: "h", mao: "m", thin: "m", ti: "v", ngo: "d", mui: "d", than: "v", dau: "m", tuat: "m", hoi: "h" },
    "Thiên Đồng": { ty: "v", suu: "h", dan: "m", mao: "d", thin: "h", ti: "d", ngo: "h", mui: "h", than: "m", dau: "h", tuat: "h", hoi: "d" },
    "Thiên Lương": { ty: "v", suu: "d", dan: "v", mao: "v", thin: "m", ti: "h", ngo: "m", mui: "d", than: "v", dau: "h", tuat: "m", hoi: "h" },
    "Thiên Phủ": { ty: "m", suu: "b", dan: "m", mao: "b", thin: "v", ti: "d", ngo: "m", mui: "d", than: "m", dau: "b", tuat: "v", hoi: "d" },
    "Thiên Tướng": { ty: "v", suu: "d", dan: "m", mao: "h", thin: "v", ti: "d", ngo: "v", mui: "d", than: "m", dau: "h", tuat: "v", hoi: "d" },
    "Tử Vi": { ty: "b", suu: "d", dan: "m", mao: "b", thin: "v", ti: "m", ngo: "m", mui: "d", than: "m", dau: "b", tuat: "v", hoi: "b" },
    "Vũ Khúc": { ty: "v", suu: "m", dan: "v", mao: "d", thin: "m", ti: "h", ngo: "v", mui: "m", than: "v", dau: "d", tuat: "m", hoi: "h" },
    "Văn Xương": { ty: "h", suu: "d", dan: "h", mao: "h", thin: "d", ti: "d", ngo: "h", mui: "d", than: "h", dau: "h", tuat: "d", hoi: "d" },
    "Văn Khúc": { ty: "h", suu: "d", dan: "h", mao: "h", thin: "d", ti: "d", ngo: "h", mui: "d", than: "h", dau: "h", tuat: "d", hoi: "d" },
    "Địa Không": { ty: "h", suu: "h", dan: "d", mao: "h", thin: "h", ti: "d", ngo: "h", mui: "h", than: "d", dau: "h", tuat: "h", hoi: "d" },
    "Địa Kiếp": { ty: "h", suu: "h", dan: "d", mao: "h", thin: "h", ti: "d", ngo: "h", mui: "h", than: "d", dau: "h", tuat: "h", hoi: "d" },
    "Đại Hao": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "h", ti: "h", ngo: "h", mui: "h", than: "d", dau: "d", tuat: "h", hoi: "h" },
    "Tiểu Hao": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "h", ti: "h", ngo: "h", mui: "h", than: "d", dau: "d", tuat: "h", hoi: "h" },
    "Đà La": { ty: "h", suu: "d", dan: "h", mao: "h", thin: "d", ti: "h", ngo: "h", mui: "d", than: "h", dau: "h", tuat: "d", hoi: "h" },
    "Thiên Mã": { ty: "h", suu: "h", dan: "d", mao: "h", thin: "h", ti: "d", ngo: "h", mui: "h", than: "h", dau: "h", tuat: "h", hoi: "h" },
    "Linh Tinh": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "d", ti: "d", ngo: "d", mui: "h", than: "h", dau: "h", tuat: "h", hoi: "h" },
    "Kình Dương": { ty: "h", suu: "d", dan: "h", mao: "h", thin: "d", ti: "h", ngo: "h", mui: "d", than: "h", dau: "h", tuat: "d", hoi: "h" },
    "Hỏa Tinh": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "d", ti: "d", ngo: "d", mui: "h", than: "h", dau: "h", tuat: "h", hoi: "h" },
    "Thiên Hư": { ty: "d", suu: "d", dan: "h", mao: "d", thin: "h", ti: "h", ngo: "d", mui: "d", than: "h", dau: "d", tuat: "h", hoi: "h" },
    "Hóa Kị": { ty: "h", suu: "d", dan: "h", mao: "h", thin: "d", ti: "h", ngo: "h", mui: "d", than: "h", dau: "h", tuat: "d", hoi: "h" },
    "Thiên Hình": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "h", ti: "h", ngo: "h", mui: "h", than: "d", dau: "d", tuat: "h", hoi: "h" },
    "Bạch Hổ": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "h", ti: "h", ngo: "h", mui: "h", than: "d", dau: "d", tuat: "h", hoi: "h" },
    "Thiên Khốc": { ty: "d", suu: "d", dan: "h", mao: "d", thin: "h", ti: "h", ngo: "d", mui: "d", than: "h", dau: "d", tuat: "h", hoi: "h" },
    "Thiên Diêu": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "h", ti: "h", ngo: "h", mui: "h", than: "h", dau: "d", tuat: "d", hoi: "h" },
    "Tang Môn": { ty: "h", suu: "h", dan: "d", mao: "d", thin: "h", ti: "h", ngo: "h", mui: "h", than: "d", dau: "d", tuat: "h", hoi: "h" },
  };

  const ttlData = (() => {
    // Chuyên an sao lưu (xem hạn) cho TTL.
    function buildLuuSaoTables() {
      const luuTheoChi = {
        "L.Thiên Khốc": [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7],
        "L.Thiên Hư": [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
        "L.Tang Môn": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
        "L.Bạch Hổ": [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
      };

      // L.Đại Hao / L.Tiểu Hao thuộc vòng Bác Sĩ, khởi từ Lộc Tồn (theo can năm xem).
      const locTonByCan = TTL_SAO_THEO_CAN["Lộc Tồn"];
      const luuTheoCan = {
        "L.Tiểu Hao": locTonByCan.map((chi) => (chi + 3) % 12),
        "L.Đại Hao": locTonByCan.map((chi) => (chi + 9) % 12),
      };

      return { luuTheoChi, luuTheoCan };
    }
    const { luuTheoChi: LUU_SAO_THEO_CHI, luuTheoCan: LUU_SAO_THEO_CAN } = buildLuuSaoTables();

    // Bảng an sao TTL thực dùng cho computeStarPositions.
    const SAO_THEO_GIO = { ...(D.SAO_THEO_GIO || {}), ...TTL_SAO_THEO_GIO };
    const SAO_THEO_NAM = { ...(D.SAO_THEO_NAM || {}), ...TTL_SAO_THEO_NAM };
    const SAO_THEO_THANG = { ...(D.SAO_THEO_THANG || {}), ...TTL_SAO_THEO_THANG };
    // TTL không dùng nhóm sao tháng của TCP (vd: Thiên Vu).
    delete SAO_THEO_THANG["Thiên Vu"];
    const SAO_THEO_CAN = { ...(D.SAO_THEO_CAN || {}), ...TTL_SAO_THEO_CAN };

    const TRIET = D.TRIET.map((arr) => [...arr]); // TTL: Triệt y hệt Trung Châu
    const TU_HOA = TTL_TU_HOA.map((arr) => [...arr]);

    // TTL: chỉ những sao có trong file mieu_vuong_dac_binh_ham mới có M/V/Đ/B/H.
    // Các sao khác (vd Hữu Bật) để trống trạng thái.
    const SUC_MANH_LABEL = {};
    Object.keys(D.SAO_META || {}).forEach((star) => {
      SUC_MANH_LABEL[star] = Array(12).fill("");
    });
    Object.entries(TTL_SUC_MANH_RAW).forEach(([star, row]) => {
      SUC_MANH_LABEL[star] = CHI_KEYS.map((k) => {
        const raw = String(row[k] || "").trim();
        return /^d$/i.test(raw) ? "Đ" : raw.toUpperCase();
      });
    });

    // Vòng Thái Tuế (TTL).
    function computeThaiTueRing({ chiNam }) {
      const thaiTueRing = [
        "Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm",
        "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức",
        "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù",
      ];
      const out = {};
      thaiTueRing.forEach((name, i) => {
        out[name] = (chiNam + i) % 12;
      });
      return out;
    }

    // Vòng Bác Sĩ (TTL), khởi Lộc Tồn.
    function computeBacSiRing({ chiLocTon, thuanChieu }) {
      // TTL dùng hai chuỗi khác nhau cho an thuận/an nghịch.
      const bacSiRingRaw = thuanChieu
        ? [
            "Bác Sỹ", "Lực Sĩ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư",
            "Phi Liêm", "Hỉ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ",
          ]
        : [
            "Bác Sỹ", "Quan Phủ", "Phục Binh", "Đại Hao", "Bệnh Phù", "Hỉ Thần",
            "Phi Liêm", "Tấu Thư", "Tướng Quân", "Tiểu Hao", "Thanh Long", "Lực Sĩ",
          ];
      const rename = { "Bác Sỹ": "Bác Sĩ" };
      const bacSiRing = [];
      const seen = new Set();
      bacSiRingRaw.forEach((name) => {
        const normalized = rename[name] || name;
        if (seen.has(normalized)) return;
        seen.add(normalized);
        bacSiRing.push(normalized);
      });
      const out = {};
      bacSiRing.forEach((name, i) => {
        out[name] = (chiLocTon + i) % 12;
      });
      return out;
    }

    function moveFrom(startChi, steps, forward) {
      return forward
        ? (startChi + steps) % 12
        : (startChi - steps + 12 * 10) % 12;
    }

    // Nhóm Hỏa/Linh theo quy tắc TTL.
    function computeHoaLinhPositions({ chiNam, chiGio, thuanChieu }) {
      // TuViViet TTL:
      // - Linh Tinh: Dương Nam/Âm Nữ đi nghịch từ cung khởi; Âm Nam/Dương Nữ đi thuận
      // - Hỏa Tinh: Dương Nam/Âm Nữ đi thuận từ cung khởi; Âm Nam/Dương Nữ đi nghịch
      const isDanNgoTuat = (chiNam === 2 || chiNam === 6 || chiNam === 10);
      const isThanTyThin = (chiNam === 8 || chiNam === 0 || chiNam === 4);
      const isTiDauSuu = (chiNam === 5 || chiNam === 9 || chiNam === 1);
      const isHoiMaoMui = (chiNam === 11 || chiNam === 3 || chiNam === 7);

      let hoaStart = 0;
      if (isDanNgoTuat) hoaStart = 1; // Sửu
      else if (isThanTyThin) hoaStart = 2; // Dần
      else if (isTiDauSuu) hoaStart = 3; // Mão
      else if (isHoiMaoMui) hoaStart = 9; // Dậu

      let linhStart = 10; // Tuất
      if (isDanNgoTuat) linhStart = 3; // Mão

      const steps = Math.abs(0 - chiGio);
      return {
        'Hỏa Tinh': moveFrom(hoaStart, steps, thuanChieu),
        'Linh Tinh': moveFrom(linhStart, steps, !thuanChieu),
      };
    }

    // Nhóm Thiên Thương/Thiên Sứ theo Mệnh.
    function computeThienThuongThienSu({ chiCungMenh }) {
      const chiNoBoc = (chiCungMenh + 5) % 12;
      const chiTatAch = (chiCungMenh + 7) % 12;
      return { "Thiên Thương": chiNoBoc, "Thiên Sứ": chiTatAch };
    }

    // Vòng Tướng Tinh (TTL): chỉ an Kiếp Sát và Hoa Cái.
    function computeTuongTinhRing({ chiNam }) {
      const vongTuongTinh = [
        "Tướng Tinh", "Phan An", "Tuế Dịch", "Tức Thần",
        "Hoa Cái", "Kiếp Sát", "Tai Sát", "Thiên Sát",
        null, null, "Nguyệt Sát", "Vong Thần",
      ];
      const viTriTuongTinhList = ['ty', 'dau', 'ngo', 'mao', 'ty', 'dau', 'ngo', 'mao', 'ty', 'dau', 'ngo', 'mao'];
      let viTri = TUVI_DIACHI_UTIL.NAMES[TUVI_DIACHI_UTIL.keyToIdx(viTriTuongTinhList[chiNam])];
      const out = {};
      for (let i = 0; i < 12; i++) {
        const tenSao = vongTuongTinh[i];
        if (tenSao === "Hoa Cái" || tenSao === "Kiếp Sát") {
          out[tenSao] = TUVI_DIACHI_UTIL.nameToIdx(viTri);
        }
        viTri = TUVI_DIACHI_UTIL.getNext(viTri);
      }
      return out;
    }

    function computeStarPositions({
      canNam, chiNam, chiGio, thang, ngay, chiTV, thuanChieu, chiCungMenh, chiCungThan,
    }) {
      const chiTF = D.THIEN_PHU[chiTV];
      const chinh = {
        'Tử Vi': chiTV,
        'Thiên Cơ': D.VONG_TU_VI['Thiên Cơ'][chiTV],
        'Thái Dương': D.VONG_TU_VI['Thái Dương'][chiTV],
        'Vũ Khúc': D.VONG_TU_VI['Vũ Khúc'][chiTV],
        'Thiên Đồng': D.VONG_TU_VI['Thiên Đồng'][chiTV],
        'Liêm Trinh': D.VONG_TU_VI['Liêm Trinh'][chiTV],
        'Thiên Phủ': chiTF,
        'Thái Âm': D.VONG_THIEN_PHU['Thái Âm'][chiTF],
        'Tham Lang': D.VONG_THIEN_PHU['Tham Lang'][chiTF],
        'Cự Môn': D.VONG_THIEN_PHU['Cự Môn'][chiTF],
        'Thiên Tướng': D.VONG_THIEN_PHU['Thiên Tướng'][chiTF],
        'Thiên Lương': D.VONG_THIEN_PHU['Thiên Lương'][chiTF],
        'Thất Sát': D.VONG_THIEN_PHU['Thất Sát'][chiTF],
        'Phá Quân': D.VONG_THIEN_PHU['Phá Quân'][chiTF],
      };

      const phu_can = {};
      Object.entries(SAO_THEO_CAN).forEach(([ten, arr]) => { phu_can[ten] = arr[canNam]; });

      const phu_nam = {};
      Object.entries(SAO_THEO_NAM).forEach(([ten, arr]) => { phu_nam[ten] = arr[chiNam]; });

      const phu_hoa = computeHoaLinhPositions({ chiNam, chiGio, thuanChieu });

      const phu_thang = {};
      Object.entries(SAO_THEO_THANG).forEach(([ten, arr]) => { phu_thang[ten] = arr[thang - 1]; });

      const phu_gio = {};
      Object.entries(SAO_THEO_GIO).forEach(([ten, arr]) => { phu_gio[ten] = arr[chiGio]; });

      const chiVX = SAO_THEO_GIO['Văn Xương'][chiGio];
      const chiVK = SAO_THEO_GIO['Văn Khúc'][chiGio];
      const phu_gio_ngay = {
        'Ân Quang': (chiVX + ngay - 2 + 12) % 12,
        'Thiên Quý': ((chiVK - ngay + 2) % 12 + 12) % 12,
      };

      const chiTP = SAO_THEO_THANG['Tả Phụ'][thang - 1];
      const chiHB = SAO_THEO_THANG['Hữu Bật'][thang - 1];
      const phu_thang_ngay = {
        'Tam Thai': (chiTP + ngay - 1) % 12,
        'Bát Tọa': ((chiHB - ngay + 1) % 12 + 12) % 12,
      };

      const chiLocTon = SAO_THEO_CAN['Lộc Tồn'][canNam];
      const phu_bac_si = computeBacSiRing({ chiLocTon, thuanChieu });
      const phu_thai_tue = computeThaiTueRing({ chiNam });
      const phu_tuong_tinh = computeTuongTinhRing({ chiNam });

      const phu_tai_tho = {
        'Thiên Tài': (chiCungMenh + chiNam) % 12,
        'Thiên Thọ': (chiCungThan + chiNam) % 12,
      };

      const chiDauQuan = ((chiNam - (thang - 1) + 12) % 12 + chiGio) % 12;
      const phu_dau_quan = { 'Đẩu Quân': chiDauQuan };

      return Object.assign({}, chinh, phu_can, phu_nam, phu_hoa, phu_thang, phu_gio, phu_gio_ngay, phu_thang_ngay, phu_bac_si, phu_thai_tue, phu_tuong_tinh, phu_tai_tho, phu_dau_quan);
    }

    return {
      ...D,
      SAO_THEO_GIO,
      SAO_THEO_NAM,
      SAO_THEO_THANG,
      SAO_THEO_CAN,
      TRIET,
      TU_HOA,
      SAO_HANH: TTL_SAO_HANH,
      SUC_MANH_LABEL,
      computeHoaLinhPositions,
      computeThienThuongThienSu,
      computeThaiTueRing,
      computeBacSiRing,
      computeTuongTinhRing,
      computeStarPositions,
      LUU_SAO_THEO_CHI,
      LUU_SAO_THEO_CAN,
    };
  })();

  function compute(input) {
    // Đồng bộ method active cho các module legacy đang đọc TUVI_DATA.*
    Object.assign(TUVI_DATA, {
      TU_HOA: ttlData.TU_HOA,
      SUC_MANH_LABEL: ttlData.SUC_MANH_LABEL,
      SAO_THEO_CAN: ttlData.SAO_THEO_CAN,
      SAO_THEO_NAM: ttlData.SAO_THEO_NAM,
      SAO_THEO_GIO: ttlData.SAO_THEO_GIO,
      SAO_THEO_THANG: ttlData.SAO_THEO_THANG,
      SAO_HANH: ttlData.SAO_HANH,
    });
    return ANSAO_SHARED.computeByTrungChau(input, ttlData);
  }

  return {
    compute,
    TABLES: {
      LUU_SAO_THEO_CHI: ttlData.LUU_SAO_THEO_CHI,
      LUU_SAO_THEO_CAN: ttlData.LUU_SAO_THEO_CAN,
    },
  };
})();
