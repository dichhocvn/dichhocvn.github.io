const TUVI_RENDER = (() => {
      const SHARED = window.TUVI_RENDER_SHARED || {};
      const SHARED_CONST = SHARED.constants || {};

      // ── Lookup helpers: infer số từ string ───────────────────
      const CHI_STR  = ['Tý','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
      const CAN_STR  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
      const CUNG_STR = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
      const CUC_SO   = { 'Thủy Nhị Cục':2,'Mộc Tam Cục':3,'Kim Tứ Cục':4,'Thổ Ngũ Cục':5,'Hỏa Lục Cục':6 };

      function chiIdx(str)  { return CHI_STR.indexOf(str); }
      function canIdx(str)  { return CAN_STR.indexOf(str); }
      function cungIdx(str) { return CUNG_STR.indexOf(str); }
      function cucSo(str)   { return CUC_SO[str] ?? 0; }

      const SM_CLASS = { 'M': 'sm-m', 'V': 'sm-v', 'B': 'sm-b', 'H': 'sm-h' };

      // ── Tên hiển thị rút gọn ─────────────────────────────────
      const DISPLAY_NAME = { 'Lưu Niên Văn Tinh': 'LN. Văn Tinh' };
      function dn(name) { return DISPLAY_NAME[name] || name; }

      // ── Màu ngũ hành (render tự tính từ nguHanh trong JSON) ──
      const HANH_COLOR = {
        kim: '#a8a8b0',  // bạc
        moc: '#2d6a2d',  // xanh lá
        thuy: '#111118',  // đen
        hoa: '#c0392b',  // đỏ
        tho: '#c8960a',  // vàng
      };
      function hanhStyle(nguHanh) {
        // Mono mode: bỏ màu ngũ hành
        if (getComputedStyle(document.documentElement).getPropertyValue('--mono-mode').trim() === '1') return '';
        if (!nguHanh) return '';
        const c = HANH_COLOR[nguHanh];
        return c ? `color:${c}` : '';
      }

      // sucManh hiển thị dạng "(M)" inline, màu sẽ do parent div quyết định
      const SM_LABEL = { 'M': '(M)', 'V': '(V)', 'B': '(B)', 'H': '(H)' };
      function smTag(star) {
        return star.sucManh && SM_LABEL[star.sucManh]
          ? `<span class="sm-inline">${SM_LABEL[star.sucManh]}</span>` : '';
      }
      // Tam hợp: Thân-Tý-Thìn, Tị-Dậu-Sửu, Dần-Ngọ-Tuất, Hợi-Mão-Mùi
      const TAM_HOP = [
        [8, 0, 4],   // Thân Tý Thìn
        [5, 9, 1],   // Tị  Dậu Sửu
        [2, 6, 10],  // Dần Ngọ Tuất
        [11, 3, 7],  // Hợi Mão Mùi
      ];
      // Đối cung: cách nhau 6
      function doiCung(chi) { return (chi + 6) % 12; }
      function tamHopGroup(chi) { return TAM_HOP.find(g => g.includes(chi)) || []; }

      const RULE_ENGINE = SHARED.createRuleEngine
        ? SHARED.createRuleEngine({
          CHI_STR,
          chiIdx,
          doiCung,
          tamHopGroup,
          getLastJson: () => (typeof _lastJson !== 'undefined' ? _lastJson : null),
        })
        : {
          onCungTitleLeftClick: () => {},
          onChinhTinhClick: () => {},
        };
      const PILL_ENGINE = SHARED.createPillEngine
        ? SHARED.createPillEngine({ CHI_GRID_R: SHARED_CONST.CHI_GRID_R || {} })
        : { render: () => {} };
      const CENTER_RENDERER = SHARED.createCenterRenderer
        ? SHARED.createCenterRenderer({
          chiIdx,
          cucSo,
          getLastJson: () => (typeof _lastJson !== 'undefined' ? _lastJson : null),
        })
        : { renderCenter: () => '' };

      // ── Màu địa chi theo ngũ hành ───────────────────────────
      // Tý=0,Sửu=1,Dần=2,Mão=3,Thìn=4,Tị=5,Ngọ=6,Mùi=7,Thân=8,Dậu=9,Tuất=10,Hợi=11
      const CHI_MAU = SHARED_CONST.CHI_MAU || {};

      // ── Render header (TOP) ─────────────────────────────────
      // Chữ cái đầu thiên can
      const CAN_VIET_DAU = SHARED_CONST.CAN_VIET_DAU || ['G', 'Ấ', 'B', 'Đ', 'M', 'K', 'C', 'T', 'N', 'Q'];

      function renderHeader({ cungChuc, diaChi, daiVan, isThan, canCung, tenThang }) {
        const badge = isThan ? `<span class="badge badge-t">THÂN</span>` : '';
        const isMono = getComputedStyle(document.documentElement).getPropertyValue('--mono-mode').trim() === '1';
        const ci = chiIdx(diaChi);
        const chiColor = (!isMono && CHI_MAU[ci]) ? ` style="color:${CHI_MAU[ci]}"` : '';
        const canStr = canCung !== undefined ? `${CAN_VIET_DAU[canCung]}.` : '';
        const thangBadge = tenThang ? `<span class="top-thang-inner">${tenThang}</span>` : '';
        return `<div class="cung-top">
      <span class="top-chi"${chiColor}>${canStr}${diaChi}</span>
      <span class="top-ten" title="Click để luận cung"
        onclick="TUVI_RENDER.onCungTitleLeftClick(event, ${ci})">${cungChuc.toUpperCase()}${badge}</span>
      <span class="top-dh">${daiVan !== null ? daiVan : ''}${thangBadge ? `<span class="top-thang">${thangBadge}</span>` : ''}</span>
    </div>`;
      }

      // ── Sao in đậm ──────────────────────────────────────────
      const CAT_BOLD = new Set(SHARED_CONST.CAT_BOLD || []);
      const HUNG_BOLD = new Set(SHARED_CONST.HUNG_BOLD || []);

      // ── Render MIDDLE ────────────────────────────────────────
      function renderMiddle(saoCung, dvSao = [], chi) {
        const chinh = saoCung.filter(s => s.type === 'chinh');
        const cat = saoCung.filter(s => s.type === 'cat');
        const hung = saoCung.filter(s => s.type === 'hung');
        const trung = saoCung.filter(s => s.type === 'trung');

        const chinhLines = ['', ''];
        chinh.forEach((s, i) => {
          if (i < 2) {
            const _ms = hanhStyle(s.nguHanh);
            const safeStar = String(s.name || '').replace(/"/g, '&quot;');
            chinhLines[i] = `<div class="sao-chinh" title="Click để luận theo chính tinh"
            onclick="TUVI_RENDER.onChinhTinhClick(event, ${chi}, &quot;${safeStar}&quot;)"${_ms ? ` style="${_ms}"` : ''}>${s.name.toUpperCase()}${smTag(s)}</div>`;
          }
        });
        const chinhHtml = `<div class="mid-chinh">
      <div class="chinh-row">${chinhLines[0] || '<div class="chinh-empty"></div>'}</div>
      <div class="chinh-row">${chinhLines[1] || '<div class="chinh-empty"></div>'}</div>
    </div>`;

        const catList = [...cat, ...trung].sort((a, b) => (CAT_BOLD.has(b.name) ? 1 : 0) - (CAT_BOLD.has(a.name) ? 1 : 0));
        const hungList = hung.sort((a, b) => (HUNG_BOLD.has(b.name) ? 1 : 0) - (HUNG_BOLD.has(a.name) ? 1 : 0));

        const catHtml = catList.map(s => {
          const bold = CAT_BOLD.has(s.name) ? ' bold' : '';
          const _ms = hanhStyle(s.nguHanh);
          return `<div class="sao-cat${bold}"${_ms ? ` style="${_ms}"` : ''}>${dn(s.name)}${smTag(s)}</div>`;
        }).join('');
        const hungHtml = hungList.map(s => {
          if (s.name === 'Triệt') return '';
          const bold = HUNG_BOLD.has(s.name) ? ' bold' : '';
          const _ms = hanhStyle(s.nguHanh);
          return `<div class="sao-hung${bold}"${_ms ? ` style="${_ms}"` : ''}>${dn(s.name)}${smTag(s)}</div>`;
        }).join('');

        // Sao lưu ĐV - bỏ "ĐV." lấy tên thật, tra SAO_META/SAO_HANH để lấy class và màu
        let dvSaoCatHtml = '', dvSaoHungHtml = '';
        dvSao.forEach(t => {
          const tenThat = t.replace(/^(ĐV\.|L\.)/, '');
          const meta2 = TUVI_DATA.SAO_META[tenThat];
          const hanhRaw = TUVI_DATA.SAO_HANH[tenThat] || '';
          const hanh = hanhRaw.split('-')[0];
          const isHung = meta2?.type === 'hung';
          const isBold = isHung ? HUNG_BOLD.has(tenThat) : CAT_BOLD.has(tenThat);
          const cls = (isHung ? 'sao-hung' : 'sao-cat') + (isBold ? ' bold' : '');
          const _ms = hanhStyle(hanh);
          const html2 = `<div class="${cls}"${_ms ? ` style="${_ms}"` : ''}>${t}</div>`;
          if (isHung) dvSaoHungHtml += html2;
          else dvSaoCatHtml += html2;
        });

        return `<div class="cung-mid">${chinhHtml}<div class="mid-cathung-wrap"><div class="mid-cathung">
      <div class="col-cat">${catHtml}${dvSaoCatHtml}</div>
      <div class="col-hung">${hungHtml}${dvSaoHungHtml}</div>
    </div></div></div>`;
      }

      // ── Render footer (BOTTOM) ──────────────────────────────
      function renderFooter({ truongSinh, thang, daiHan, tenDV, tenLN }) {
        const dvHtml = tenDV
          ? `<span class="bot-dv"><span class="bot-dv-inner">${tenDV}</span></span>`
          : `<span class="bot-dv"></span>`;
        const lnHtml = tenLN ? `<div class="bot-ln"><span class="bot-ln-inner">${tenLN}</span></div>` : '';
        return `<div class="cung-bot">
      <div class="bot-left-col">${dvHtml}</div>
      <span class="bot-ts">${truongSinh}</span>
      <div class="bot-right-col">
        ${lnHtml}
      </div>
    </div>`;
      }

      // ── Render một ô cung ───────────────────────────────────
      function renderCung(cungData) {
        const { diaChi, gridRow, gridCol, sao, dvSao = [] } = cungData;
        const ci = chiIdx(diaChi);
        return `<div class="cung" data-chi="${ci}"
        style="grid-row:${gridRow};grid-column:${gridCol}"
        onclick="TUVI_RENDER.clickCung(${ci})">
      ${renderHeader(cungData)}
      ${renderMiddle(sao, dvSao, ci)}
      ${renderFooter(cungData)}
    </div>`;
      }

      // ── Click cung: highlight tam phương tứ chính ───────────
      let _selectedChi = null;

      function clickCung(chi) {
        if (_selectedChi === chi) {
          _selectedChi = null;
          clearHighlight();
          return;
        }
        _selectedChi = chi;
        clearHighlight();

        // Tam phương tứ chính: cung chọn + đối cung + 2 tam hợp → cùng 1 màu
        const doi = doiCung(chi);
        const tamH = tamHopGroup(chi);
        setCungClass(chi, 'hl-selected');
        setCungClass(doi, 'hl-selected');
        tamH.forEach(c => { if (c !== chi) setCungClass(c, 'hl-selected'); });
      }

      function clearHighlight() {
        document.querySelectorAll('.cung').forEach(el => {
          el.classList.remove('hl-selected', 'hl-doi', 'hl-tamhop');
        });
      }

      function setCungClass(chi, cls) {
        const el = document.querySelector(`.cung[data-chi="${chi}"]`);
        if (el) el.classList.add(cls);
      }

      let _lastMeta = null;
      let _lastLuuPills = { triet: null, tuan: null };

      // Thứ tự tên ĐV theo thứ tự cung chức (Mệnh=0, Phụ Mẫu=1, ...)
      const TEN_CUNG_DV = SHARED_CONST.TEN_CUNG_DV || [];
      const TEN_CUNG_LN = SHARED_CONST.TEN_CUNG_LN || [];
      // Ánh xạ tên cung chức → index thứ tự
      const CUNG_CHUC_IDX = { 'Mệnh': 0, 'Phụ Mẫu': 1, 'Phúc Đức': 2, 'Điền Trạch': 3, 'Quan Lộc': 4, 'Nô Bộc': 5, 'Thiên Di': 6, 'Tật Ách': 7, 'Tài Bạch': 8, 'Tử Tức': 9, 'Phu Thê': 10, 'Huynh Đệ': 11 };

      // Sao an theo địa chi cung ĐV.Mệnh (Tý=0..Hợi=11)
      // Sao an theo địa chi cung ĐV.Mệnh (chi: Tý=0..Hợi=11)
      const DV_SAO_THEO_MENH = SHARED_CONST.DV_SAO_THEO_MENH || {};

      // Sao L. an theo địa chi năm xem hạn (Tý=0..Hợi=11)
      const L_SAO_THEO_CHI = SHARED_CONST.L_SAO_THEO_CHI || {};

      // Sao an theo thiên can cung ĐV.Mệnh (can: Giáp=0..Quý=9)
      const DV_SAO_THEO_CAN = SHARED_CONST.DV_SAO_THEO_CAN || {};

      // Sao L. an theo thiên can năm xem hạn (cùng bảng, khác tiền tố)
      const L_SAO_THEO_CAN = SHARED_CONST.L_SAO_THEO_CAN || {};

      function tinhCungDVHienTai(meta, namXem) {
        const { tenCuc, chiCungMenh, thuanChieu, namAL: namSinh } = meta;
        const soCucVal = cucSo(tenCuc);
        const chiMenhIdx = chiIdx(chiCungMenh);
        const tuoi = namXem - namSinh + 1;
        if (tuoi < 0) return null;
        let sttDV = 0;
        while (true) {
          const start = soCucVal + sttDV * 10;
          const end = start + 9;
          if (tuoi < start) return null;
          if (tuoi >= start && tuoi <= end) break;
          sttDV++;
        }
        const chiDVMenh = thuanChieu
          ? (chiMenhIdx + sttDV) % 12
          : (chiMenhIdx - sttDV + 12 * 10) % 12;
        return chiDVMenh;
      }

      function render(lasoJson, gridEl) {
        _selectedChi = null;
        _lastMeta = lasoJson.meta;
        const { meta, cung } = lasoJson;

        // Tính cung ĐV hiện tại từ năm xem
        const namXemEl = document.getElementById('namXem');
        const namXem = namXemEl ? (parseInt(namXemEl.dataset.val) || 0) : 0;
        const xemHanChecked = document.getElementById('chkXemHan')?.checked ?? true;
        const xemHan = xemHanChecked && namXem > 0;
        const luuMode = document.querySelector('input[name="luuMode"]:checked')?.value || 'qt';

        // Reset lưu pills
        _lastLuuPills = { triet: null, tuan: null };

        // Sao lưu quan trọng
        const SAOQT = new Set([
          'ĐV.Hóa Lộc', 'ĐV.Hóa Quyền', 'ĐV.Hóa Khoa', 'ĐV.Hóa Kỵ',
          'L.Hóa Lộc', 'L.Hóa Quyền', 'L.Hóa Khoa', 'L.Hóa Kỵ',
          'L.Đào Hoa', 'L.Hàm Trì', 'L.Hồng Loan', 'L.Thiên Hỉ',
          'L.Kình Dương', 'L.Đà La', 'ĐV.Kình Dương', 'ĐV.Đà La',
          'L.Thiên Khôi', 'L.Thiên Việt',
          'L.Tang Môn', 'L.Bạch Hổ', 'L.Thiên Khốc', 'L.Thiên Hư',
        ]);
        const chiDVMenh = xemHan ? tinhCungDVHienTai(meta, namXem) : null;

        // Map chiIndex → tên ĐV dựa trên tên cung chức
        const dvMap = {};
        if (chiDVMenh !== null) {
          // Tìm cung có chi = chiDVMenh → đó là cung Mệnh ĐV
          // Từ đó ánh xạ: cung có ten X → TEN_CUNG_DV[CUNG_CHUC_IDX[X] offset từ Mệnh ĐV]
          // Thực chất: cung chiDVMenh là ĐV.MỆNH, cung kế tiếp (thuận) là ĐV.PHỤ...
          // Thứ tự cung chức đi thuận chiều từ cung Mệnh ĐV
          for (let i = 0; i < 12; i++) {
            dvMap[(chiDVMenh + i) % 12] = TEN_CUNG_DV[i];
          }
        }

        // An sao lưu theo địa chi cung ĐV.Mệnh
        // Cung lưu niên: L.Mệnh = địa chi năm xem, đi thuận
        const chiLNMenh = namXem % 12;
        const chiNamXem = ((namXem - 4) % 12 + 12) % 12;
        const lnMap = {};
        const thangMap = {};
        if (xemHan) {
          for (let i = 0; i < 12; i++) lnMap[(chiNamXem + i) % 12] = TEN_CUNG_LN[i];
          const delta = Math.abs(namXem - 1900) % 12;
          let chiThang = (delta - (meta.thangAL - 1) + 12 * 12) % 12;
          chiThang = (chiThang + chiIdx(meta.tenChiGio)) % 12;
          for (let i = 0; i < 12; i++) thangMap[(chiThang + i) % 12] = `T${i + 1}`;
        }

        const dvSaoMap = {}; // chiIndex → [tên sao lưu]
        if (chiDVMenh !== null) {
          // Theo địa chi
          Object.entries(DV_SAO_THEO_MENH).forEach(([tenSao, arr]) => {
            const chiSao = arr[chiDVMenh];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });
          // Theo thiên can: lấy can của cung ĐV.Mệnh = BANG_THIENCAN_CUNGMENH[canNam][chiDVMenh]
          const canDVMenh = TUVI_DATA.BANG_THIENCAN_CUNGMENH[canIdx(meta.canNam)][chiDVMenh];
          Object.entries(DV_SAO_THEO_CAN).forEach(([tenSao, arr]) => {
            const chiSao = arr[canDVMenh];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });
          // An sao L. theo thiên can năm xem hạn
          const canNamXem = ((namXem - 4) % 10 + 10) % 10;
          Object.entries(L_SAO_THEO_CAN).forEach(([tenSao, arr]) => {
            const chiSao = arr[canNamXem];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });
          // An sao N. theo địa chi năm xem hạn
          Object.entries(L_SAO_THEO_CHI).forEach(([tenSao, arr]) => {
            const chiSao = arr[chiNamXem];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });

          // ĐV.Tứ Hóa: theo thiên can cung ĐV.Mệnh
          const HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
          // Lookup: tên sao → chiIndex của cung chứa sao đó (từ cung[])
          const chiCuaSao = (tenSao) => {
            const c = cung.find(c => c.sao.some(s => s.name === tenSao));
            return c ? chiIdx(c.diaChi) : undefined;
          };
          TUVI_DATA.TU_HOA[canDVMenh].forEach((tenSaoHoa, i) => {
            const chiSao = chiCuaSao(tenSaoHoa);
            if (chiSao !== undefined) {
              if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
              dvSaoMap[chiSao].push(`ĐV.${HOA_TEN[i]}`);
            }
          });

          // L.Tứ Hóa: theo thiên can năm xem hạn
          TUVI_DATA.TU_HOA[canNamXem].forEach((tenSaoHoa, i) => {
            const chiSao = chiCuaSao(tenSaoHoa);
            if (chiSao !== undefined) {
              if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
              dvSaoMap[chiSao].push(`L.${HOA_TEN[i]}`);
            }
          });

        }

        // Lưu Triệt: theo thiên can NĂM XEM (canNamXem)
        // Lưu Tuần: theo địa chi + thiên can NĂM XEM
        if (xemHan) {
          const canNamXemForPill = ((namXem - 4) % 10 + 10) % 10;
          _lastLuuPills.triet = TUVI_DATA.TRIET[canNamXemForPill] || null;
          _lastLuuPills.tuan = TUVI_DATA.TUAN[chiNamXem]?.[canNamXemForPill] || null;
        }

        let html = '';
        cung.forEach(c => {
          const ci = chiIdx(c.diaChi);
          const canCung = TUVI_DATA.BANG_THIENCAN_CUNGMENH[canIdx(meta.canNam)][ci];
          // Lọc sao lưu theo chế độ
          let rawDvSao = dvSaoMap[ci] || [];
          if (luuMode === 'dv') rawDvSao = rawDvSao.filter(t => t.startsWith('ĐV.'));
          if (luuMode === 'ln') rawDvSao = rawDvSao.filter(t => t.startsWith('L.'));
          if (luuMode === 'qt') rawDvSao = rawDvSao.filter(t => SAOQT.has(t));
          // luuMode === 'all': giữ nguyên không lọc
          html += renderCung({ ...c, tenDV: dvMap[ci] || '', tenLN: lnMap[ci] || '', tenThang: thangMap[ci] || '', dvSao: rawDvSao, canCung });
        });
        html += CENTER_RENDERER.renderCenter(meta);
        gridEl.innerHTML = html;
        requestAnimationFrame(() => PILL_ENGINE.render(meta, gridEl, _lastLuuPills));
      }

      function reRenderPills() {
        if (!_lastMeta) return;
        const gridEl = document.getElementById('grid');
        if (gridEl) requestAnimationFrame(() => PILL_ENGINE.render(_lastMeta, gridEl, _lastLuuPills));
      }

      return {
        render,
        clickCung,
        reRenderPills,
        onCungTitleLeftClick: RULE_ENGINE.onCungTitleLeftClick,
        onChinhTinhClick: RULE_ENGINE.onChinhTinhClick,
      };
    })();
