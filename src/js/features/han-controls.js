// ── Năm xem hạn ──────────────────────────────────────────
    function changeNamXem(delta) {
      const chk = document.getElementById('chkXemHan');
      if (chk && !chk.checked) return;
      const el = document.getElementById('namXem');
      if (!el) return;
      let cur = parseInt(el.dataset.val) || 0;
      // Lần đầu (cur===0): bắt đầu từ năm hiện tại bất kể hướng
      const newVal = cur === 0 ? new Date().getFullYear() : cur + delta;
      el.dataset.val = newVal;
      el.textContent = newVal;
      // Tự động bật xem hạn khi có năm
      if (chk && newVal > 0) chk.checked = true;
      onNamXemChange();
    }

    (function bindNamArrowButtons() {
      const prev = document.getElementById('btnNamXemPrev');
      const next = document.getElementById('btnNamXemNext');
      if (prev) prev.addEventListener('click', () => changeNamXem(-1));
      if (next) next.addEventListener('click', () => changeNamXem(1));
    })();
