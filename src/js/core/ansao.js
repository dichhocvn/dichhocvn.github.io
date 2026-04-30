// ============================================================
// ansao.js — Shared core cho các phương pháp an sao
// Phụ thuộc: data.js (TUVI_DATA phải load trước)
// ============================================================

const ANSAO_SHARED = (() => {
  const BASE_DATA = TUVI_DATA;

  function hanhDon(hanh) { return hanh ? hanh.split('-')[0] : ''; }

  function chiGioFromStr(hhmm) {
    const parts = String(hhmm || "").split(':');
    const h = parseInt(parts[0]);
    if (isNaN(h) || h < 0 || h > 23) return null;
    return Math.floor(((h + 1) % 24) / 2);
  }

  function tinhViTriSaoTrungChau(D, canNam, chiNam, chiGio, thang, ngay, chiTV, thuanChieu, chiCungMenh, chiCungThan) {
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
    Object.entries(D.SAO_THEO_CAN).forEach(([ten, arr]) => { phu_can[ten] = arr[canNam]; });

    const phu_nam = {};
    Object.entries(D.SAO_THEO_NAM).forEach(([ten, arr]) => { phu_nam[ten] = arr[chiNam]; });

    const phu_hoa = (typeof D.computeHoaLinhPositions === 'function')
      ? D.computeHoaLinhPositions({ chiNam, chiGio, thuanChieu })
      : {
          'Hỏa Tinh': (D.HOA_TINH_KHOI[chiNam] + chiGio - 1 + 12) % 12,
          'Linh Tinh': (D.LINH_TINH_KHOI[chiNam] - chiGio + 1 + 12) % 12,
        };

    const phu_thang = {};
    Object.entries(D.SAO_THEO_THANG).forEach(([ten, arr]) => { phu_thang[ten] = arr[thang - 1]; });

    const phu_gio = {};
    Object.entries(D.SAO_THEO_GIO).forEach(([ten, arr]) => { phu_gio[ten] = arr[chiGio]; });

    const chiVX = D.SAO_THEO_GIO['Văn Xương'][chiGio];
    const chiVK = D.SAO_THEO_GIO['Văn Khúc'][chiGio];
    const phu_gio_ngay = {
      'Ân Quang': (chiVX + ngay - 2 + 12) % 12,
      'Thiên Quý': ((chiVK - ngay + 2) % 12 + 12) % 12,
    };

    const chiTP = D.SAO_THEO_THANG['Tả Phụ'][thang - 1];
    const chiHB = D.SAO_THEO_THANG['Hữu Bật'][thang - 1];
    const phu_thang_ngay = {
      'Tam Thai': (chiTP + ngay - 1) % 12,
      'Bát Tọa': ((chiHB - ngay + 1) % 12 + 12) % 12,
    };

    const chiLocTon = D.SAO_THEO_CAN['Lộc Tồn'][canNam];
    const phu_bac_si = (typeof D.computeBacSiRing === 'function')
      ? D.computeBacSiRing({ chiLocTon, thuanChieu })
      : (() => {
          const VONG_BAC_SI = [
            'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao',
            'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỉ Thần',
            'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ',
          ];
          const out = {};
          VONG_BAC_SI.forEach((ten, i) => {
            out[ten] = thuanChieu ? (chiLocTon + i) % 12 : (chiLocTon - i + 12) % 12;
          });
          return out;
        })();

    const phu_thai_tue = (typeof D.computeThaiTueRing === 'function')
      ? D.computeThaiTueRing({ chiNam })
      : (() => {
          const VONG_THAI_TUE = [
            'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm',
            'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức',
            'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù',
          ];
          const out = {};
          VONG_THAI_TUE.forEach((ten, i) => { out[ten] = (chiNam + i) % 12; });
          return out;
        })();

    const phu_tai_tho = {
      'Thiên Tài': (chiCungMenh + chiNam) % 12,
      'Thiên Thọ': (chiCungThan + chiNam) % 12,
    };

    const chiDauQuan = ((chiNam - (thang - 1) + 12) % 12 + chiGio) % 12;
    const phu_dau_quan = { 'Đẩu Quân': chiDauQuan };

    return Object.assign({}, chinh, phu_can, phu_nam, phu_hoa, phu_thang, phu_gio, phu_gio_ngay, phu_thang_ngay, phu_bac_si, phu_thai_tue, phu_tai_tho, phu_dau_quan);
  }

  function computeByTrungChau({ hoTen, ngay, thang, nam, gioSinh, gioiTinh }, dataOverride) {
    const D = dataOverride || BASE_DATA;
    const chiGio = chiGioFromStr(gioSinh);
    if (chiGio === null) throw new Error('Giờ sinh không hợp lệ');
    if (ngay < 1 || ngay > 30) throw new Error('Ngày âm lịch phải từ 1 đến 30');
    if (thang < 1 || thang > 12) throw new Error('Tháng phải từ 1 đến 12');

    const canNam = ((nam - 4) % 10 + 10) % 10;
    const chiNam = ((nam - 4) % 12 + 12) % 12;
    const chiCungMenh = D.BANG_MENH[chiGio][thang - 1];
    const chiCungThan = D.BANG_THAN[chiGio][thang - 1];
    const canCungMenh = D.BANG_THIENCAN_CUNGMENH[canNam][chiCungMenh];
    const soCuc = D.BANG_CUC_MENH[canCungMenh][chiCungMenh];
    const chiTV = D.BANG_TU_VI[soCuc][ngay - 1];
    const namDuong = canNam % 2 === 0;
    const thuanChieu = (gioiTinh === 'nam') ? namDuong : !namDuong;

    const viTriSao = tinhViTriSaoTrungChau(D, canNam, chiNam, chiGio, thang, ngay, chiTV, thuanChieu, chiCungMenh, chiCungThan);

    const HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    const hoaViTri = {};
    D.TU_HOA[canNam].forEach((tenSaoHoa, i) => {
      if (viTriSao[tenSaoHoa] !== undefined) hoaViTri[HOA_TEN[i]] = viTriSao[tenSaoHoa];
    });

    const saoTrongChi = Array.from({ length: 12 }, () => ({ chinh: [], cat: [], hung: [], trung: [] }));

    Object.entries(viTriSao).forEach(([tenSao, chi]) => {
      if (chi === undefined || chi === null) return;
      const meta = D.SAO_META[tenSao];
      if (!meta) return;
      const smLabel = D.SUC_MANH_LABEL[tenSao] ? D.SUC_MANH_LABEL[tenSao][chi] : '';
      const starObj = { name: tenSao, type: meta.type, sucManh: smLabel, hoaKy: null, nguHanh: hanhDon(D.SAO_HANH[tenSao] || '') };
      saoTrongChi[chi][meta.type === 'chinh' ? 'chinh' : meta.type === 'cat' ? 'cat' : meta.type === 'hung' ? 'hung' : 'trung'].push(starObj);
    });

    Object.entries(hoaViTri).forEach(([tenHoa, chi]) => {
      const meta = D.SAO_META[tenHoa];
      if (!meta) return;
      const smLabel = D.SUC_MANH_LABEL[tenHoa] ? D.SUC_MANH_LABEL[tenHoa][chi] : '';
      const starObj = { name: tenHoa, type: meta.type, sucManh: smLabel, hoaKy: null, nguHanh: hanhDon(D.SAO_HANH[tenHoa] || '') };
      saoTrongChi[chi][meta.type === 'cat' ? 'cat' : 'hung'].push(starObj);
    });

    D.TRIET[canNam].forEach((chi) => {
      saoTrongChi[chi].hung.push({ name: 'Triệt', type: 'hung', sucManh: '', hoaKy: null, nguHanh: '' });
    });

    const chiNoBoc = (chiCungMenh + 5) % 12;
    const chiTatAch = (chiCungMenh + 7) % 12;
    saoTrongChi[chiNoBoc].hung.push({ name: 'Thiên Thương', type: 'hung', sucManh: '', hoaKy: null, nguHanh: hanhDon(D.SAO_HANH['Thiên Thương'] || '') });
    saoTrongChi[chiTatAch].hung.push({ name: 'Thiên Sứ', type: 'hung', sucManh: '', hoaKy: null, nguHanh: hanhDon(D.SAO_HANH['Thiên Sứ'] || '') });

    const daiHanMap = {};
    for (let i = 0; i < 12; i++) {
      const chiCungDH = thuanChieu ? (chiCungMenh + i) % 12 : (chiCungMenh - i + 12) % 12;
      daiHanMap[chiCungDH] = soCuc + i * 10;
    }

    const cung = [];
    for (let i = 0; i < 12; i++) {
      const chiCung = (chiCungMenh + i) % 12;
      const gridPos = D.CHI_GRID[chiCung];
      const saoCung = [...saoTrongChi[chiCung].chinh, ...saoTrongChi[chiCung].cat, ...saoTrongChi[chiCung].hung, ...saoTrongChi[chiCung].trung];
      const _daiHan = daiHanMap[chiCung] ?? null;
      const khoi = D.TRUONG_SINH_KHOI[soCuc];
      let truongSinh = '';
      if (khoi !== undefined) {
        const idx = thuanChieu ? (chiCung - khoi + 12) % 12 : (khoi - chiCung + 12) % 12;
        truongSinh = D.TRUONG_SINH_TEN[idx];
      }
      cung.push({
        cungChuc: D.TEN_CUNG[i],
        diaChi: D.CHI[chiCung],
        gridRow: gridPos ? gridPos.r : null,
        gridCol: gridPos ? gridPos.c : null,
        isThan: chiCung === chiCungThan,
        daiVan: _daiHan,
        truongSinh,
        sao: saoCung,
      });
    }

    return {
      meta: {
        hoTen,
        ngayAL: ngay, thangAL: thang, namAL: nam,
        gioSinh, gioiTinh,
        canNam: D.CAN[canNam], chiNam: D.CHI[chiNam], tenChiGio: D.CHI[chiGio],
        chiCungMenh: D.CHI[chiCungMenh], chiCungThan: D.CHI[chiCungThan], canCungMenh: D.CAN[canCungMenh],
        tenCuc: D.TEN_CUC[soCuc], thuanChieu, viTriTriet: D.TRIET[canNam], viTriTuan: D.TUAN[chiNam][canNam], napAm: D.getNapAm(canNam, chiNam),
      },
      cung,
    };
  }

  return { chiGioFromStr, computeByTrungChau };
})();
