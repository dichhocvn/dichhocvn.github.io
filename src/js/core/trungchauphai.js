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

  const SAO_THEO_CAN = {
    'Lộc Tồn': [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
    'Kình Dương': [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
    'Đà La': [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
    'Thiên Khôi': [1, 0, 11, 11, 1, 0, 6, 6, 3, 3],
    'Thiên Việt': [7, 8, 9, 9, 7, 8, 2, 2, 5, 5],
    'Quốc Ấn': [10, 11, 1, 2, 1, 2, 4, 5, 7, 8],
    'Đường Phù': [7, 8, 10, 11, 10, 11, 1, 2, 4, 5],
    'Thiên Quan': [7, 4, 5, 2, 3, 9, 11, 9, 10, 6],
    'Thiên Phúc': [9, 8, 0, 11, 3, 2, 6, 5, 6, 5],
    'Lưu Hà': [9, 10, 7, 8, 0, 6, 3, 4, 11, 2],
    'Thiên Trù': [5, 6, 0, 5, 6, 8, 2, 6, 9, 10],
    'Thiên La': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    'Địa Võng': [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    'Lưu Niên Văn Tinh': [5, 6, 8, 9, 8, 9, 11, 0, 2, 3],
  };

  const SAO_THEO_NAM = {
    'Thiên Mã': [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
    'Phá Toái': [5, 1, 9, 5, 1, 9, 5, 1, 9, 5, 1, 9],
    'Cô Thần': [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2],
    'Quả Tú': [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10],
    'Thiên Không': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    'Thiên Khốc': [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7],
    'Thiên Hư': [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
    'Nguyệt Đức': [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
    'Hồng Loan': [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4],
    'Thiên Hỉ': [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10],
    'Long Trì': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    'Phượng Các': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    'Giải Thần': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    'Niên Giải': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
  };

  const SAO_THEO_GIO = {
    'Văn Xương': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
    'Văn Khúc': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
    'Thai Phụ': [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
    'Phong Cáo': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
    'Địa Không': [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    'Địa Kiếp': [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };

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
    'Hối Khí': 'hoa', 'Quán Sách': 'thuy', 'Tiểu Hao-TT': 'hoa', 'Bệnh Phù-TT': 'tho-moc',
    'Tướng Tinh': 'hoa', 'Phan An': '', 'Tuế Dịch': '', 'Tức Thần': '',
    'Tai Sát': 'hoa', 'Thiên Sát': 'hoa', 'Chỉ Bối': '', 'Hàm Trì': 'thuy',
    'Nguyệt Sát': 'hoa', 'Vong Thần': 'hoa',
  };

  function computeHoaLinhPositions({ chiNam, chiGio }) {
    // Theo TuVan (Trung Châu): an thuận từ cung khởi theo số bước giờ sinh tính từ Tý.
    // Bước giờ = abs(STT(Tý) - STT(giờ sinh)) = chiGio.
    let hoaStart = 0;
    if (chiNam === 2 || chiNam === 6 || chiNam === 10) hoaStart = 1; // Sửu
    else if (chiNam === 8 || chiNam === 0 || chiNam === 4) hoaStart = 2; // Dần
    else if (chiNam === 5 || chiNam === 9 || chiNam === 1) hoaStart = 3; // Mão
    else hoaStart = 9; // Hợi/Mão/Mùi -> Dậu

    const linhStart = (chiNam === 2 || chiNam === 6 || chiNam === 10) ? 3 : 10; // Mão hoặc Tuất
    const steps = Math.abs(0 - chiGio);
    return {
      'Hỏa Tinh': (hoaStart + steps) % 12,
      'Linh Tinh': (linhStart + steps) % 12,
    };
  }

  function computeTuongTinhRing({ chiNam }) {
    const vongTuongTinh = [
      'Tướng Tinh', 'Phan An', 'Tuế Dịch', 'Tức Thần',
      'Hoa Cái', 'Kiếp Sát', 'Tai Sát', 'Thiên Sát',
      'Chỉ Bối', 'Hàm Trì', 'Nguyệt Sát', 'Vong Thần',
    ];
    const viTriTuongTinhList = ['ty', 'dau', 'ngo', 'mao', 'ty', 'dau', 'ngo', 'mao', 'ty', 'dau', 'ngo', 'mao'];
    let viTri = TUVI_DIACHI_UTIL.NAMES[TUVI_DIACHI_UTIL.keyToIdx(viTriTuongTinhList[chiNam])];
    const out = {};
    for (let i = 0; i < 12; i++) {
      const tenSao = vongTuongTinh[i];
      if (tenSao) {
        const chi = TUVI_DIACHI_UTIL.nameToIdx(viTri);
        out[tenSao] = chi;
        // Giữ tương thích output cũ: Đào Hoa đồng vị với Hàm Trì.
        if (tenSao === 'Hàm Trì') out['Đào Hoa'] = chi;
      }
      viTri = TUVI_DIACHI_UTIL.getNext(viTri);
    }
    return out;
  }

  function computeThienThuongThienSu({ chiCungMenh, thuanChieu }) {
    const chiNoBoc = (chiCungMenh + 5) % 12;
    const chiTatAch = (chiCungMenh + 7) % 12;
    // Theo quy ước: Âm Nam / Dương Nữ (thuanChieu=false) thì đảo vị trí Thương/Sứ.
    if (!thuanChieu) {
      return { 'Thiên Thương': chiTatAch, 'Thiên Sứ': chiNoBoc };
    }
    return { 'Thiên Thương': chiNoBoc, 'Thiên Sứ': chiTatAch };
  }

  function computeBacSiRing({ chiLocTon, thuanChieu }) {
    // TCP: Âm Nam/Dương Nữ an nghịch theo thứ tự riêng; ngược lại an thuận.
    const bacSiRaw = thuanChieu
      ? [
          'Bác Sỹ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao-BS', 'Tướng Quân', 'Tấu Thư',
          'Phi Liêm', 'Hỉ Thần', 'Bệnh Phù', 'Đại Hao-BS', 'Phục Binh', 'Quan Phủ',
        ]
      : [
          'Bác Sỹ', 'Quan Phủ', 'Phục Binh', 'Đại Hao-BS', 'Bệnh Phù', 'Hỉ Thần',
          'Phi Liêm', 'Tấu Thư', 'Tướng Quân', 'Tiểu Hao-BS', 'Thanh Long', 'Lực Sĩ',
        ];
    const normalize = (name) => String(name || '')
      .replace('-BS', '')
      .replace('Bác Sỹ', 'Bác Sĩ');
    const out = {};
    bacSiRaw.forEach((name, i) => {
      out[normalize(name)] = (chiLocTon + i) % 12;
    });
    return out;
  }

  function computeThaiTueRing({ chiNam }) {
    const thaiTueRing = [
      'Thái Tuế', 'Hối Khí', 'Tang Môn', 'Quán Sách',
      'Quan Phù', 'Tiểu Hao-TT', 'Tuế Phá', 'Long Đức',
      'Bạch Hổ', 'Thiên Đức', 'Điếu Khách', 'Bệnh Phù-TT',
    ];
    const out = {};
    thaiTueRing.forEach((name, i) => {
      out[name] = (chiNam + i) % 12;
    });
    return out;
  }

  function computeStarPositions(
    { canNam, chiNam, chiGio, thang, ngay, chiTV, thuanChieu, chiCungMenh, chiCungThan },
    dataTables
  ) {
    const DD = dataTables || D;
    const chiTF = DD.THIEN_PHU[chiTV];
    // 1) Chính tinh (14 sao Tử Vi - Thiên Phủ)
    const chinh = {
      'Tử Vi': chiTV,
      'Thiên Cơ': DD.VONG_TU_VI['Thiên Cơ'][chiTV],
      'Thái Dương': DD.VONG_TU_VI['Thái Dương'][chiTV],
      'Vũ Khúc': DD.VONG_TU_VI['Vũ Khúc'][chiTV],
      'Thiên Đồng': DD.VONG_TU_VI['Thiên Đồng'][chiTV],
      'Liêm Trinh': DD.VONG_TU_VI['Liêm Trinh'][chiTV],
      'Thiên Phủ': chiTF,
      'Thái Âm': DD.VONG_THIEN_PHU['Thái Âm'][chiTF],
      'Tham Lang': DD.VONG_THIEN_PHU['Tham Lang'][chiTF],
      'Cự Môn': DD.VONG_THIEN_PHU['Cự Môn'][chiTF],
      'Thiên Tướng': DD.VONG_THIEN_PHU['Thiên Tướng'][chiTF],
      'Thiên Lương': DD.VONG_THIEN_PHU['Thiên Lương'][chiTF],
      'Thất Sát': DD.VONG_THIEN_PHU['Thất Sát'][chiTF],
      'Phá Quân': DD.VONG_THIEN_PHU['Phá Quân'][chiTF],
    };

    // 2) Phụ tinh theo can năm sinh
    const phu_can = {};
    Object.entries(DD.SAO_THEO_CAN).forEach(([ten, arr]) => { phu_can[ten] = arr[canNam]; });

    // 3) Phụ tinh theo chi năm sinh
    const phu_nam = {};
    Object.entries(DD.SAO_THEO_NAM).forEach(([ten, arr]) => { phu_nam[ten] = arr[chiNam]; });

    // 4) Hỏa/Linh theo quy tắc method
    const phu_hoa = (typeof DD.computeHoaLinhPositions === 'function')
      ? DD.computeHoaLinhPositions({ chiNam, chiGio, thuanChieu })
      : {};

    // 5) Phụ tinh theo tháng âm
    const phu_thang = {};
    Object.entries(DD.SAO_THEO_THANG).forEach(([ten, arr]) => { phu_thang[ten] = arr[thang - 1]; });

    // 6) Phụ tinh theo giờ sinh
    const phu_gio = {};
    Object.entries(DD.SAO_THEO_GIO).forEach(([ten, arr]) => { phu_gio[ten] = arr[chiGio]; });

    // 7) Nhóm giờ + ngày: Ân Quang, Thiên Quý
    const chiVX = DD.SAO_THEO_GIO['Văn Xương'][chiGio];
    const chiVK = DD.SAO_THEO_GIO['Văn Khúc'][chiGio];
    const phu_gio_ngay = {
      'Ân Quang': (chiVX + ngay - 2 + 12) % 12,
      'Thiên Quý': ((chiVK - ngay + 2) % 12 + 12) % 12,
    };

    // 8) Nhóm tháng + ngày: Tam Thai, Bát Tọa
    const chiTP = DD.SAO_THEO_THANG['Tả Phụ'][thang - 1];
    const chiHB = DD.SAO_THEO_THANG['Hữu Bật'][thang - 1];
    const phu_thang_ngay = {
      'Tam Thai': (chiTP + ngay - 1) % 12,
      'Bát Tọa': ((chiHB - ngay + 1) % 12 + 12) % 12,
    };

    // 9) Vòng Bác Sĩ (khởi từ Lộc Tồn)
    const chiLocTon = DD.SAO_THEO_CAN['Lộc Tồn'][canNam];
    const phu_bac_si = (typeof DD.computeBacSiRing === 'function')
      ? DD.computeBacSiRing({ chiLocTon, thuanChieu })
      : {};

    // 10) Vòng Thái Tuế
    const phu_thai_tue = (typeof DD.computeThaiTueRing === 'function')
      ? DD.computeThaiTueRing({ chiNam })
      : {};

    // 11) Vòng Tướng Tinh
    const phu_tuong_tinh = (typeof DD.computeTuongTinhRing === 'function')
      ? DD.computeTuongTinhRing({ chiNam })
      : {};

    // 12) Thiên Tài / Thiên Thọ (neo theo Mệnh/Thân + chi năm)
    const phu_tai_tho = {
      'Thiên Tài': (chiCungMenh + chiNam) % 12,
      'Thiên Thọ': (chiCungThan + chiNam) % 12,
    };

    // 13) Đẩu Quân (chi năm -> tháng -> giờ)
    const chiDauQuan = ((chiNam - (thang - 1) + 12) % 12 + chiGio) % 12;
    const phu_dau_quan = { 'Đẩu Quân': chiDauQuan };

    return Object.assign({}, chinh, phu_can, phu_nam, phu_hoa, phu_thang, phu_gio, phu_gio_ngay, phu_thang_ngay, phu_bac_si, phu_thai_tue, phu_tuong_tinh, phu_tai_tho, phu_dau_quan);
  }


  const TABLES = {
    TU_HOA,
    SUC_MANH_LABEL: Object.fromEntries(
      Object.entries(SUC_MANH_LABEL).map(([star, labels]) => [
        star,
        labels.map((label) => (/^d$/i.test(String(label || "")) ? "Đ" : label)),
      ])
    ),
    computeHoaLinhPositions,
    computeTuongTinhRing,
    computeThienThuongThienSu,
    computeStarPositions,
    computeBacSiRing,
    computeThaiTueRing,
    SAO_THEO_CAN,
    SAO_THEO_NAM,
    SAO_THEO_GIO,
    SAO_THEO_THANG,
    SAO_HANH,
  };

  const D = { ...TUVI_DATA, ...TABLES };

  function compute(input) {
    // Đồng bộ method active cho các module legacy đang đọc TUVI_DATA.*
    Object.assign(TUVI_DATA, TABLES);
    return ANSAO_SHARED.computeByTrungChau(input, D);
  }
  return { compute, TABLES };
})();
