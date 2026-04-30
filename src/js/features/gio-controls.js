// ── Giờ xem hạn (sync với input #gio) ────────────────────
    // Format hiển thị: "Dậu (17:20)" — tên chi + giờ chính xác từ #gio
    function fmtHHMM(h, m) {
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }

    function parseHHMM(str) {
      const parts = (str || '').split(':');
      const h = parseInt(parts[0]);
      const m = parts.length > 1 ? (parseInt(parts[1]) || 0) : 0;
      if (isNaN(h) || h < 0 || h > 23) return null;
      if (isNaN(m) || m < 0 || m > 59) return null;
      return { h, m };
    }

    // Sync #gio → #gioXem (hiển thị tên chi + HH:MM)
    function syncGioToGioXem() {
      const gioStr = document.getElementById('gio')?.value.trim() || '';
      const t = parseHHMM(gioStr);
      const chi = TUVI_LOGIC.chiGioFromStr(gioStr);
      const ge = document.getElementById('gioXem');
      if (!t || chi === null || !ge) return;
      const hhmm = fmtHHMM(t.h, t.m);
      ge.dataset.val = hhmm;
      ge.textContent = `${TUVI_DATA.CHI[chi]} (${hhmm})`;
    }

    // ±2 giờ; qua ranh giới Tý/Hợi thì nhảy ngày ÂL (kèm tràn tháng/năm).
    function changeGioXem(delta) {
      const gi = document.getElementById('gio');
      if (!gi) return;
      const t = parseHHMM(gi.value.trim()) || { h: 0, m: 0 };
      let newH = t.h + delta * 2;
      let dayShift = 0;
      while (newH < 0) { newH += 24; dayShift--; }
      while (newH >= 24) { newH -= 24; dayShift++; }

      if (dayShift !== 0) {
        const am = normalizeAmLichInputs();
        if (!am) return;
        const [dd, mm, yy] = lunar2Solar(am.ngay, am.thang, am.nam, 0);
        if (!dd || !mm || !yy) {
          alert('Ngày âm lịch hiện tại không hợp lệ, vui lòng kiểm tra lại.');
          return;
        }
        const jd = jdFromDate(dd, mm, yy) + dayShift;
        const [nd, nm, ny] = jdToDate(jd);
        const lunar = solar2Lunar(nd, nm, ny);
        document.getElementById('ngay').value = lunar.ngay;
        document.getElementById('thang').value = lunar.thang;
        document.getElementById('nam').value = lunar.nam;
      }

      gi.value = fmtHHMM(newH, t.m);
      syncGioToGioXem();
      if (typeof syncMobilePickersFromInputs === 'function') syncMobilePickersFromInputs();
      lapLaSo();
    }

    function onNamXemChange() {
      const xemHan = document.getElementById('chkXemHan')?.checked ?? true;
      const bar = document.getElementById('luuModeBar');
      const namNav = document.getElementById('namNavControls');
      const gioNav = document.getElementById('gioNavControls');
      const namXem = document.getElementById('namXem');
      const btnNamPrev = document.getElementById('btnNamXemPrev');
      const btnNamNext = document.getElementById('btnNamXemNext');
      const lysoImg = typeof isLysoTemplateActive === 'function' && isLysoTemplateActive();
      if (bar) bar.style.display = lysoImg ? 'none' : (xemHan ? 'flex' : 'none');
      if (namNav) namNav.classList.toggle('han-disabled', !xemHan);
      if (gioNav) gioNav.classList.remove('han-disabled');
      if (namXem) namXem.classList.toggle('han-disabled', !xemHan);
      if (btnNamPrev) btnNamPrev.disabled = !xemHan;
      if (btnNamNext) btnNamNext.disabled = !xemHan;
      if (_lastJson) {
        const gridEl = document.getElementById('grid');
        TUVI_RENDER.render(_lastJson, gridEl);
        requestAnimationFrame(() => { scaleGrid(); TUVI_RENDER.reRenderPills(); });
      }
      if (typeof refreshLysoImageForNamXem === 'function') refreshLysoImageForNamXem();
    }

    function initDateTimeDefaultsNow() {
      if (window.__dateTimeDefaultsInitDone) return;
      window.__dateTimeDefaultsInitDone = true;
      const now = new Date();
      const dd = now.getDate();
      const mm = now.getMonth() + 1;
      const yy = now.getFullYear();
      const hhmm = fmtHHMM(now.getHours(), now.getMinutes());
      const lunar = solar2Lunar(dd, mm, yy);

      const ngay = document.getElementById('ngay');
      const thang = document.getElementById('thang');
      const nam = document.getElementById('nam');
      const ngayDL = document.getElementById('ngayDL');
      const thangDL = document.getElementById('thangDL');
      const namDL = document.getElementById('namDL');
      const gio = document.getElementById('gio');

      if (ngay) ngay.value = lunar.ngay;
      if (thang) thang.value = lunar.thang;
      if (nam) nam.value = lunar.nam;
      if (ngayDL) ngayDL.value = dd;
      if (thangDL) thangDL.value = mm;
      if (namDL) namDL.value = yy;
      if (gio) gio.value = hhmm;

      syncGioToGioXem();
      if (typeof convertDL === 'function') convertDL();
      if (typeof lapLaSo === 'function') lapLaSo();
      onNamXemChange();
    }

    (function bindGioArrowButtons() {
      const prev = document.getElementById('btnGioXemPrev');
      const next = document.getElementById('btnGioXemNext');
      if (prev) prev.addEventListener('click', () => changeGioXem(-1));
      if (next) next.addEventListener('click', () => changeGioXem(1));
    })();

    initDateTimeDefaultsNow();
