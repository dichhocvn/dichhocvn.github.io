// ── Dialog + kiểm tra ngày trước khi Lập lá số (mobile + desktop) ──
    function validateLapSoDateInputs(tab) {
      const t = tab || window._currentTab || 'AL';
      if (t === 'DL') {
        const dd = document.getElementById('ngayDL')?.value;
        const mm = document.getElementById('thangDL')?.value;
        const yy = document.getElementById('namDL')?.value;
        return validateSolarDateInput(dd, mm, yy);
      }
      const ngay = document.getElementById('ngay')?.value;
      const thang = document.getElementById('thang')?.value;
      const nam = document.getElementById('nam')?.value;
      return validateAmLichDateInput(ngay, thang, nam);
    }

    function showLapSoValidationDialog(message) {
      const overlay = document.getElementById('lapSoValidationOverlay');
      const body = document.getElementById('lapSoValidationBody');
      if (!overlay || !body) return;
      body.textContent = message || 'Ngày không hợp lệ.';
      overlay.classList.add('open');
    }

    function closeLapSoValidationDialog(e) {
      const overlay = document.getElementById('lapSoValidationOverlay');
      if (!overlay) return;
      if (e && e.target !== overlay) return;
      overlay.classList.remove('open');
    }

    window.validateLapSoDateInputs = validateLapSoDateInputs;
    window.showLapSoValidationDialog = showLapSoValidationDialog;
    window.closeLapSoValidationDialog = closeLapSoValidationDialog;
