// ============================================================
// thaithulang.js — Thái Thứ Lang
// Đợt hiện tại: áp dụng các bảng TTL đã cung cấp
// ============================================================

const ANSAO_THAITHULANG = (() => {
  const D = { ...TUVI_DATA, ...(ANSAO_TRUNGCHAU.TABLES || {}) };
  const CHI_KEYS = TUVI_DIACHI_UTIL.KEYS;
  const TTL_SAO_THEO_GIO = {
    "Văn Xương": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    "Văn Khúc": [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    "Thai Phụ": [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
    "Phong Cáo": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
    "Địa Không": [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    "Địa Kiếp": [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

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
    "Thiên Hỉ": [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10],
    "Long Trì": [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    "Phượng Các": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    "Giải Thần": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
  };

  const TTL_SAO_THEO_THANG = {
    "Hữu Bật": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    "Tả Phụ": [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    "Thiên Y": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    "Thiên Diêu": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    "Thiên Hình": [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    "Địa Giải": [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
    "Thiên Giải": [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
  };

  const TTL_SAO_THEO_CAN = {
    "Đà La": [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
    "Lộc Tồn": [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
    "Kình Dương": [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
    "Quốc Ấn": [10, 11, 1, 2, 1, 2, 4, 5, 7, 8],
    "Đường Phù": [7, 8, 10, 11, 10, 11, 1, 2, 4, 5],
    "LN. Văn Tinh": [5, 6, 8, 9, 8, 9, 11, 0, 9, 3],
    "Thiên Khôi": [1, 0, 11, 11, 1, 0, 2, 2, 3, 3],
    "Thiên Việt": [7, 8, 9, 9, 7, 8, 6, 6, 5, 5],
    "Thiên Quan": [7, 4, 5, 2, 3, 9, 11, 9, 10, 6],
    "Thiên Phúc": [9, 8, 0, 11, 3, 2, 6, 5, 6, 5],
    "Lưu Hà": [9, 10, 7, 8, 0, 6, 3, 4, 11, 2],
    "Thiên Trù": [5, 6, 0, 5, 6, 8, 2, 6, 9, 10],
    "Thiên La": [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    "Địa Võng": [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  };

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
    const LUU_SAO_THEO_CHI = {
      // Dùng cùng cách an với Trung Châu cho nhóm sao lưu này
      "L.Thiên Khốc": [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7],
      "L.Thiên Hư": [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
      "L.Tang Môn": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
      "L.Bạch Hổ": [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
    };

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

    const SAO_THEO_GIO = { ...D.SAO_THEO_GIO, ...TTL_SAO_THEO_GIO };
    const SAO_THEO_NAM = { ...D.SAO_THEO_NAM, ...TTL_SAO_THEO_NAM };
    const SAO_THEO_THANG = { ...D.SAO_THEO_THANG, ...TTL_SAO_THEO_THANG };
    const SAO_THEO_CAN = { ...D.SAO_THEO_CAN, ...TTL_SAO_THEO_CAN };

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

    return {
      ...D,
      SAO_THEO_GIO,
      SAO_THEO_NAM,
      SAO_THEO_THANG,
      SAO_THEO_CAN,
      TRIET,
      TU_HOA,
      SUC_MANH_LABEL,
      computeHoaLinhPositions,
      computeThaiTueRing,
      computeBacSiRing,
      LUU_SAO_THEO_CHI,
    };
  })();

  function compute(input) {
    return ANSAO_SHARED.computeByTrungChau(input, ttlData);
  }

  return { compute, TABLES: { LUU_SAO_THEO_CHI: ttlData.LUU_SAO_THEO_CHI } };
})();
