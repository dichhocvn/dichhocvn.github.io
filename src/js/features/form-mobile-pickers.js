// ── Mobile: select dropdown cho ngày/tháng/giờ (đồng bộ với input gốc) ──
(function () {
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function fillRange(sel, from, to, labelFn) {
    if (!sel) return;
    const fn = labelFn || String;
    sel.innerHTML = '';
    for (let i = from; i <= to; i += 1) {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = fn(i);
      sel.appendChild(o);
    }
  }

  function clampSelectToOptions(sel, num) {
    if (!sel || !sel.options.length) return null;
    const vals = [...sel.options].map((o) => parseInt(o.value, 10)).filter((x) => Number.isFinite(x));
    if (!vals.length) return null;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const v = Math.min(max, Math.max(min, num));
    return v;
  }

  function syncSelectFromInput(sel, input) {
    if (!sel || !input) return;
    const raw = parseInt(String(input.value).trim(), 10);
    if (!Number.isFinite(raw)) return;
    const v = clampSelectToOptions(sel, raw);
    if (v === null) return;
    sel.value = String(v);
    if (String(input.value) !== String(v)) input.value = String(v);
  }

  function parseGioParts() {
    const gio = document.getElementById('gio');
    if (!gio) return { h: 0, m: 0 };
    const p = String(gio.value || '').trim().split(':');
    let h = parseInt(p[0], 10);
    let m = p.length > 1 ? parseInt(p[1], 10) : 0;
    if (!Number.isFinite(h)) h = 0;
    if (!Number.isFinite(m)) m = 0;
    h = Math.min(23, Math.max(0, h));
    m = Math.min(59, Math.max(0, m));
    return { h, m };
  }

  function syncGioSelectsFromInput() {
    const { h, m } = parseGioParts();
    const hSel = document.getElementById('gioHourMob');
    const mSel = document.getElementById('gioMinuteMob');
    if (hSel) hSel.value = String(h);
    if (mSel) mSel.value = String(m);
  }

  function applyGioFromSelects() {
    const hSel = document.getElementById('gioHourMob');
    const mSel = document.getElementById('gioMinuteMob');
    const gio = document.getElementById('gio');
    if (!hSel || !mSel || !gio) return;
    const h = parseInt(hSel.value, 10);
    const m = parseInt(mSel.value, 10);
    gio.value = `${pad2(h)}:${pad2(m)}`;
    if (typeof syncGioToGioXem === 'function') syncGioToGioXem();
    if (typeof scheduleCompute === 'function') scheduleCompute();
  }

  function syncMobilePickersFromInputs() {
    syncSelectFromInput(document.getElementById('ngayMob'), document.getElementById('ngay'));
    syncSelectFromInput(document.getElementById('thangMob'), document.getElementById('thang'));
    syncSelectFromInput(document.getElementById('ngayDLMob'), document.getElementById('ngayDL'));
    syncSelectFromInput(document.getElementById('thangDLMob'), document.getElementById('thangDL'));
    syncGioSelectsFromInput();
  }

  window.syncMobilePickersFromInputs = syncMobilePickersFromInputs;

  function wirePair(selectId, inputId) {
    const sel = document.getElementById(selectId);
    const inp = document.getElementById(inputId);
    if (!sel || !inp) return;
    sel.addEventListener('change', () => {
      inp.value = sel.value;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      if (typeof scheduleCompute === 'function') scheduleCompute();
    });
  }

  function init() {
    fillRange(document.getElementById('ngayMob'), 1, 30);
    fillRange(document.getElementById('thangMob'), 1, 12);
    fillRange(document.getElementById('ngayDLMob'), 1, 31);
    fillRange(document.getElementById('thangDLMob'), 1, 12);
    fillRange(document.getElementById('gioHourMob'), 0, 23, (i) => pad2(i));
    fillRange(document.getElementById('gioMinuteMob'), 0, 59, (i) => pad2(i));

    wirePair('ngayMob', 'ngay');
    wirePair('thangMob', 'thang');
    wirePair('ngayDLMob', 'ngayDL');
    wirePair('thangDLMob', 'thangDL');

    document.getElementById('gioHourMob')?.addEventListener('change', applyGioFromSelects);
    document.getElementById('gioMinuteMob')?.addEventListener('change', applyGioFromSelects);

    ['ngay', 'thang', 'ngayDL', 'thangDL', 'gio'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => {
        syncMobilePickersFromInputs();
      });
    });

    let raf = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => syncMobilePickersFromInputs());
    });

    syncMobilePickersFromInputs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
