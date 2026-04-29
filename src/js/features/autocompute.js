// ── Auto-compute khi thay đổi input (debounce 500ms) ─────
    let _debounceTimer = null;
    function scheduleCompute() {
      clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(lapLaSo, 500);
    }
    ['hoTen', 'ngay', 'thang', 'nam', 'gio', 'gt'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', scheduleCompute);
      if (el) el.addEventListener('change', scheduleCompute);
    });
