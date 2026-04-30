// ── CSS Variable helpers ──────────────────────────────────
    function setCssVar(name, value) {
      document.documentElement.style.setProperty(name, value);
    }

    const DEFAULT_CONFIG = {
      '--font-family': 'Arial, sans-serif',
      '--fs-chinh': '13px',
      '--fs-sao': '11px',
      '--fs-header': '11px',
      '--fs-footer': '11px',
      '--color-chinh': '#8b0000',
      '--color-cat': '#1a5c00',
      '--color-hung': '#7a2000',
      '--color-chi': '#4a2e08',
      '--color-ten-cung': '#4a2e08',
      '--color-dai-van': '#000000',
      '--color-truong-sinh': '#000000',
      '--color-bg-cung': '#ffffff',
      '--color-bg-page': '#ffffff',
      '--color-border': '#4a2e08',
      '--mono-mode': '0',
    };

    const LASO_BG_STORAGE_KEY = 'tuviLasoBgChoice';
    /** Value trong `<select>` cho SVG Âm Dương (không phải tên file) */
    const LASO_BG_YINYANG = '__yinyang__';
    /** Đường dẫn tương đối từ `index.html`; ảnh đặt trong `resources/background-laso/` */
    const LASO_BG_DIR = 'resources/background-laso';
    /**
     * Danh sách tên file đầy đủ trên đĩa. Label trong CFG = tên không đuôi extension.
     */
    const LASO_BG_FILES = [
      'nen1.jpg',
      'nen2.jpg',
      'nen3.jpg',
      'nen4.jpg',
      'nen5.jpg',
    ];

    function lasoBgSafeBasename(name) {
      const b = String(name ?? '').trim();
      if (!b || b.includes('/') || b.includes('\\') || b.includes('..')) return '';
      return b;
    }

    /** Hiển thị trong dropdown: bỏ đuôi `.jpg` / `.png` … */
    function lasoBgDisplayLabel(filename) {
      const s = String(filename ?? '').trim();
      const noExt = s.replace(/\.[^/.]+$/, '');
      return noExt || s;
    }

    function resolveLasoBgRelPath(key) {
      const base = lasoBgSafeBasename(key);
      if (!base || !LASO_BG_FILES.includes(base)) return '';
      return `${LASO_BG_DIR}/${base}`;
    }

    /**
     * URL tuyệt đối theo trang hiện tại. Biến CSS `--laso-center-bg` được dùng trong `grid.css`;
     * nếu để path tương đối, trình duyệt resolve `url()` theo file CSS → sai (`src/css/resources/...`).
     */
    function lasoBgAbsoluteUrlForCss(relPath) {
      try {
        const u = new URL(relPath, window.location.href);
        u.searchParams.set('v', String(Date.now()));
        return u.href;
      } catch (_) {
        return `${relPath}?v=${Date.now()}`;
      }
    }

    function populateLasoBgSelect() {
      const sel = document.getElementById('lasoBgSelect');
      if (!sel) return;
      const prev = sel.value;
      sel.innerHTML = '';
      const opt0 = document.createElement('option');
      opt0.value = '';
      opt0.textContent = 'Không nền';
      sel.appendChild(opt0);
      const optYin = document.createElement('option');
      optYin.value = LASO_BG_YINYANG;
      optYin.textContent = 'Âm Dương vector';
      sel.appendChild(optYin);
      LASO_BG_FILES.forEach((file) => {
        const o = document.createElement('option');
        o.value = file;
        o.textContent = lasoBgDisplayLabel(file);
        sel.appendChild(o);
      });
      if (prev && [...sel.options].some((op) => op.value === prev)) sel.value = prev;
    }

    function applyLasoBackgroundChoice(key) {
      const wrap = document.getElementById('lasoWrap');
      if (!wrap) return;
      const k = String(key ?? '').trim();
      wrap.classList.remove('laso-center-wallpaper-on', 'laso-center-decor-yinyang');
      wrap.style.removeProperty('--laso-center-bg');
      if (!k) return;
      if (k === LASO_BG_YINYANG) {
        wrap.classList.add('laso-center-decor-yinyang');
        return;
      }
      const rel = resolveLasoBgRelPath(k);
      if (!rel) return;
      wrap.classList.add('laso-center-wallpaper-on');
      const abs = lasoBgAbsoluteUrlForCss(rel);
      wrap.style.setProperty('--laso-center-bg', `url(${JSON.stringify(abs)})`);
    }

    function onLasoBgSelectChange(val) {
      try {
        localStorage.setItem(LASO_BG_STORAGE_KEY, val === undefined || val === null ? '' : String(val));
      } catch (_) {}
      applyLasoBackgroundChoice(val);
    }

    const TEMPLATES = {
      classic: DEFAULT_CONFIG,
      mono: {
        ...DEFAULT_CONFIG,
        '--color-chinh': '#000000',
        '--color-cat': '#000000',
        '--color-hung': '#000000',
        '--color-chi': '#000000',
        '--color-ten-cung': '#000000',
        '--color-dai-van': '#000000',
        '--color-truong-sinh': '#000000',
        '--color-border': '#000000',
        '--mono-mode': '1',
      },
      dark: {
        ...DEFAULT_CONFIG,
        '--color-bg-cung': '#1a1a1a',
        '--color-bg-page': '#111111',
        '--color-chinh': '#ff6b6b',
        '--color-cat': '#69db7c',
        '--color-hung': '#ff8787',
        '--color-chi': '#ffd43b',
        '--color-ten-cung': '#ffd43b',
        '--color-dai-van': '#ffffff',
        '--color-truong-sinh': '#adb5bd',
        '--color-border': '#495057',
      },
      pastel: {
        ...DEFAULT_CONFIG,
        '--color-bg-cung': '#fdf6ec',
        '--color-bg-page': '#f5ede0',
        '--color-chinh': '#c0392b',
        '--color-cat': '#27ae60',
        '--color-hung': '#e67e22',
        '--color-border': '#a0845c',
      },
      // Dùng ảnh API từ lyso.vn nên khóa chỉnh màu thủ công
      lyso: DEFAULT_CONFIG,
    };

    function setLysoTemplateLock(isLocked) {
      const panel = document.getElementById('cfgPanel');
      if (!panel) return;
      panel.classList.toggle('is-lyso-locked', !!isLocked);
      panel.querySelectorAll('input, select, button').forEach(el => {
        if (el.dataset.lysoKeep) return;
        el.disabled = !!isLocked;
      });
    }

    function isLysoTemplateActive() {
      const templateSelect = document.getElementById('templateSelect');
      return templateSelect?.value === 'lyso';
    }

    function toggleLysoApiMode(useApiImage) {
      const gridWrap = document.getElementById('gridScalerOuter');
      const apiWrap = document.getElementById('lysoApiWrap');
      const legend = document.querySelector('.legend');
      const promptBtn = document.querySelector('.btn-prompt');
      const luuBar = document.getElementById('luuModeBar');
      if (gridWrap) gridWrap.style.display = useApiImage ? 'none' : '';
      if (apiWrap) apiWrap.style.display = useApiImage ? 'block' : 'none';
      if (legend) legend.style.display = useApiImage ? 'none' : '';
      if (promptBtn) promptBtn.style.display = useApiImage ? 'none' : '';
      // Ảnh lyso không phản ánh chế độ an sao lưu — ẩn thanh chọn khi dùng API
      if (luuBar) {
        if (useApiImage) luuBar.style.display = 'none';
        else {
          const xemHan = document.getElementById('chkXemHan')?.checked ?? true;
          luuBar.style.display = xemHan ? 'flex' : 'none';
        }
      }
    }

    function renderLysoApiImage(imageUrl) {
      const imgEl = document.getElementById('lysoApiImage');
      const wrap = document.getElementById('lasoWrap');
      if (!imgEl || !wrap) return false;
      const url = String(imageUrl || '').trim();
      if (!url) return false;
      toggleLysoApiMode(true);
      imgEl.src = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      wrap.style.display = 'block';
      return true;
    }

    function parseTimeText(value) {
      const raw = String(value || '').trim();
      const m = raw.match(/^(\d{1,2})(?::(\d{1,2}))?$/);
      if (!m) return null;
      const hh = Number.parseInt(m[1], 10);
      const mm = Number.parseInt(m[2] || '0', 10);
      if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
      return { hh, mm };
    }

    function getNamXemHanForLyso() {
      const namXemEl = document.getElementById('namXem');
      const raw = namXemEl?.dataset?.val || namXemEl?.textContent || '0';
      const val = Number.parseInt(String(raw).trim(), 10);
      return Number.isFinite(val) ? val : 0;
    }

    function buildLysoApiImageUrlFromForm() {
      const gtValue = (document.getElementById('gt')?.value || 'nam').toLowerCase();
      const gtToken = gtValue === 'nu' ? '0' : '1';
      const gioObj = parseTimeText(document.getElementById('gio')?.value || '');
      const dd = Number.parseInt(document.getElementById('ngayDL')?.value || '', 10);
      const mm = Number.parseInt(document.getElementById('thangDL')?.value || '', 10);
      const yy = Number.parseInt(document.getElementById('namDL')?.value || '', 10);
      if (!gioObj || Number.isNaN(dd) || Number.isNaN(mm) || Number.isNaN(yy)) {
        throw new Error('Thiếu dữ liệu giờ sinh hoặc ngày dương lịch để gọi API lyso');
      }
      const payload = `${String(gioObj.hh).padStart(2, '0')}${String(gioObj.mm).padStart(2, '0')}${String(dd).padStart(2, '0')}${String(mm).padStart(2, '0')}${String(yy).padStart(4, '0')}`;
      const hoTen = (document.getElementById('hoTen')?.value || 'la-so').trim() || 'la-so';
      const namXH = getNamXemHanForLyso();
      return `https://lyso.vn/lasotuvi/${gtToken}/${payload}/${namXH}/${encodeURIComponent(hoTen)}.jpg`;
    }

    function renderLysoFromCurrentInputs() {
      const autoUrl = buildLysoApiImageUrlFromForm();
      return renderLysoApiImage(autoUrl);
    }

    function buildLysoApiImageUrlFromSearchResult(row) {
      if (!row || !row.solar) throw new Error('Thiếu dữ liệu lá số từ kết quả tìm kiếm');
      const gtToken = (row.gender || 'nam') === 'nu' ? '0' : '1';
      const gioObj = parseTimeText(String(row.gio || '').trim());
      if (!gioObj) throw new Error('Giờ sinh trong kết quả tìm kiếm không hợp lệ');
      const payload = `${String(gioObj.hh).padStart(2, '0')}${String(gioObj.mm).padStart(2, '0')}${String(row.solar.dd).padStart(2, '0')}${String(row.solar.mm).padStart(2, '0')}${String(row.solar.yy).padStart(4, '0')}`;
      const hoTen = 'search-result';
      const namXH = getNamXemHanForLyso();
      return `https://lyso.vn/lasotuvi/${gtToken}/${payload}/${namXH}/${encodeURIComponent(hoTen)}.jpg`;
    }

    function renderLysoFromSearchResult(row) {
      return renderLysoApiImage(buildLysoApiImageUrlFromSearchResult(row));
    }

    function applyTemplate(name) {
      const cfg = TEMPLATES[name] || DEFAULT_CONFIG;
      setLysoTemplateLock(name === 'lyso');
      setCssVar('--mono-mode', '0');
      Object.entries(cfg).forEach(([k, v]) => setCssVar(k, v));
      syncConfigUI(cfg);
      if (name === 'lyso') {
        try {
          renderLysoFromCurrentInputs();
        } catch (_) {
          toggleLysoApiMode(true);
        }
        return;
      }
      toggleLysoApiMode(false);
      applyLasoBackgroundChoice(document.getElementById('lasoBgSelect')?.value ?? '');
      // Re-render để áp màu mới vì màu ngũ hành là inline style trong DOM
      if (_lastJson) {
        const gridEl = document.getElementById('grid');
        TUVI_RENDER.render(_lastJson, gridEl);
        requestAnimationFrame(() => { scaleGrid(); TUVI_RENDER.reRenderPills(); });
      }
    }

    // Đồng bộ UI cấu hình với giá trị cfg
    function syncConfigUI(cfg) {
      const panel = document.getElementById('cfgPanel');
      if (!panel) return;

      // Map CSS var → selector tìm input tương ứng
      // Color inputs: tìm theo defaultValue hoặc data-var
      panel.querySelectorAll('input[type=color]').forEach(el => {
        const varName = el.dataset.var;
        if (varName && cfg[varName]) {
          el.value = cfg[varName];
          if (el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT')
            el.nextElementSibling.value = cfg[varName];
        }
      });

      // Range inputs
      panel.querySelectorAll('input[type=range]').forEach(el => {
        const varName = el.dataset.var;
        if (varName && cfg[varName]) {
          const val = parseInt(cfg[varName]);
          el.value = val;
          if (el.nextElementSibling) el.nextElementSibling.textContent = val + 'px';
        }
      });

      // Select font-family
      panel.querySelectorAll('select[data-var]').forEach(el => {
        const varName = el.dataset.var;
        if (varName && cfg[varName]) {
          [...el.options].forEach((opt, i) => {
            if (opt.value === cfg[varName]) el.selectedIndex = i;
          });
        }
      });
    }

    function resetConfig() {
      Object.entries(DEFAULT_CONFIG).forEach(([k, v]) => setCssVar(k, v));
      syncConfigUI(DEFAULT_CONFIG);
      const templateSelect = document.getElementById('templateSelect');
      if (templateSelect) templateSelect.value = 'classic';
      setLysoTemplateLock(false);
      toggleLysoApiMode(false);
      document.querySelectorAll('#cfgPanel select:not([data-var])').forEach(el => el.selectedIndex = 0);
      try { localStorage.removeItem(LASO_BG_STORAGE_KEY); } catch (_) {}
      applyLasoBackgroundChoice('');
      if (_lastJson) {
        const gridEl = document.getElementById('grid');
        TUVI_RENDER.render(_lastJson, gridEl);
        requestAnimationFrame(() => { scaleGrid(); TUVI_RENDER.reRenderPills(); });
      }
    }

    window.applyLasoBackgroundChoice = applyLasoBackgroundChoice;
    window.onLasoBgSelectChange = onLasoBgSelectChange;

    window.isLysoTemplateActive = isLysoTemplateActive;
    window.renderLysoFromCurrentInputs = renderLysoFromCurrentInputs;
    window.renderLysoFromSearchResult = renderLysoFromSearchResult;
    window.toggleLysoApiMode = toggleLysoApiMode;
    window.refreshLysoImageForNamXem = function refreshLysoImageForNamXem() {
      if (!isLysoTemplateActive()) return;
      try { renderLysoFromCurrentInputs(); } catch (_) {}
    };

    function convertDL() {
      const dd = parseInt(document.getElementById('ngayDL').value);
      const mm = parseInt(document.getElementById('thangDL').value);
      const yy = parseInt(document.getElementById('namDL').value);
      const res = document.getElementById('dlResult');
      if (!dd || !mm || !yy) { res.textContent = ''; return; }
      try {
        const lunar = solar2Lunar(dd, mm, yy);
        res.innerHTML = `→ Âm lịch: <b>${lunar.ngay}/${lunar.thang}${lunar.nhuan ? ' (nhuận)' : ''}/${lunar.nam}</b>`;
        // Điền vào ô âm lịch ẩn để lapLaSo dùng
        document.getElementById('ngay').value = lunar.ngay;
        document.getElementById('thang').value = lunar.thang;
        document.getElementById('nam').value = lunar.nam;
      } catch (e) {
        res.textContent = '⚠ Ngày không hợp lệ';
      }
    }

    (function initLasoBgFromStorage() {
      populateLasoBgSelect();
      const sel = document.getElementById('lasoBgSelect');
      if (!sel) return;
      try {
        const saved = localStorage.getItem(LASO_BG_STORAGE_KEY);
        if (saved !== null && [...sel.options].some(o => o.value === saved)) sel.value = saved;
        else if (saved) try { localStorage.removeItem(LASO_BG_STORAGE_KEY); } catch (_) {}
      } catch (_) {}
      applyLasoBackgroundChoice(sel.value);
    })();

    // Gắn auto-convert khi nhập dương lịch
    ['ngayDL', 'thangDL', 'namDL'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        convertDL();
        scheduleCompute();
      });
    });
