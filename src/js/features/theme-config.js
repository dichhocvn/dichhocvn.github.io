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
    };

    function applyTemplate(name) {
      const cfg = TEMPLATES[name] || DEFAULT_CONFIG;
      setCssVar('--mono-mode', '0');
      Object.entries(cfg).forEach(([k, v]) => setCssVar(k, v));
      syncConfigUI(cfg);
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
      document.querySelectorAll('#cfgPanel select:not([data-var])').forEach(el => el.selectedIndex = 0);
      if (_lastJson) {
        const gridEl = document.getElementById('grid');
        TUVI_RENDER.render(_lastJson, gridEl);
        requestAnimationFrame(() => { scaleGrid(); TUVI_RENDER.reRenderPills(); });
      }
    }

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

    // Gắn auto-convert khi nhập dương lịch
    ['ngayDL', 'thangDL', 'namDL'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        convertDL();
        scheduleCompute();
      });
    });
