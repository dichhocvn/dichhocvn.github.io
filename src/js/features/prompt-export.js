// ── Xuất Prompt Lá Số ────────────────────────────────────
    let _promptCurrentTab = 'text';

    const SM_LABEL = { M: 'Miếu', V: 'Vượng', Đ: 'Đắc', B: 'Bình', H: 'Hãm', '': '' };
    const TYPE_LABEL = { chinh: 'chính tinh', cat: 'cát tinh', hung: 'hung tinh', trung: 'trung tính tinh' };

    // Dùng trong buildXemHan
    function chiCuaSaoInCung(tenSao, cungArr) {
      const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
      const c = cungArr.find(c => c.sao.some(s => s.name === tenSao));
      return c ? TUVI_DIACHI_UTIL.nameToIdx(c.diaChi, CHI) : null;
    }

    function buildXemHan(j, tuoiFrom, tuoiTo) {
      const m = j.meta;
      const cung = j.cung;
      const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
      const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
      const HOA_TEN = ['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'];

      const ci = str => TUVI_DIACHI_UTIL.nameToIdx(str, CHI);
      const chiGio = ci(m.tenChiGio);
      const namSinh = m.namAL;
      const lines = [];

      lines.push('');
      lines.push('── XEM HẠN LƯU NIÊN ──────────────────────────────');
      lines.push('');
      lines.push('CÁCH ĐỌC PHẦN XEM HẠN:');
      lines.push('• "Lưu cung": vị trí 12 cung lưu niên trên lá số bản mệnh.');
      lines.push('• "Tháng": T1..T12, mỗi giá trị là địa chi cung bản mệnh mà hạn tháng rơi vào');
      lines.push('  (tính theo Lưu Đẩu Quân: phụ thuộc tháng sinh, giờ sinh, năm xem).');
      lines.push('• "Tứ hoá": Lộc/Quyền/Khoa/Kỵ → địa chi cung bản mệnh nhận hoá khí (sao hoá khí).');
      lines.push('');

      for (let tuoi = tuoiFrom; tuoi <= tuoiTo; tuoi++) {
        const nam = namSinh + tuoi - 1;
        const canIdx = ((nam - 4) % 10 + 10) % 10;
        const chiIdxNam = ((nam - 4) % 12 + 12) % 12;
        const canChi = `${CAN[canIdx]} ${CHI[chiIdxNam]}`;

        // Lưu cung: "Lưu Mệnh ở Mão, Lưu Phụ Mẫu ở Thìn, ..."
        const TEN_LUU = ['Lưu Mệnh','Lưu Phụ Mẫu','Lưu Phúc Đức','Lưu Điền Trạch','Lưu Quan Lộc','Lưu Nô Bộc','Lưu Thiên Di','Lưu Tật Ách','Lưu Tài Bạch','Lưu Tử Tức','Lưu Phu Thê','Lưu Huynh Đệ'];
        const luuCungParts = Array.from({ length: 12 }, (_, k) => `${TEN_LUU[k]} ở ${CHI[(chiIdxNam + k) % 12]}`);

        // Tháng 1-12: địa chi cung bản mệnh
        const delta = Math.abs(nam - 1900) % 12;
        let chiT1 = (delta - (m.thangAL - 1) + 12 * 12) % 12;
        chiT1 = (chiT1 + chiGio) % 12;
        const thangParts = Array.from({ length: 12 }, (_, i) =>
          `T${i+1}:${CHI[(chiT1 + i) % 12]}`
        );

        // Tứ hóa lưu tuế: địa chi cung chứa sao
        const tuHoa = TUVI_DATA.TU_HOA[canIdx];
        const hoaParts = tuHoa.map((tenSao, i) => {
          const chiSao = chiCuaSaoInCung(tenSao, cung);
          const diaChiCung = chiSao !== null ? CHI[chiSao] : '?';
          return `${HOA_TEN[i].replace('Hóa ','')}→${diaChiCung}(${tenSao})`;
        });

        lines.push(`▸ Tuổi ${String(tuoi).padStart(2)} — Năm ${nam} ${canChi}`);
        lines.push(`  Lưu cung: ${luuCungParts.join(', ')}`);
        lines.push(`  Tháng: ${thangParts.join(', ')}`);
        lines.push(`  Tứ hoá: ${hoaParts.join(' | ')}`);
        lines.push('');
      }

      return lines.join('\n');
    }

    function buildDaiVan(j, optDV) {
      if (optDV === 'none') return '';
      const m = j.meta;
      const cung = j.cung;
      const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
      const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
      const HOA_TEN = ['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'];

      // Đọc năm xem hiện tại từ UI
      const namXemEl = document.getElementById('namXem');
      const namXemUI = namXemEl ? (parseInt(namXemEl.dataset.val) || new Date().getFullYear()) : new Date().getFullYear();

      const ci = str => TUVI_DIACHI_UTIL.nameToIdx(str, CHI);
      // Tìm đại vận của một tuổi: dùng lại logic tinhCungDVHienTai
      function getDVInfo(tuoi) {
        const soCucVal = { 'Thủy Nhị Cục':2,'Mộc Tam Cục':3,'Kim Tứ Cục':4,'Thổ Ngũ Cục':5,'Hỏa Lục Cục':6 }[m.tenCuc] ?? 0;
        const chiMenh = ci(m.chiCungMenh);
        let stt = 0;
        while (true) {
          const start = soCucVal + stt * 10;
          if (tuoi < start) return null;
          if (tuoi <= start + 9) {
            const chiDV = m.thuanChieu
              ? (chiMenh + stt) % 12
              : (chiMenh - stt + 120) % 12;
            const canDV = TUVI_DATA.BANG_THIENCAN_CUNGMENH[TUVI_THIENCAN_UTIL.nameToIdx(m.canNam, CAN)][chiDV];
            return { stt, start, end: start + 9, chiDV, canDV, diaChi: CHI[chiDV] };
          }
          stt++;
        }
      }

      const lines = [];
      lines.push('');
      lines.push('── ĐẠI VẬN ────────────────────────────────────────');

      // Xác định danh sách đại vận cần xuất
      const soCucVal = { 'Thủy Nhị Cục':2,'Mộc Tam Cục':3,'Kim Tứ Cục':4,'Thổ Ngũ Cục':5,'Hỏa Lục Cục':6 }[m.tenCuc] ?? 0;
      const tuoiHienTai = namXemUI - m.namAL + 1;

      let dvList = [];
      for (let stt = 0; stt <= 8; stt++) {
        const start = soCucVal + stt * 10;
        if (start > 90) break;
        dvList.push(stt);
      }
      if (optDV === 'current') {
        // Chỉ đại vận hiện tại
        const dvHT = getDVInfo(tuoiHienTai);
        dvList = dvHT ? [dvHT.stt] : dvList.slice(0, 1);
      }

      const TEN_CUNG_DV = ['ĐV.Mệnh','ĐV.Phụ Mẫu','ĐV.Phúc Đức','ĐV.Điền Trạch','ĐV.Quan Lộc','ĐV.Nô Bộc','ĐV.Thiên Di','ĐV.Tật Ách','ĐV.Tài Bạch','ĐV.Tử Tức','ĐV.Phu Thê','ĐV.Huynh Đệ'];

      dvList.forEach(stt => {
        const start = soCucVal + stt * 10;
        const end = start + 9;
        const chiMenh = ci(m.chiCungMenh);
        const chiDVMenh = m.thuanChieu ? (chiMenh + stt) % 12 : (chiMenh - stt + 120) % 12;
        const isCurrent = tuoiHienTai >= start && tuoiHienTai <= end;
        const namBatDau = m.namAL + start - 1;
        const namKetThuc = m.namAL + end - 1;

        lines.push(`▸ Đại vận tuổi ${start}–${end}${isCurrent ? ' ◀ HIỆN TẠI' : ''}`);
        lines.push(`  Từ năm ${namBatDau} đến năm ${namKetThuc}`);
        lines.push('');

        // 12 cung ĐV theo thứ tự từ ĐV.Mệnh
        for (let k = 0; k < 12; k++) {
          const chiCungK = (chiDVMenh + k) % 12;
          const diaChiK = CHI[chiCungK];
          const canK = TUVI_DATA.BANG_THIENCAN_CUNGMENH[TUVI_THIENCAN_UTIL.nameToIdx(m.canNam, CAN)][chiCungK];
          const tenCanK = CAN[canK];
          // Cung bản mệnh có địa chi này
          const cungBMK = cung.find(c => ci(c.diaChi) === chiCungK);
          const cungChucBMK = cungBMK ? cungBMK.cungChuc : '?';

          // Tứ hoá của thiên can cung ĐV này
          const tuHoaK = TUVI_DATA.TU_HOA[canK];
          const hoaLines = tuHoaK.map((tenSao, i) => {
            const chiSao = chiCuaSaoInCung(tenSao, cung);
            const diaChiSao = chiSao !== null ? CHI[chiSao] : '?';
            const cungChucSao = chiSao !== null ? (cung.find(c => ci(c.diaChi) === chiSao)?.cungChuc ?? '?') : '?';
            return `Thiên can này khiến ${tenSao} hoá khí thành ${HOA_TEN[i]} và bay vào cung ${diaChiSao} (${cungChucSao})`;
          }).join('. ');

          lines.push(`  ${TEN_CUNG_DV[k]} ở ${diaChiK} (${cungChucBMK}). Thiên can cung ${cungChucBMK} là ${tenCanK}. ${hoaLines}.`);
        }

        lines.push('');
      });

      return lines.join('\n');
    }

    function buildPromptText() {
      if (!_chatJson) return '';
      const j = _chatJson;
      const m = j.meta;
      const lines = [];

      // Đọc options
      const optDV = document.querySelector('input[name="optDV"]:checked')?.value ?? 'current';
      const optLN = document.querySelector('input[name="optLN"]:checked')?.value ?? 'near';

      lines.push('=== LÁ SỐ TỬ VI ĐẨU SỐ ===');
      lines.push('');
      lines.push('── THÔNG TIN CƠ BẢN ──────────────────────────────');
      lines.push(`Họ và tên   : ${m.hoTen || '(chưa nhập)'}`);
      lines.push(`Sinh (ÂL)   : ngày ${m.ngayAL} tháng ${m.thangAL} năm ${m.namAL} — ${m.canNam} ${m.chiNam}`);
      lines.push(`Giờ sinh    : ${m.gioSinh} giờ (${m.tenChiGio})`);
      lines.push(`Giới tính   : ${m.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}`);
      lines.push(`Ngũ hành cục: ${m.tenCuc}`);
      lines.push(`Cung Mệnh   : ${m.chiCungMenh}`);
      lines.push(`Cung Thân   : ${m.chiCungThan}`);
      lines.push(`Đại hạn     : ${m.thuanChieu ? 'Thuận chiều' : 'Nghịch chiều'}`);
      lines.push('');
      lines.push('── 12 CUNG ────────────────────────────────────────');

      for (const cung of j.cung) {
        const badges = [];
        if (cung.cungChuc === 'Mệnh') badges.push('CUNG MỆNH');
        if (cung.isThan) badges.push('CUNG THÂN');
        const badgeStr = badges.length ? ` [${badges.join(' & ')}]` : '';

        lines.push('');
        lines.push(`▸ CUNG ${cung.cungChuc.toUpperCase()} — ${cung.diaChi}${badgeStr}`);
        if (cung.daiVan) lines.push(`  Đại hạn    : tuổi ${cung.daiVan}`);
        if (cung.truongSinh) lines.push(`  Trường sinh: ${cung.truongSinh}`);

        const chinh = cung.sao.filter(s => s.type === 'chinh');
        const cat   = cung.sao.filter(s => s.type === 'cat');
        const hung  = cung.sao.filter(s => s.type === 'hung');
        const trung = cung.sao.filter(s => s.type === 'trung');

        const fmtSao = s => {
          const sm = SM_LABEL[s.sucManh] || '';
          return sm ? `${s.name} (${sm})` : s.name;
        };

        if (chinh.length) lines.push(`  Chính tinh : ${chinh.map(fmtSao).join(', ')}`);
        else              lines.push(`  Chính tinh : (trống)`);
        if (cat.length)   lines.push(`  Cát tinh   : ${cat.map(fmtSao).join(', ')}`);
        if (hung.length)  lines.push(`  Hung tinh  : ${hung.map(fmtSao).join(', ')}`);
        if (trung.length) lines.push(`  Trung tính : ${trung.map(fmtSao).join(', ')}`);
      }

      lines.push('');
      lines.push('────────────────────────────────────────────────────');
      lines.push('Ghi chú sức mạnh: M=Miếu, V=Vượng, B=Bình, H=Hãm');
      lines.push('════════════════════════════════════════════════════');

      // Phần đại vận
      if (optDV !== 'none') lines.push(buildDaiVan(j, optDV));

      // Phần xem hạn lưu niên
      if (optLN !== 'none') {
        let tuoiFrom = 1, tuoiTo = 90;
        if (optLN === 'near') {
          const namXemEl = document.getElementById('namXem');
          const namXem = namXemEl ? (parseInt(namXemEl.dataset.val) || new Date().getFullYear()) : new Date().getFullYear();
          const tuoiXem = namXem - m.namAL + 1;
          tuoiFrom = Math.max(1, tuoiXem - 3);
          tuoiTo   = Math.min(90, tuoiXem + 3);
        }
        lines.push(buildXemHan(j, tuoiFrom, tuoiTo));
      }

      return lines.join('\n');
    }

    function exportPrompt() {
      if (!_chatJson) { alert('Hãy lập lá số trước!'); return; }
      _promptCurrentTab = 'text';
      document.querySelectorAll('.prompt-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('ptabText').classList.add('active');
      const opts = document.getElementById('promptOptions');
      if (opts) opts.classList.remove('hidden');
      const out = buildPromptText();
      const ta = document.getElementById('promptOutput');
      ta.value = out;
      document.getElementById('promptCharCount').textContent = `${out.length.toLocaleString()} ký tự`;
      document.getElementById('promptOverlay').classList.add('open');
      document.getElementById('promptCopyBtn').classList.remove('copied');
      document.getElementById('promptCopyBtn').textContent = '📋 Sao chép';
    }

    // Tự động refresh text khi thay đổi option
    document.querySelectorAll('input[name="optDV"], input[name="optLN"]').forEach(el => {
      el.addEventListener('change', () => {
        if (_promptCurrentTab === 'text') {
          const out = buildPromptText();
          document.getElementById('promptOutput').value = out;
          document.getElementById('promptCharCount').textContent = `${out.length.toLocaleString()} ký tự`;
        }
      });
    });

    function switchPromptTab(tab) {
      _promptCurrentTab = tab;
      document.querySelectorAll('.prompt-tab').forEach(t => t.classList.remove('active'));
      document.getElementById(tab === 'text' ? 'ptabText' : 'ptabJsonFmt').classList.add('active');
      // Chỉ hiện options khi tab text
      const opts = document.getElementById('promptOptions');
      if (opts) opts.classList.toggle('hidden', tab !== 'text');

      let out = '';
      if (tab === 'text') {
        out = buildPromptText();
      } else {
        // jsonfmt: dùng _lastJson (đầy đủ, giống Xem JSON lá số cũ)
        out = JSON.stringify(_lastJson, null, 2);
      }
      document.getElementById('promptOutput').value = out;
      document.getElementById('promptCharCount').textContent = `${out.length.toLocaleString()} ký tự`;
      document.getElementById('promptCopyBtn').classList.remove('copied');
      document.getElementById('promptCopyBtn').textContent = '📋 Sao chép';
    }

    async function copyPrompt() {
      const ta = document.getElementById('promptOutput');
      try {
        await navigator.clipboard.writeText(ta.value);
      } catch {
        ta.select();
        document.execCommand('copy');
      }
      const btn = document.getElementById('promptCopyBtn');
      btn.classList.add('copied');
      btn.textContent = '✓ Đã sao chép!';
      setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '📋 Sao chép'; }, 2000);
    }

    function downloadPrompt() {
      const ta = document.getElementById('promptOutput');
      const ext = _promptCurrentTab === 'text' ? 'txt' : 'json';
      const name = (_chatJson && _chatJson.meta && _chatJson.meta.hoTen)
        ? _chatJson.meta.hoTen.replace(/\s+/g, '_') : 'laso';
      const blob = new Blob([ta.value], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `tuvi_${name}.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    function closePromptModal(e) {
      if (e.target === document.getElementById('promptOverlay')) closePromptModalDirect();
    }

    function closePromptModalDirect() {
      document.getElementById('promptOverlay').classList.remove('open');
    }

    function closeRuleModal(e) {
      if (e.target === document.getElementById('ruleOverlay')) closeRuleModalDirect();
    }

    function closeRuleModalDirect() {
      document.getElementById('ruleOverlay')?.classList.remove('open');
    }

    window.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      closePromptModalDirect();
      closeRuleModalDirect();
    });

    // Tự động lập lá số khi trang load xong
    window.addEventListener('load', () => {
      syncGioToGioXem();
      lapLaSo();
      applyResponsiveLayout();
    });
