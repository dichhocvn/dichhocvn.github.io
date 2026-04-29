// ── Tìm kiếm lá số theo điều kiện sao ───────────────────────
(function () {
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const GIO_QUET = ['23:00', '01:00', '03:00', '05:00', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];
  const SEARCH_MAX_DAYS = 3660;
  let _searchInitDone = false;
  let _searchCancelled = false;
  let _searchRunning = false;
  let _currentResultIdx = -1;

  function dmy(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${m}/${y}`;
  }

  function parseDateInput(id) {
    const v = (document.getElementById(id)?.value || '').trim();
    if (!v) return null;
    let d = 0; let m = 0; let y = 0;
    if (v.includes('/')) {
      const p = v.split('/').map(Number);
      if (p.length === 3) { d = p[0]; m = p[1]; y = p[2]; }
    } else if (v.includes('-')) {
      const p = v.split('-').map(Number);
      if (p.length === 3) { y = p[0]; m = p[1]; d = p[2]; }
    }
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
    return dt;
  }

  function plusDay(d) {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() + 1);
    return x;
  }
  function ddmmyyyy(obj) {
    const d = String(obj.dd).padStart(2, '0');
    const m = String(obj.mm).padStart(2, '0');
    const y = String(obj.yy);
    return `${d}/${m}/${y}`;
  }

  function mainStarOptions() {
    // Chỉ lấy tổ hợp chính tinh ở Mệnh thực sự tồn tại theo bảng an sao.
    const mains = Object.entries(TUVI_DATA.SAO_META)
      .filter(([_, meta]) => meta.type === 'chinh')
      .map(([name]) => name);
    const combos = new Map();
    const addCombo = (arr) => {
      const display = arr.join('|');
      const key = [...arr].sort((a, b) => a.localeCompare(b, 'vi')).join('|');
      if (key && !combos.has(key)) combos.set(key, display);
    };
    for (let canNam = 0; canNam < 10; canNam++) {
      for (let thang = 1; thang <= 12; thang++) {
        for (let ngay = 1; ngay <= 30; ngay++) {
          for (let chiGio = 0; chiGio < 12; chiGio++) {
            const chiMenh = TUVI_DATA.BANG_MENH[chiGio][thang - 1];
            const canCungMenh = TUVI_DATA.BANG_THIENCAN_CUNGMENH[canNam][chiMenh];
            const soCuc = TUVI_DATA.BANG_CUC_MENH[canCungMenh][chiMenh];
            const chiTV = TUVI_DATA.BANG_TU_VI[soCuc][ngay - 1];
            const chiTF = TUVI_DATA.THIEN_PHU[chiTV];
            const chinh = {
              'Tử Vi': chiTV,
              'Thiên Cơ': TUVI_DATA.VONG_TU_VI['Thiên Cơ'][chiTV],
              'Thái Dương': TUVI_DATA.VONG_TU_VI['Thái Dương'][chiTV],
              'Vũ Khúc': TUVI_DATA.VONG_TU_VI['Vũ Khúc'][chiTV],
              'Thiên Đồng': TUVI_DATA.VONG_TU_VI['Thiên Đồng'][chiTV],
              'Liêm Trinh': TUVI_DATA.VONG_TU_VI['Liêm Trinh'][chiTV],
              'Thiên Phủ': chiTF,
              'Thái Âm': TUVI_DATA.VONG_THIEN_PHU['Thái Âm'][chiTF],
              'Tham Lang': TUVI_DATA.VONG_THIEN_PHU['Tham Lang'][chiTF],
              'Cự Môn': TUVI_DATA.VONG_THIEN_PHU['Cự Môn'][chiTF],
              'Thiên Tướng': TUVI_DATA.VONG_THIEN_PHU['Thiên Tướng'][chiTF],
              'Thiên Lương': TUVI_DATA.VONG_THIEN_PHU['Thiên Lương'][chiTF],
              'Thất Sát': TUVI_DATA.VONG_THIEN_PHU['Thất Sát'][chiTF],
              'Phá Quân': TUVI_DATA.VONG_THIEN_PHU['Phá Quân'][chiTF],
            };
            const atMenh = Object.keys(chinh).filter(k => chinh[k] === chiMenh);
            addCombo(atMenh);
          }
        }
      }
    }
    const out = [{ value: '', label: '— Chọn tổ hợp chính tinh —' }];
    [...combos.values()]
      .sort((a, b) => a.localeCompare(b, 'vi'))
      .forEach(v => out.push({ value: v, label: v.replace(/\|/g, ' - ') }));
    return out;
  }

  function setStatus(text) {
    const el = document.getElementById('searchStatus');
    if (el) el.textContent = text;
  }
  function problemMessage(problemId, dayCount) {
    switch (problemId) {
      case 'missing-from': return 'Vui lòng nhập Từ ngày DL.';
      case 'missing-to': return 'Vui lòng nhập Đến ngày DL.';
      case 'invalid-from': return 'Từ ngày DL không hợp lệ. Dùng dd/mm/yyyy hoặc yyyy-mm-dd.';
      case 'invalid-to': return 'Đến ngày DL không hợp lệ. Dùng dd/mm/yyyy hoặc yyyy-mm-dd.';
      case 'reversed-range': return 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.';
      case 'missing-main-stars': return 'Hãy chọn ít nhất 1 tổ hợp chính tinh cung Mệnh.';
      case 'invalid-gender': return 'Giới tính không hợp lệ. Vui lòng chọn Nam hoặc Nữ.';
      case 'range-too-large': return `Khoảng ngày quá lớn (${dayCount} ngày). Vui lòng thu hẹp <= ${SEARCH_MAX_DAYS} ngày.`;
      default: return 'Điều kiện tìm kiếm không hợp lệ.';
    }
  }
  function renderValidationStatus(validation) {
    if (!validation.problems.length) return false;
    const messages = validation.problems.map(id => problemMessage(id, validation.dayCount));
    setStatus(`⚠ Không thể tìm kiếm do ${messages.length} lỗi: ${messages.join(' | ')}`);
    return true;
  }
  function validateSearchConfig(cfg) {
    const problems = [];
    if (!cfg.rawFrom) problems.push('missing-from');
    else if (!cfg.from) problems.push('invalid-from');
    if (!cfg.rawTo) problems.push('missing-to');
    else if (!cfg.to) problems.push('invalid-to');
    if (cfg.from && cfg.to && cfg.from > cfg.to) problems.push('reversed-range');
    if (!cfg.chinhValues.length) problems.push('missing-main-stars');
    if (!['nam', 'nu'].includes(cfg.gt)) problems.push('invalid-gender');
    let dayCount = 0;
    if (cfg.from && cfg.to && cfg.from <= cfg.to) {
      dayCount = Math.floor((cfg.to - cfg.from) / (24 * 3600 * 1000)) + 1;
      if (dayCount > SEARCH_MAX_DAYS) problems.push('range-too-large');
    }
    return { problems, dayCount };
  }
  function menhInfo(laso) {
    const menh = laso.cung.find(c => c.cungChuc === 'Mệnh');
    if (!menh) return null;
    const menhChi = CHI.indexOf(menh.diaChi);
    const doiChi = (menhChi + 6) % 12;
    const tam = [[8, 0, 4], [5, 9, 1], [2, 6, 10], [11, 3, 7]].find(g => g.includes(menhChi)) || [];
    const related = new Set([menhChi, doiChi, ...tam]);
    const cungRelated = laso.cung.filter(c => related.has(CHI.indexOf(c.diaChi)));
    return { menh, menhChi, related, cungRelated };
  }

  function countByType(cungs, type, excludeNames = new Set()) {
    let n = 0;
    cungs.forEach(c => c.sao.forEach(s => {
      if (s.type === type && !excludeNames.has(s.name)) n++;
    }));
    return n;
  }

  function hasTuanTrietAtMenh(laso, menhChi) {
    const triet = laso.meta.viTriTriet || [];
    const tuan = laso.meta.viTriTuan || [];
    return [...triet, ...tuan].includes(menhChi);
  }
  function updateResultNavPosition() {
    const pos = document.getElementById('searchResultPos');
    const total = window._searchResults.length;
    const current = _currentResultIdx >= 0 ? _currentResultIdx + 1 : 0;
    if (pos) pos.textContent = `${current}/${total}`;
  }
  function clearSearchResultsState() {
    window._searchResults = [];
    _currentResultIdx = -1;
    const list = document.getElementById('searchResultList');
    const nav = document.getElementById('searchResultNav');
    if (list) list.innerHTML = '';
    if (nav) nav.style.display = 'none';
    setStatus('');
    updateResultNavPosition();
    closeSearchResultDialogDirect();
  }

  function exactMainMatch(menh, selectedExpr) {
    const selected = selectedExpr.split('|').filter(Boolean).sort();
    const actual = menh.sao.filter(s => s.type === 'chinh').map(s => s.name).sort();
    if (!selected.length) return false;
    if (selected.length !== actual.length) return false;
    return selected.every((s, i) => s === actual[i]);
  }
  function anyMainMatch(menh, selectedExprList) {
    return selectedExprList.some(expr => exactMainMatch(menh, expr));
  }
  function selectedMainValues() {
    return Array.from(document.querySelectorAll('.search-chip[data-value].active'))
      .map(el => el.dataset.value || '')
      .filter(Boolean);
  }
  function toggleMainChip(value) {
    const esc = (window.CSS && typeof window.CSS.escape === 'function') ? window.CSS.escape(value) : value.replace(/"/g, '\\"');
    const chip = document.querySelector(`.search-chip[data-value="${esc}"]`);
    if (!chip) return;
    chip.classList.toggle('active');
  }
  function syncSearchResultPlacement() {
    const section = document.getElementById('searchResultSection');
    const panel = document.getElementById('searchPanel');
    const dock = document.getElementById('searchResultMobileDock');
    const overlayBody = document.getElementById('searchResultOverlayBody');
    const isMobile = document.body?.dataset.layout === 'mobile';
    const isSearchTab = document.getElementById('tabSEARCH')?.classList.contains('tab-active');
    if (!section || !panel || !dock || !overlayBody) return;
    if (isMobile && isSearchTab) {
      if (section.parentElement !== overlayBody) overlayBody.appendChild(section);
      dock.style.display = 'none';
      panel.style.paddingBottom = '4px';
    } else {
      if (section.parentElement !== panel) panel.appendChild(section);
      dock.style.display = 'none';
      panel.style.paddingBottom = '14px';
    }
  }

  function renderResults(results) {
    const list = document.getElementById('searchResultList');
    const nav = document.getElementById('searchResultNav');
    if (!list) return;
    if (!results.length) {
      if (nav) nav.style.display = 'none';
      _currentResultIdx = -1;
      updateResultNavPosition();
      list.innerHTML = `<div style="padding:10px;border:1px dashed #c8b88a;border-radius:6px;color:#7a5c2a;">Không có lá số nào thỏa điều kiện.</div>`;
      return;
    }
    list.innerHTML = results.map((r, idx) => `
      <div onclick="openSearchResult(${idx})" style="border:1px solid ${idx === _currentResultIdx ? '#8b5e1a' : '#d8c9a8'};border-radius:8px;padding:10px;background:${idx === _currentResultIdx ? '#fff3da' : '#fff'};cursor:pointer;">
        <div style="font-weight:bold;color:#4a2e08;">#${idx + 1} • ${ddmmyyyy(r.solar)} DL • ${r.gender === 'nam' ? 'Nam' : 'Nữ'}</div>
        <div style="font-size:12px;color:#5c3d10;margin-top:4px;">ÂL: ${String(r.lunar.ngay).padStart(2, '0')}/${String(r.lunar.thang).padStart(2, '0')}/${r.lunar.nam} • Mệnh: ${r.menhMain}</div>
      </div>
    `).join('');
    if (nav) nav.style.display = results.length > 0 ? 'flex' : 'none';
    updateResultNavPosition();
    syncSearchResultPlacement();
  }

  function currentSearchConfig() {
    return {
      rawFrom: (document.getElementById('searchFromDate')?.value || '').trim(),
      rawTo: (document.getElementById('searchToDate')?.value || '').trim(),
      from: parseDateInput('searchFromDate'),
      to: parseDateInput('searchToDate'),
      gt: document.getElementById('searchGt')?.value || 'nam',
      chinhValues: selectedMainValues(),
      catMode: document.getElementById('searchCatMode')?.value || 'any',
      tuanTrietMode: document.getElementById('searchTuanTrietMode')?.value || 'any',
      hungMode: document.getElementById('searchHungMode')?.value || 'any',
    };
  }

  window._searchResults = [];
  function showProgress(open) {
    const ov = document.getElementById('searchProgressOverlay');
    if (!ov) return;
    ov.classList.toggle('open', !!open);
  }
  function updateProgress(done, total, matched) {
    const pct = total > 0 ? Math.floor((done * 100) / total) : 0;
    const bar = document.getElementById('searchProgressBar');
    const txt = document.getElementById('searchProgressText');
    const meta = document.getElementById('searchProgressMeta');
    if (bar) bar.style.width = `${pct}%`;
    if (txt) txt.textContent = _searchCancelled ? 'Đang ngắt tìm kiếm...' : 'Đang quét lá số...';
    if (meta) meta.textContent = `${done} / ${total} • Thỏa: ${matched}`;
  }

  window.cancelSearchLaSo = function cancelSearchLaSo() {
    if (!_searchRunning) return;
    _searchCancelled = true;
  };

  window.searchLaSo = async function searchLaSo() {
    if (_searchRunning) return;
    const cfg = currentSearchConfig();
    const validation = validateSearchConfig(cfg);
    if (renderValidationStatus(validation)) return;
    const dayCount = validation.dayCount;

    _searchRunning = true;
    _searchCancelled = false;
    const hits = [];
    const total = dayCount * GIO_QUET.length;
    if (total <= 0) {
      setStatus('⚠ Không có dữ liệu để quét trong khoảng ngày đã chọn.');
      return;
    }
    let checked = 0;
    showProgress(true);
    updateProgress(0, total, 0);
    try {
      outer:
      for (let d = new Date(cfg.from); d <= cfg.to; d = plusDay(d)) {
        const dd = d.getDate();
        const mm = d.getMonth() + 1;
        const yy = d.getFullYear();
        const lunar = solar2Lunar(dd, mm, yy);
        for (const gio of GIO_QUET) {
          checked++;
          if (_searchCancelled) break outer;
          let laso;
          try {
            laso = TUVI_LOGIC.compute({
              hoTen: `Search ${dd}/${mm}/${yy} ${gio}`,
              ngay: lunar.ngay,
              thang: lunar.thang,
              nam: lunar.nam,
              gioSinh: gio,
              gioiTinh: cfg.gt,
            });
          } catch (_) {
            updateProgress(checked, total, hits.length);
            continue;
          }
          const info = menhInfo(laso);
          if (!info || !anyMainMatch(info.menh, cfg.chinhValues)) {
            updateProgress(checked, total, hits.length);
            continue;
          }

          const catCount = countByType(info.cungRelated, 'cat');
          const hungCount = countByType(info.cungRelated, 'hung', new Set(['Triệt']));
          const hasTT = hasTuanTrietAtMenh(laso, info.menhChi);

          if (cfg.catMode === 'min2' && catCount < 2) {
            updateProgress(checked, total, hits.length);
            continue;
          }
          if (cfg.hungMode === 'max2' && hungCount > 2) {
            updateProgress(checked, total, hits.length);
            continue;
          }
          if (cfg.tuanTrietMode === 'none' && hasTT) {
            updateProgress(checked, total, hits.length);
            continue;
          }

          const mainNames = info.menh.sao.filter(s => s.type === 'chinh').map(s => s.name).join(' - ') || 'Vô chính diệu';
          hits.push({
            solar: { dd, mm, yy },
            lunar,
            gender: cfg.gt,
            gio,
            laso,
            menhMain: mainNames,
            catCount,
            hungCount,
          });
          updateProgress(checked, total, hits.length);
          if (checked % 24 === 0) await new Promise(r => setTimeout(r, 0));
        }
      }

      window._searchResults = hits;
      renderResults(hits);
      _currentResultIdx = hits.length ? 0 : -1;
      if (_currentResultIdx >= 0) window.openSearchResult(_currentResultIdx);
      setStatus(_searchCancelled
        ? `Đã ngắt tìm kiếm: quét ${checked}/${total} lá số, có ${hits.length} lá số thỏa.`
        : `Đã quét ${checked}/${total} lá số, tìm thấy ${hits.length} lá số thỏa điều kiện.`);
    } finally {
      showProgress(false);
      _searchRunning = false;
      _searchCancelled = false;
    }
  };

  window.openSearchResult = function openSearchResult(idx) {
    const row = window._searchResults[idx];
    if (!row) return;
    _currentResultIdx = idx;
    document.getElementById('hoTen').value = row.laso.meta.hoTen || '';
    document.getElementById('ngay').value = row.lunar.ngay;
    document.getElementById('thang').value = row.lunar.thang;
    document.getElementById('nam').value = row.lunar.nam;
    document.getElementById('gio').value = row.gio;
    document.getElementById('gt').value = row.gender;
    if (typeof syncGioToGioXem === 'function') syncGioToGioXem();
    if (typeof lapLaSo === 'function') lapLaSo();
    if (document.body?.dataset.layout === 'mobile') closeSearchResultDialogDirect();
    renderResults(window._searchResults);
  };
  window.openPrevSearchResult = function openPrevSearchResult() {
    const n = window._searchResults.length;
    if (!n) return;
    const idx = _currentResultIdx < 0 ? 0 : (_currentResultIdx - 1 + n) % n;
    window.openSearchResult(idx);
  };
  window.openNextSearchResult = function openNextSearchResult() {
    const n = window._searchResults.length;
    if (!n) return;
    const idx = _currentResultIdx < 0 ? 0 : (_currentResultIdx + 1) % n;
    window.openSearchResult(idx);
  };

  window.initSearchTab = function initSearchTab() {
    if (_searchInitDone) return;
    _searchInitDone = true;
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const to = plusDay(plusDay(plusDay(from)));
    document.getElementById('searchFromDate').value = dmy(from);
    document.getElementById('searchToDate').value = dmy(to);
    const gt = document.getElementById('gt')?.value || 'nam';
    document.getElementById('searchGt').value = gt;
    const listWrap = document.getElementById('searchChinhTinhList');
    if (listWrap) {
      const opts = mainStarOptions().filter(o => o.value);
      listWrap.innerHTML = opts.map((o) => `<button type="button" class="search-chip" data-value="${o.value}" onclick="toggleMainChip('${o.value.replace(/'/g, "\\'")}')">${o.label}</button>`).join('');
      const chips = Array.from(listWrap.querySelectorAll('.search-chip[data-value]'));
      chips.forEach(ch => {
        const v = ch.dataset.value || '';
        const stars = v.split('|');
        if (stars.length === 2 && stars.includes('Tử Vi') && stars.includes('Thiên Phủ')) ch.classList.add('active');
        if (stars.length === 2 && stars.includes('Tử Vi') && stars.includes('Thiên Tướng')) ch.classList.add('active');
      });
      if (!chips.some(ch => ch.classList.contains('active')) && chips[0]) chips[0].classList.add('active');
    }
    const catMode = document.getElementById('searchCatMode');
    const tuanTrietMode = document.getElementById('searchTuanTrietMode');
    const hungMode = document.getElementById('searchHungMode');
    if (catMode) catMode.value = 'any';
    if (tuanTrietMode) tuanTrietMode.value = 'any';
    if (hungMode) hungMode.value = 'any';
    syncSearchResultPlacement();
    window.addEventListener('resize', syncSearchResultPlacement);
    ['hoTen', 'ngay', 'thang', 'nam', 'ngayDL', 'thangDL', 'namDL', 'gio', 'gt'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const handler = () => {
        if ((window._currentTab || '') === 'SEARCH') return;
        if (!window._searchResults.length) return;
        clearSearchResultsState();
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
    setStatus('Nhập điều kiện và bấm "Tìm lá số".');
  };
  window.syncSearchResultPlacement = syncSearchResultPlacement;
  window.toggleMainChip = toggleMainChip;
  window.openSearchResultDialog = function openSearchResultDialog() {
    const ov = document.getElementById('searchResultOverlay');
    if (!ov) return;
    syncSearchResultPlacement();
    ov.classList.add('open');
  };
  window.closeSearchResultDialog = function closeSearchResultDialog(e) {
    const ov = document.getElementById('searchResultOverlay');
    if (!ov) return;
    if (e && e.target !== ov) return;
    ov.classList.remove('open');
  };
  window.closeSearchResultDialogDirect = function closeSearchResultDialogDirect() {
    const ov = document.getElementById('searchResultOverlay');
    if (!ov) return;
    ov.classList.remove('open');
  };
  window.clearSearchResultsState = clearSearchResultsState;
})();
