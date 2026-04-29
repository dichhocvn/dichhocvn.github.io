    // ============================================================
    // logic.js — Tính toán Tử Vi Đẩu Số, xuất JSON chuẩn
    // Phụ thuộc: data.js (TUVI_DATA phải load trước)
    // ============================================================

    const TUVI_LOGIC = (() => {
      const D = TUVI_DATA;  // alias ngắn

      // Lấy hành đơn (ưu tiên hành đầu nếu kép): 'moc-thuy' → 'moc'
      function hanhDon(hanh) { return hanh ? hanh.split('-')[0] : ''; }

      // ── Helpers ──────────────────────────────────────────────

      function chiGioFromStr(hhmm) {
        const parts = hhmm.split(':');
        const h = parseInt(parts[0]);
        const m = parts.length > 1 ? parseInt(parts[1]) : 0;
        if (isNaN(h) || h < 0 || h > 23) return null;
        return Math.floor(((h + 1) % 24) / 2);
      }

      // ── Tính vị trí các sao ──────────────────────────────────

      function tinhViTriSao(canNam, chiNam, chiGio, thang, ngay, soCuc, chiTV, thuanChieu, chiCungMenh, chiCungThan) {

        // ── Chính tinh: tra bảng b4/b5/b6/b7 ───────────────────
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

        // ── Phụ tinh theo CAN năm ────────────────────────────────
        const phu_can = {};
        Object.entries(D.SAO_THEO_CAN).forEach(([ten, arr]) => {
          phu_can[ten] = arr[canNam];
        });

        // ── Phụ tinh theo CHI năm ────────────────────────────────
        const phu_nam = {};
        Object.entries(D.SAO_THEO_NAM).forEach(([ten, arr]) => {
          phu_nam[ten] = arr[chiNam];
        });

        // ── Hỏa Tinh, Linh Tinh (chi năm + chi giờ) ─────────────
        const phu_hoa = {
          'Hỏa Tinh': (D.HOA_TINH_KHOI[chiNam] + chiGio - 1 + 12) % 12,
          'Linh Tinh': (D.LINH_TINH_KHOI[chiNam] - chiGio + 1 + 12) % 12,
        };

        // ── Phụ tinh theo THÁNG ──────────────────────────────────
        const phu_thang = {};
        Object.entries(D.SAO_THEO_THANG).forEach(([ten, arr]) => {
          phu_thang[ten] = arr[thang - 1];
        });

        // ── Phụ tinh theo GIỜ ────────────────────────────────────
        const phu_gio = {};
        Object.entries(D.SAO_THEO_GIO).forEach(([ten, arr]) => {
          phu_gio[ten] = arr[chiGio];
        });

        // ── Ân Quang & Thiên Quý (giờ + ngày) ───────────────────
        // Ân Quang: khởi tại Văn Xương, thuận ngày-1 bước, rồi lùi 1 → (chiVX + ngay - 2 + 12) % 12
        // Thiên Quý: khởi tại Văn Khúc, ngược ngày-1 bước, rồi tiến 1 → (chiVK - ngay + 2 + 12) % 12
        const chiVX = D.SAO_THEO_GIO['Văn Xương'][chiGio];
        const chiVK = D.SAO_THEO_GIO['Văn Khúc'][chiGio];
        const phu_gio_ngay = {
          'Ân Quang': (chiVX + ngay - 2 + 12) % 12,
          'Thiên Quý': ((chiVK - ngay + 2) % 12 + 12) % 12,
        };

        // ── Tam Thai & Bát Tọa (tháng + ngày) ───────────────────
        // Tam Thai : tháng 1 tại Thìn(4), thuận tới tháng sinh = Tả Phụ
        //            rồi thuận ngày-1 bước → (chiTP + ngay - 1) % 12
        // Bát Tọa  : tháng 1 tại Tuất(10), ngược tới tháng sinh = Hữu Bật
        //            rồi ngược ngày-1 bước → (chiHB - ngay + 1 + 12) % 12
        const chiTP = D.SAO_THEO_THANG['Tả Phụ'][thang - 1];
        const chiHB = D.SAO_THEO_THANG['Hữu Bật'][thang - 1];
        const phu_thang_ngay = {
          'Tam Thai': (chiTP + ngay - 1) % 12,
          'Bát Tọa': ((chiHB - ngay + 1) % 12 + 12) % 12,
        };

        // ── Vòng Bác Sĩ (12 sao, khởi tại Lộc Tồn) ─────────────
        // Thuận/nghịch giống chiều đại hạn (thuanChieu)
        const VONG_BAC_SI = [
          'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao',
          'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỉ Thần',
          'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ',
        ];
        const chiLocTon = D.SAO_THEO_CAN['Lộc Tồn'][canNam];
        const phu_bac_si = {};
        VONG_BAC_SI.forEach((ten, i) => {
          phu_bac_si[ten] = thuanChieu
            ? (chiLocTon + i) % 12
            : (chiLocTon - i + 12) % 12;
        });

        // ── Vòng Thái Tuế (12 sao, khởi chi năm, luôn thuận) ────
        const VONG_THAI_TUE = [
          'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm',
          'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức',
          'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù',
        ];
        const phu_thai_tue = {};
        VONG_THAI_TUE.forEach((ten, i) => {
          phu_thai_tue[ten] = (chiNam + i) % 12;
        });

        // ── Thiên Tài & Thiên Thọ (Mệnh/Thân + chi năm) ─────────
        // Tại cung Mệnh/Thân đặt Tý, chạy thuận tới chi năm
        const phu_tai_tho = {
          'Thiên Tài': (chiCungMenh + chiNam) % 12,
          'Thiên Thọ': (chiCungThan + chiNam) % 12,
        };

        // ── Đẩu Quân: Thái Tuế (chiNam) → ngược (thang-1) bước → thuận chiGio bước ──
        const chiDauQuan = ((chiNam - (thang - 1) + 12) % 12 + chiGio) % 12;
        const phu_dau_quan = { 'Đẩu Quân': chiDauQuan };

        return Object.assign({}, chinh, phu_can, phu_nam, phu_hoa, phu_thang, phu_gio, phu_gio_ngay, phu_thang_ngay, phu_bac_si, phu_thai_tue, phu_tai_tho, phu_dau_quan);
      }

      // ── Xuất JSON chuẩn ──────────────────────────────────────
      // Vị trí trong một cung (position):
      //   1 = địa chi (góc trái header)
      //   2 = tên cung chức (giữa header)
      //   3 = đại vận tuổi (góc phải header)
      //   4 = chính tinh (khu giữa, 2 hàng)
      //   5 = cát tinh / trung tính (cột trái khu giữa)
      //   6 = hung tinh (cột phải khu giữa)
      //   7 = vòng trường sinh (góc trái footer)
      //   8 = tháng (giữa footer)
      //   9 = đại vận số (góc phải footer)
      //
      // Schema một sao trong JSON:
      // {
      //   name:     string,   // tên sao
      //   type:     string,   // 'chinh' | 'cat' | 'hung' | 'trung'  (vị trí: chinh→pos4, cat→pos5, hung→pos6)
      //   sucManh:  string,   // 'M' | 'V' | 'B' | 'H' | ''
      //   hoaKy:    string | null,
      //   nguHanh:  string,   // 'kim'|'moc'|'thuy'|'hoa'|'tho'|''
      // }
      //
      // Schema một cung:
      // {
      //   cungChuc:   string,   // 'Mệnh' | 'Phụ Mẫu' | ...   (pos2; index infer từ cungChuc)
      //   diaChi:     string,   // 'Tý' | 'Sửu' | ...          (pos1; chiIndex infer từ diaChi)
      //   gridRow:    number,   // 1..4
      //   gridCol:    number,   // 1..4
      //   isThan:     boolean,
      //   daiVan:     number|null,  // tuổi bắt đầu đại hạn    (pos3/pos9)
      //   truongSinh: string,       // vòng trường sinh         (pos7)
      //   sao:        Star[],
      // }
      //   meta: { hoTen, ngayAL, thangAL, namAL, gioSinh, gioiTinh,
      //           canNam, chiNam, tenChiGio,
      //           chiCungMenh, chiCungThan, canCungMenh,
      //           tenCuc, thuanChieu, napAm,
      //           viTriTriet, viTriTuan },
      //   cung: Cung[12],   // thứ tự 0=Mệnh..11=Huynh Đệ, infer từ cungChuc/diaChi
      // }

      function compute({ hoTen, ngay, thang, nam, gioSinh, gioiTinh }) {
        // Validate
        const chiGio = chiGioFromStr(gioSinh);
        if (chiGio === null) throw new Error('Giờ sinh không hợp lệ');
        if (ngay < 1 || ngay > 30) throw new Error('Ngày âm lịch phải từ 1 đến 30');
        if (thang < 1 || thang > 12) throw new Error('Tháng phải từ 1 đến 12');

        // Can Chi năm
        const canNam = ((nam - 4) % 10 + 10) % 10;
        const chiNam = ((nam - 4) % 12 + 12) % 12;

        // Cung Mệnh & Thân (tra bảng)
        const chiCungMenh = D.BANG_MENH[chiGio][thang - 1];
        const chiCungThan = D.BANG_THAN[chiGio][thang - 1];

        // Ngũ Hành Cục — 2 bước:
        // 1. Tra thiên can cung Mệnh theo (canNam × chiCungMenh)
        const canCungMenh = D.BANG_THIENCAN_CUNGMENH[canNam][chiCungMenh];
        // 2. Tra cục theo (canCungMenh × chiCungMenh)
        const soCuc = D.BANG_CUC_MENH[canCungMenh][chiCungMenh];

        // Vị trí Tử Vi
        const chiTV = D.BANG_TU_VI[soCuc][ngay - 1];

        // Đại hạn (chiều đi) — tính trước để truyền vào tinhViTriSao (cần cho vòng Bác Sĩ)
        const namDuong = canNam % 2 === 0;
        const thuanChieu = (gioiTinh === 'nam') ? namDuong : !namDuong;

        // Vị trí tất cả sao
        const viTriSao = tinhViTriSao(canNam, chiNam, chiGio, thang, ngay, soCuc, chiTV, thuanChieu, chiCungMenh, chiCungThan);

        // Tứ Hóa: sao nào được hóa → vị trí chi của sao đó
        // Hóa Lộc/Quyền/Khoa an tại cung chứa sao được hóa, như sao cát độc lập
        // Hóa Kỵ an tại cung chứa sao được hóa, như sao hung độc lập
        const HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
        const hoaViTri = {}; // 'Hóa Lộc' → chi cung
        D.TU_HOA[canNam].forEach((tenSaoHoa, i) => {
          if (viTriSao[tenSaoHoa] !== undefined) {
            hoaViTri[HOA_TEN[i]] = viTriSao[tenSaoHoa];
          }
        });

        // ── Phân phối sao vào từng chi-cung ──────────────────
        const saoTrongChi = Array.from({ length: 12 }, () => ({
          chinh: [], cat: [], hung: [], trung: [],
        }));

        // An các sao thường (chính tinh + phụ tinh)
        Object.entries(viTriSao).forEach(([tenSao, chi]) => {
          if (chi === undefined || chi === null) return;
          const meta = D.SAO_META[tenSao];
          if (!meta) return;
          const smLabel = D.SUC_MANH_LABEL[tenSao] ? D.SUC_MANH_LABEL[tenSao][chi] : '';
          const _hanh = D.SAO_HANH[tenSao] || '';
          const starObj = {
            name: tenSao,
            type: meta.type,
            sucManh: smLabel,
            hoaKy: null,
            nguHanh: hanhDon(_hanh),
          };
          saoTrongChi[chi][meta.type === 'chinh' ? 'chinh' :
            meta.type === 'cat' ? 'cat' :
              meta.type === 'hung' ? 'hung' : 'trung'].push(starObj);
        });

        // An Tứ Hóa như sao độc lập
        Object.entries(hoaViTri).forEach(([tenHoa, chi]) => {
          const meta = D.SAO_META[tenHoa];
          if (!meta) return;
          const smLabel = D.SUC_MANH_LABEL[tenHoa] ? D.SUC_MANH_LABEL[tenHoa][chi] : '';
          const _hanh = D.SAO_HANH[tenHoa] || '';
          const starObj = {
            name: tenHoa,
            type: meta.type,
            sucManh: smLabel,
            hoaKy: null,
            nguHanh: hanhDon(_hanh),
          };
          saoTrongChi[chi][meta.type === 'cat' ? 'cat' : 'hung'].push(starObj);
        });

        // An Triệt — mỗi can năm có 2 cung
        const trietChis = D.TRIET[canNam]; // [chi1, chi2]
        trietChis.forEach(chi => {
          saoTrongChi[chi].hung.push({
            name: 'Triệt', type: 'hung', sucManh: '', hoaKy: null, nguHanh: '',
          });
        });

        const chiNoBoc = (chiCungMenh + 5) % 12;
        const chiTatAch = (chiCungMenh + 7) % 12;
        const _hanhTT = D.SAO_HANH['Thiên Thương'] || '';
        const _hanhTS = D.SAO_HANH['Thiên Sứ'] || '';
        saoTrongChi[chiNoBoc].hung.push({
          name: 'Thiên Thương', type: 'hung', sucManh: '', hoaKy: null,
          nguHanh: hanhDon(_hanhTT),
        });
        saoTrongChi[chiTatAch].hung.push({
          name: 'Thiên Sứ', type: 'hung', sucManh: '', hoaKy: null,
          nguHanh: hanhDon(_hanhTS),
        });

        // ── Đại hạn: gán tuổi bắt đầu theo chiều thuận/nghịch ──
        // Thuận: Mệnh(i=0) → PhụMẫu(i=1) → ... chiều kim đồng hồ
        //   chi cung thứ i = (chiCungMenh + i) % 12  ← đúng vì tên cung xếp thuận
        // Nghịch: Mệnh(i=0) → HuynhĐệ(i=1) → PhuThê(i=2) → ...
        //   chi cung thứ i = (chiCungMenh - i + 12) % 12
        // Tuổi bắt đầu đại hạn i: soCuc * (i + 1)
        const daiHanMap = {}; // chiCung → tuổi bắt đầu
        for (let i = 0; i < 12; i++) {
          const chiCungDH = thuanChieu
            ? (chiCungMenh + i) % 12
            : (chiCungMenh - i + 12) % 12;
          daiHanMap[chiCungDH] = soCuc + i * 10;
        }

        // ── Xây dựng 12 cung (thứ tự Mệnh→Huynh Đệ) ──────────
        const cung = [];
        for (let i = 0; i < 12; i++) {
          const chiCung = (chiCungMenh + i) % 12;
          const gridPos = D.CHI_GRID[chiCung];

          const saoCung = [
            ...saoTrongChi[chiCung].chinh,
            ...saoTrongChi[chiCung].cat,
            ...saoTrongChi[chiCung].hung,
            ...saoTrongChi[chiCung].trung,
          ];

          const _daiHan = daiHanMap[chiCung] ?? null;
          // Vòng Trường Sinh: khởi tại TRUONG_SINH_KHOI[soCuc], thuận/nghịch theo thuanChieu
          const khoi = D.TRUONG_SINH_KHOI[soCuc];
          let truongSinh = '';
          if (khoi !== undefined) {
            const idx = thuanChieu
              ? (chiCung - khoi + 12) % 12
              : (khoi - chiCung + 12) % 12;
            truongSinh = D.TRUONG_SINH_TEN[idx];
          }
          cung.push({
            cungChuc: D.TEN_CUNG[i],
            diaChi: D.CHI[chiCung],
            gridRow: gridPos ? gridPos.r : null,
            gridCol: gridPos ? gridPos.c : null,
            isThan: chiCung === chiCungThan,
            daiVan: _daiHan,
            truongSinh: truongSinh,
            sao: saoCung,
          });
        }

        // ── Meta tổng quan ───────────────────────────────────
        return {
          meta: {
            hoTen,
            ngayAL: ngay, thangAL: thang, namAL: nam,
            gioSinh,
            gioiTinh,
            canNam: D.CAN[canNam],
            chiNam: D.CHI[chiNam],
            tenChiGio: D.CHI[chiGio],
            chiCungMenh: D.CHI[chiCungMenh],
            chiCungThan: D.CHI[chiCungThan],
            canCungMenh: D.CAN[canCungMenh],
            tenCuc: D.TEN_CUC[soCuc],
            thuanChieu,
            viTriTriet: D.TRIET[canNam],
            viTriTuan: D.TUAN[chiNam][canNam],
            napAm: D.getNapAm(canNam, chiNam),
          },
          cung,
        };
      }

      return { compute, chiGioFromStr };
    })();
