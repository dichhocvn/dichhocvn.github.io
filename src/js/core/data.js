    // ============================================================
    // data.js — Bảng tra Tử Vi Đẩu Số
    // Sửa file này khi cần cập nhật bảng tra, phân loại sao, v.v.
    // ============================================================

    const TUVI_DATA = (() => {

      // ── Thiên Can & Địa Chi ──────────────────────────────────
      const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
      const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

      // ── Tên 12 cung (tính từ Mệnh, offset 0..11) ─────────────
      const TEN_CUNG = [
        'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
        'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
      ];

      // ── Vị trí 12 cung trên grid (chiều kim đồng hồ) ─────────
      // Hàng trên →: Tị(5) Ngọ(6) Mùi(7) Thân(8)
      // Cột phải  ↓: Dậu(9) Tuất(10)
      // Hàng dưới ←: Hợi(11) Tý(0) Sửu(1) Dần(2)
      // Cột trái  ↑: Mão(3) Thìn(4)
      const VONG_CHI = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

      // grid row/col (1-indexed) cho từng chi
      const CHI_GRID = {
        5: { r: 1, c: 1 }, 6: { r: 1, c: 2 }, 7: { r: 1, c: 3 }, 8: { r: 1, c: 4 },
        9: { r: 2, c: 4 }, 10: { r: 3, c: 4 },
        11: { r: 4, c: 4 }, 0: { r: 4, c: 3 }, 1: { r: 4, c: 2 }, 2: { r: 4, c: 1 },
        3: { r: 3, c: 1 }, 4: { r: 2, c: 1 },
      };

      // ── Bảng tra cung Mệnh & Thân [chiGio 0..11][thang-1] ───
      const BANG_MENH = [
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],   // giờ Tý
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],   // Sửu
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],   // Dần
        [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],   // Mão
        [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],   // Thìn
        [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],   // Tị
        [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],   // Ngọ
        [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],   // Mùi
        [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],   // Thân
        [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],   // Dậu
        [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],   // Tuất
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],   // Hợi
      ];

      const BANG_THAN = [
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
        [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
        [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
        [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
        [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
        [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
        [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
        [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
      ];

      // ── Bước 1: Thiên can cung Mệnh ─────────────────────────
      // BANG_THIENCAN_CUNGMENH[canNam][chiCungMenh] → canCungMenh
      // Nguồn: thien_can_12_cung_laso.csv
      const BANG_THIENCAN_CUNGMENH = [
        [2, 3, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],  // Giáp
        [4, 5, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],  // Ất
        [6, 7, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],  // Bính
        [8, 9, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],  // Đinh
        [0, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],  // Mậu
        [2, 3, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],  // Kỷ
        [4, 5, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],  // Canh
        [6, 7, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],  // Tân
        [8, 9, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],  // Nhâm
        [0, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],  // Quý
      ];

      // ── Bước 2: Ngũ Hành Cục ────────────────────────────────
      // BANG_CUC_MENH[canCungMenh][chiCungMenh] → soCuc (2,3,4,5,6)
      // Nguồn: cuc_va_hanh.csv
      const BANG_CUC_MENH = [
        [4, 4, 2, 2, 6, 6, 4, 4, 2, 2, 6, 6],  // Giáp
        [4, 4, 2, 2, 6, 6, 4, 4, 2, 2, 6, 6],  // Ất
        [2, 2, 6, 6, 5, 5, 2, 2, 6, 6, 5, 5],  // Bính
        [2, 2, 6, 6, 5, 5, 2, 2, 6, 6, 5, 5],  // Đinh
        [6, 6, 5, 5, 3, 3, 6, 6, 5, 5, 3, 3],  // Mậu
        [6, 6, 5, 5, 3, 3, 6, 6, 5, 5, 3, 3],  // Kỷ
        [5, 5, 3, 3, 4, 4, 5, 5, 3, 3, 4, 4],  // Canh
        [5, 5, 3, 3, 4, 4, 5, 5, 3, 3, 4, 4],  // Tân
        [3, 3, 4, 4, 2, 2, 3, 3, 4, 4, 2, 2],  // Nhâm
        [3, 3, 4, 4, 2, 2, 3, 3, 4, 4, 2, 2],  // Quý
      ];

      const TEN_CUC = { 2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục' };

      // ── Nạp âm (Bản mệnh) theo Can+Chi năm ─────────────────
      // Tra theo key "canNam-chiNam"
      const NAP_AM_MAP = {
        '0-0': 'Hải Trung Kim', '1-1': 'Hải Trung Kim',
        '8-2': 'Kim Bạch Kim', '9-3': 'Kim Bạch Kim',
        '6-4': 'Bạch Lạp Kim', '7-5': 'Bạch Lạp Kim',
        '0-6': 'Sa Trung Kim', '1-7': 'Sa Trung Kim',
        '8-8': 'Kiếm Phong Kim', '9-9': 'Kiếm Phong Kim',
        '6-10': 'Thoa Xuyến Kim', '7-11': 'Thoa Xuyến Kim',
        '0-8': 'Tuyền Trung Thủy', '1-9': 'Tuyền Trung Thủy',
        '8-4': 'Trường Lưu Thủy', '9-5': 'Trường Lưu Thủy',
        '2-6': 'Thiên Hà Thủy', '3-7': 'Thiên Hà Thủy',
        '0-2': 'Đại Khê Thủy', '1-3': 'Đại Khê Thủy',
        '8-10': 'Đại Hải Thủy', '9-11': 'Đại Hải Thủy',
        '2-0': 'Giản Hạ Thủy', '3-1': 'Giản Hạ Thủy',
        '4-4': 'Đại Lâm Mộc', '5-5': 'Đại Lâm Mộc',
        '8-6': 'Dương Liễu Mộc', '9-7': 'Dương Liễu Mộc',
        '6-2': 'Tùng Bách Mộc', '7-3': 'Tùng Bách Mộc',
        '4-10': 'Bình Địa Mộc', '5-11': 'Bình Địa Mộc',
        '8-0': 'Tang Đố Mộc', '9-1': 'Tang Đố Mộc',
        '6-8': 'Thạch Lựu Mộc', '7-9': 'Thạch Lựu Mộc',
        '2-2': 'Lư Trung Hỏa', '3-3': 'Lư Trung Hỏa',
        '0-10': 'Sơn Đầu Hỏa', '1-11': 'Sơn Đầu Hỏa',
        '4-0': 'Tích Lịch Hỏa', '5-1': 'Tích Lịch Hỏa',
        '2-8': 'Sơn Hạ Hỏa', '3-9': 'Sơn Hạ Hỏa',
        '0-4': 'Phú Đăng Hỏa', '1-5': 'Phú Đăng Hỏa',
        '4-6': 'Thiên Thượng Hỏa', '5-7': 'Thiên Thượng Hỏa',
        '6-6': 'Lộ Bàng Thổ', '7-7': 'Lộ Bàng Thổ',
        '4-2': 'Thành Đầu Thổ', '5-3': 'Thành Đầu Thổ',
        '2-10': 'Ốc Thượng Thổ', '3-11': 'Ốc Thượng Thổ',
        '6-0': 'Bích Thượng Thổ', '7-1': 'Bích Thượng Thổ',
        '4-8': 'Đại Trạch Thổ', '5-9': 'Đại Trạch Thổ',
        '2-4': 'Sa Trung Thổ', '3-5': 'Sa Trung Thổ',
      };
      function getNapAm(canNam, chiNam) {
        return NAP_AM_MAP[canNam + '-' + chiNam] || '';
      }

      // ── b4: Vị trí Tử Vi [cuc][ngay-1] → chiIndex ───────────
      // Nguồn: bảng b4.csv (30 ngày × 5 cục)
      const BANG_TU_VI = {
        2: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0, 1, 1, 2, 2, 3, 3, 4],   // Thủy Nhị Cục
        3: [4, 1, 2, 5, 2, 3, 6, 3, 4, 7, 4, 5, 8, 5, 6, 9, 6, 7, 10, 7, 8, 11, 8, 9, 0, 9, 10, 1, 10, 11],  // Mộc Tam Cục
        4: [11, 4, 1, 2, 0, 5, 2, 3, 1, 6, 3, 4, 2, 7, 4, 5, 3, 8, 5, 6, 4, 9, 6, 7, 5, 10, 7, 8, 6, 11],    // Kim Tứ Cục
        5: [6, 11, 4, 1, 2, 7, 0, 5, 2, 3, 8, 1, 6, 3, 4, 9, 2, 7, 4, 5, 10, 3, 8, 5, 6, 11, 4, 9, 6, 7],    // Thổ Ngũ Cục
        6: [9, 6, 11, 4, 1, 2, 10, 7, 0, 5, 2, 3, 11, 8, 1, 6, 3, 4, 0, 9, 2, 7, 4, 5, 1, 10, 3, 8, 5, 6],   // Hỏa Lục Cục
      };

      // ── b5: Vòng Tử Vi — tra theo chiTV ──────────────────────
      // VONG_TU_VI[tenSao][chiTV] → chiIndex sao
      const VONG_TU_VI = {
        'Thiên Cơ': [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'Thái Dương': [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
        'Vũ Khúc': [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
        'Thiên Đồng': [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
        'Liêm Trinh': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
      };

      // ── b6: Thiên Phủ — tra theo chiTV ───────────────────────
      // THIEN_PHU[chiTV] → chiIndex Thiên Phủ
      const THIEN_PHU = [4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5];

      // ── b7: Vòng Thiên Phủ — tra theo chiTF ──────────────────
      // VONG_THIEN_PHU[tenSao][chiTF] → chiIndex sao
      const VONG_THIEN_PHU = {
        'Thái Âm': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
        'Tham Lang': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
        'Cự Môn': [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
        'Thiên Tướng': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
        'Thiên Lương': [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
        'Thất Sát': [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
        'Phá Quân': [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      };

      // ── Tứ Hóa theo can năm ──────────────────────────────────
      // [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]
      const TU_HOA = [
        ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],    // Giáp
        ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],          // Ất
        ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],    // Bính
        ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],          // Đinh
        ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],          // Mậu
        ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],       // Kỷ
        ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],       // Canh
        ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],         // Tân
        ['Thiên Lương', 'Tử Vi', 'Tả Phụ', 'Vũ Khúc'],            // Nhâm
        ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],            // Quý
      ];

      // ── Miếu Vượng Đắc Bình Hãm ─────────────────────────────
      // SUC_MANH_LABEL[tenSao][chiCung] → '' | 'M' | 'V' | 'B' | 'H'
      // M=Miếu, V=Vượng, B=Bình, H=Hãm, ''=n/a (không áp dụng)
      // Nguồn: mieu_vuong_dac_binh_ham.csv
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

      // ── Vòng Trường Sinh theo cục [chi 0..11] ────────────────
      // ── Vòng Trường Sinh ─────────────────────────────────────
      // Khởi điểm Trường Sinh theo cục (chiIndex)
      // Thủy(2)/Thổ(5) = Thân(8), Hỏa(6) = Dần(2), Mộc(3) = Hợi(11), Kim(4) = Tị(5)
      const TRUONG_SINH_KHOI = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };

      const TRUONG_SINH_TEN = [
        'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng',
        'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
      ];

      // ── Định nghĩa sao: type trong ô cung ────────────────────
      //
      // type     : 'chinh' | 'cat' | 'hung' | 'trung'
      // vị trí render tự infer: chinh→pos4(giữa), cat→pos5(phải), hung→pos6(trái)

      const SAO_META = {
        // ── 14 Chính tinh → giữa ──
        'Tử Vi': { type: 'chinh' },
        'Thiên Cơ': { type: 'chinh' },
        'Thái Dương': { type: 'chinh' },
        'Vũ Khúc': { type: 'chinh' },
        'Thiên Đồng': { type: 'chinh' },
        'Liêm Trinh': { type: 'chinh' },
        'Thiên Phủ': { type: 'chinh' },
        'Thái Âm': { type: 'chinh' },
        'Tham Lang': { type: 'chinh' },
        'Cự Môn': { type: 'chinh' },
        'Thiên Tướng': { type: 'chinh' },
        'Thiên Lương': { type: 'chinh' },
        'Thất Sát': { type: 'chinh' },
        'Phá Quân': { type: 'chinh' },

        // ── Cát tinh → phải ──
        'Tả Phụ': { type: 'cat' },
        'Hữu Bật': { type: 'cat' },
        'Văn Xương': { type: 'cat' },
        'Văn Khúc': { type: 'cat' },
        'Thiên Khôi': { type: 'cat' },
        'Thiên Việt': { type: 'cat' },
        'Lộc Tồn': { type: 'cat' },
        'Thiên Mã': { type: 'cat' },
        'Long Trì': { type: 'cat' },
        'Phượng Các': { type: 'cat' },

        // ── Hung tinh → trái ──
        'Kình Dương': { type: 'hung' },
        'Đà La': { type: 'hung' },
        'Hỏa Tinh': { type: 'hung' },
        'Linh Tinh': { type: 'hung' },

        // ── Tứ Hóa — an như sao độc lập ──
        // Lộc/Quyền/Khoa = cát tinh (phải), Kỵ = hung tinh (trái)
        'Hóa Lộc': { type: 'cat' },
        'Hóa Quyền': { type: 'cat' },
        'Hóa Khoa': { type: 'cat' },
        'Hóa Kỵ': { type: 'hung' },

        // ── Sao theo CAN năm → phải/trái tùy tính chất ──
        'Lộc Tồn': { type: 'cat' },
        'Kình Dương': { type: 'hung' },
        'Đà La': { type: 'hung' },
        'Thiên Khôi': { type: 'cat' },
        'Thiên Việt': { type: 'cat' },
        'Quốc Ấn': { type: 'cat' },
        'Đường Phù': { type: 'cat' },
        'Thiên Quan': { type: 'cat' },
        'Thiên Phúc': { type: 'cat' },
        'Lưu Hà': { type: 'hung' },
        'Thiên Trù': { type: 'cat' },
        'Thiên La': { type: 'hung' },
        'Địa Võng': { type: 'hung' },

        // ── Lưu Niên Văn Tinh (theo thiên can năm) ──
        'Lưu Niên Văn Tinh': { type: 'cat' },

        // ── Đẩu Quân (Thái Tuế → ngược tháng → thuận giờ) ──
        'Đẩu Quân': { type: 'cat' },

        // ── Kiếp Sát & Hoa Cái (theo chi năm) ──
        'Kiếp Sát': { type: 'hung' },
        'Hoa Cái': { type: 'cat' },
        'Triệt': { type: 'hung' },
        'Thiên Thương': { type: 'hung' },  // luôn tọa cung Nô Bộc
        'Thiên Sứ': { type: 'hung' },   // luôn tọa cung Tật Ách

        // ── Vòng Thái Tuế (12 sao, khởi chi năm, thuận) ──
        'Thái Tuế': { type: 'hung' },
        'Thiếu Dương': { type: 'cat' },
        'Tang Môn': { type: 'hung' },
        'Thiếu Âm': { type: 'cat' },
        'Quan Phù': { type: 'hung' },
        'Tử Phù': { type: 'hung' },
        'Tuế Phá': { type: 'hung' },
        'Long Đức': { type: 'cat' },
        'Bạch Hổ': { type: 'hung' },
        'Phúc Đức': { type: 'cat' },
        'Điếu Khách': { type: 'hung' },
        'Trực Phù': { type: 'hung' },

        // ── Sao theo CHI năm ──
        'Thiên Mã': { type: 'cat' },
        'Phá Toái': { type: 'hung' },
        'Cô Thần': { type: 'hung' },
        'Quả Tú': { type: 'hung' },
        'Thiên Không': { type: 'hung' },
        'Thiên Khốc': { type: 'hung' },
        'Thiên Hư': { type: 'hung' },
        'Nguyệt Đức': { type: 'cat' },
        'Hồng Loan': { type: 'cat' },
        'Thiên Hỉ': { type: 'cat' },
        'Long Trì': { type: 'cat' },
        'Phượng Các': { type: 'cat' },
        'Giải Thần': { type: 'cat' },
        'Niên Giải': { type: 'cat' },
        'Hỏa Tinh': { type: 'hung' },
        'Linh Tinh': { type: 'hung' },

        // ── Sao Đào Hoa (Hàm Trì) theo CHI năm ──
        'Đào Hoa': { type: 'cat' },

        // ── Sao theo THÁNG sinh ──
        'Tả Phụ': { type: 'cat' },
        'Hữu Bật': { type: 'cat' },
        'Thiên Y': { type: 'cat' },
        'Thiên Diêu': { type: 'hung' },
        'Thiên Hình': { type: 'hung' },
        'Địa Giải': { type: 'cat' },
        'Thiên Giải': { type: 'cat' },
        'Thiên Nguyệt': { type: 'hung' },
        'Âm Sát': { type: 'hung' },
        'Nguyệt Giải': { type: 'cat' },
        'Thiên Vu': { type: 'hung' },

        // ── Sao theo GIỜ sinh ──
        'Văn Xương': { type: 'cat' },
        'Văn Khúc': { type: 'cat' },
        'Thai Phụ': { type: 'cat' },
        'Phong Cáo': { type: 'cat' },

        // ── Sao Thiên Tài & Thiên Thọ (Mệnh/Thân + chi năm) ──
        'Thiên Tài': { type: 'cat' },
        'Thiên Thọ': { type: 'cat' },
        'Địa Không': { type: 'hung' },
        'Địa Kiếp': { type: 'hung' },

        // ── Sao theo GIỜ + NGÀY sinh ──
        'Ân Quang': { type: 'cat' },
        'Thiên Quý': { type: 'cat' },

        // ── Sao theo THÁNG + NGÀY sinh ──
        'Tam Thai': { type: 'cat' },
        'Bát Tọa': { type: 'cat' },

        // ── Vòng Bác Sĩ (12 sao, khởi Lộc Tồn) ──
        'Bác Sĩ': { type: 'cat' },
        'Lực Sĩ': { type: 'trung' },
        'Thanh Long': { type: 'cat' },
        'Tiểu Hao': { type: 'hung' },
        'Tướng Quân': { type: 'cat' },
        'Tấu Thư': { type: 'cat' },
        'Phi Liêm': { type: 'hung' },
        'Hỉ Thần': { type: 'cat' },
        'Bệnh Phù': { type: 'hung' },
        'Đại Hao': { type: 'hung' },
        'Phục Binh': { type: 'hung' },
        'Quan Phủ': { type: 'hung' },
      };

      // ── Bảng tra phụ tinh — từ CSV ──────────────────────────

      // Theo THIÊN CAN năm sinh [canNam 0..9]
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
        'Lưu Hà': [9, 10, 7, 4, 5, 6, 8, 3, 11, 2],
        // Giáp(0)=Tị(5), Ất(1)=Ngọ(6), Bính(2)=Tý(0), Đinh(3)=Tị(5), Mậu(4)=Ngọ(6),
        // Kỷ(5)=Thân(8), Canh(6)=Dần(2), Tân(7)=Ngọ(6), Nhâm(8)=Dậu(9), Quý(9)=Tuất(10)
        'Thiên Trù': [5, 6, 0, 5, 6, 8, 2, 6, 9, 10],
        'Thiên La': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        'Địa Võng': [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        // Giáp=Tị(5), Ất=Ngọ(6), Bính=Thân(8), Đinh=Dậu(9), Mậu=Thân(8),
        // Kỷ=Dậu(9), Canh=Hợi(11), Tân=Tý(0), Nhâm=Dần(2), Quý=Mão(3)
        'Lưu Niên Văn Tinh': [5, 6, 8, 9, 8, 9, 11, 0, 2, 3],
      };
      // Triệt: [chi1, chi2] theo canNam 0..9
      const TRIET = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1], [8, 9], [6, 7], [4, 5], [2, 3], [0, 1]];

      // ── Tuần [chiNam 0..11][canNam 0..9] = [chi1,chi2] | null ──
      const TUAN = [
        [[10, 11], null, [8, 9], null, [6, 7], null, [4, 5], null, [2, 3], null],   // Tý
        [null, [10, 11], null, [8, 9], null, [6, 7], null, [4, 5], null, [2, 3]],   // Sửu
        [[0, 1], null, [10, 11], null, [8, 9], null, [6, 7], null, [4, 5], null],   // Dần
        [null, [0, 1], null, [10, 11], null, [8, 9], null, [6, 7], null, [4, 5]],   // Mão
        [[2, 3], null, [0, 1], null, [10, 11], null, [8, 9], null, [6, 7], null],   // Thìn
        [null, [2, 3], null, [0, 1], null, [10, 11], null, [8, 9], null, [6, 7]],   // Tị
        [[4, 5], null, [2, 3], null, [0, 1], null, [10, 11], null, [8, 9], null],   // Ngọ
        [null, [4, 5], null, [2, 3], null, [0, 1], null, [10, 11], null, [8, 9]],   // Mùi
        [[6, 7], null, [4, 5], null, [2, 3], null, [0, 1], null, [10, 11], null],   // Thân
        [null, [6, 7], null, [4, 5], null, [2, 3], null, [0, 1], null, [10, 11]],   // Dậu
        [[8, 9], null, [6, 7], null, [4, 5], null, [2, 3], null, [0, 1], null],     // Tuất
        [null, [8, 9], null, [6, 7], null, [4, 5], null, [2, 3], null, [0, 1]],     // Hợi
      ];

      // Theo ĐỊA CHI năm sinh [chiNam 0..11]
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
        'Đào Hoa': [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0],
        // Tý=0,Sửu=1,Dần=2,Mão=3,Thìn=4,Tị=5,Ngọ=6,Mùi=7,Thân=8,Dậu=9,Tuất=10,Hợi=11
        // Kiếp Sát: Dần/Ngọ/Tuất→Hợi(11), Tị/Dậu/Sửu→Dần(2), Thân/Tý/Thìn→Tị(5), Hợi/Mão/Mùi→Thân(8)
        'Kiếp Sát': [5, 2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8],
        // Hoa Cái: Hợi/Mão/Mùi→Mùi(7), Tị/Dậu/Sửu→Sửu(1), Thân/Tý/Thìn→Thìn(4), Dần/Ngọ/Tuất→Tuất(10)
        'Hoa Cái': [4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7],
      };

      // Hỏa Tinh / Linh Tinh: khởi điểm theo chi năm, cộng chi giờ
      const HOA_TINH_KHOI = [6, 3, 2, 9, 6, 3, 6, 9, 2, 3, 2, 9];
      const LINH_TINH_KHOI = [2, 9, 10, 3, 2, 9, 10, 3, 2, 9, 10, 3];

      // Theo THÁNG sinh [thang-1, 0..11]
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

      // Theo ĐỊA CHI GIỜ sinh [chiGio 0..11]
      const SAO_THEO_GIO = {
        'Văn Xương': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
        'Văn Khúc': [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
        'Thai Phụ': [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
        'Phong Cáo': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
        'Địa Không': [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        'Địa Kiếp': [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      };

      // ── Ngũ hành của từng sao ────────────────────────────────
      // Giá trị: 'kim'|'moc'|'thuy'|'hoa'|'tho' hoặc kết hợp 'kim-hoa' (gradient)
      // '' = không áp màu hành (dùng màu mặc định theo type)
      const SAO_HANH = {
        // Chính tinh
        'Tử Vi': 'tho',
        'Thiên Cơ': 'moc',
        'Thái Dương': 'hoa',
        'Vũ Khúc': 'kim',
        'Thiên Đồng': 'thuy',
        'Liêm Trinh': 'hoa',
        'Thiên Phủ': 'tho',
        'Thái Âm': 'thuy',
        'Tham Lang': 'moc-thuy',
        'Cự Môn': 'tho-kim',
        'Thiên Tướng': 'thuy',
        'Thiên Lương': 'tho',
        'Thất Sát': 'kim',
        'Phá Quân': 'thuy',
        // Cát tinh quan trọng
        'Tả Phụ': 'tho-kim',
        'Hữu Bật': 'thuy-tho',
        'Văn Xương': 'kim-tho',
        'Văn Khúc': 'thuy-hoa',
        'Thiên Khôi': 'hoa-kim',
        'Thiên Việt': 'hoa-moc',
        'Lộc Tồn': 'tho-thuy',
        'Thiên Mã': 'hoa',
        'Long Trì': 'thuy',
        'Phượng Các': 'moc-tho',
        'Ân Quang': 'moc',
        'Thiên Quý': 'tho',
        'Tam Thai': 'thuy',
        'Bát Tọa': 'moc',
        'Thai Phụ': 'kim-tho',
        'Phong Cáo': 'tho-thuy',
        'Thiên Tài': 'tho',
        'Thiên Thọ': 'tho',
        'Nguyệt Đức': 'hoa',
        'Hồng Loan': 'thuy',
        'Thiên Hỉ': 'thuy',
        'Giải Thần': 'moc',
        'Đào Hoa': 'moc-thuy',
        'Thiên Y': 'thuy',
        'Địa Giải': 'tho',
        'Thiên Giải': 'hoa',
        'Thiên Phúc': 'tho',
        // Tứ Hóa
        'Hóa Lộc': 'tho',
        'Hóa Quyền': 'moc',
        'Hóa Khoa': 'thuy',
        'Hóa Kỵ': 'thuy',
        // Hung tinh
        'Kình Dương': 'kim-hoa',
        'Đà La': 'kim-hoa',
        'Hỏa Tinh': 'hoa',
        'Linh Tinh': 'hoa',
        'Địa Không': 'hoa',
        'Địa Kiếp': 'hoa',
        'Thiên Hình': 'hoa',
        'Thiên Diêu': 'thuy',
        'Âm Sát': '',
        'Thiên Nguyệt': '',
        'Nguyệt Giải': '',
        'Thiên Vu': '',
        // Vòng Bác Sĩ
        'Bác Sĩ': 'thuy',
        'Lực Sĩ': 'hoa',
        'Thanh Long': 'thuy',
        'Tiểu Hao': 'hoa',
        'Tướng Quân': 'moc',
        'Tấu Thư': 'kim',
        'Phi Liêm': 'hoa',
        'Hỉ Thần': 'hoa',
        'Bệnh Phù': 'tho-moc',
        'Đại Hao': 'hoa',
        'Phục Binh': 'hoa',
        'Quan Phủ': 'hoa',
        // Sao theo CAN
        'Quốc Ấn': 'tho',
        'Đường Phù': 'moc',
        'Thiên Quan': 'hoa',
        'Lưu Hà': 'thuy',
        'Thiên Trù': 'tho',
        'Thiên La': 'kim',
        'Địa Võng': 'kim',
        'Lưu Niên Văn Tinh': 'moc',
        'Đẩu Quân': 'hoa',
        'Kiếp Sát': 'hoa',
        'Hoa Cái': 'tho',
        // Sao theo CHI
        'Thiên Không': 'hoa',
        'Thiên Khốc': 'kim',
        'Thiên Hư': 'thuy',
        'Cô Thần': 'hoa',
        'Quả Tú': 'hoa',
        'Phá Toái': 'hoa-kim',
        // Cố định
        'Thiên Thương': 'thuy',
        'Thiên Sứ': 'thuy',
        // Vòng Thái Tuế
        'Thái Tuế': 'hoa',
        'Thiếu Dương': 'hoa',
        'Tang Môn': 'moc',
        'Thiếu Âm': 'thuy',
        'Quan Phù': 'hoa',
        'Tử Phù': 'hoa',
        'Tuế Phá': 'hoa',
        'Long Đức': 'kim',
        'Bạch Hổ': 'kim',
        'Phúc Đức': 'tho',
        'Điếu Khách': 'hoa',
        'Trực Phù': 'hoa',
      };

      // ── Export ───────────────────────────────────────────────
      return {
        CAN, CHI, TEN_CUNG, VONG_CHI, CHI_GRID,
        BANG_MENH, BANG_THAN,
        BANG_THIENCAN_CUNGMENH, BANG_CUC_MENH, TEN_CUC, getNapAm,
        BANG_TU_VI, VONG_TU_VI, THIEN_PHU, VONG_THIEN_PHU,
        TU_HOA,
        SUC_MANH_LABEL,
        TRUONG_SINH_KHOI, TRUONG_SINH_TEN,
        SAO_META,
        SAO_HANH,
        SAO_THEO_CAN, TRIET, TUAN,
        SAO_THEO_NAM,
        SAO_THEO_THANG,
        SAO_THEO_GIO,
        HOA_TINH_KHOI, LINH_TINH_KHOI,
      };
    })();
