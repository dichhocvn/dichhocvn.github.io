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

    const viTriSao = (typeof D.computeStarPositions === 'function')
      ? D.computeStarPositions({
          canNam,
          chiNam,
          chiGio,
          thang,
          ngay,
          chiTV,
          thuanChieu,
          chiCungMenh,
          chiCungThan,
        })
      : {};

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

    const thuongSu = (typeof D.computeThienThuongThienSu === 'function')
      ? D.computeThienThuongThienSu({ chiCungMenh, thuanChieu })
      : {};
    Object.entries(thuongSu).forEach(([ten, chi]) => {
      saoTrongChi[chi].hung.push({ name: ten, type: 'hung', sucManh: '', hoaKy: null, nguHanh: hanhDon(D.SAO_HANH[ten] || '') });
    });

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
