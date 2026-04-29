// ── Tab switching ─────────────────────────────────────────
    let _currentTab = 'AL';
    window._currentTab = _currentTab;

    function switchTab(tab) {
      _currentTab = tab;
      window._currentTab = tab;
      // Form nhập liệu - ẩn khi tab phụ
      const formWrap = document.getElementById('formWrap');
      if (formWrap) formWrap.style.display = (tab === 'CFG' || tab === 'SEARCH') ? 'none' : '';
      // Fields
      document.querySelectorAll('.al-field').forEach(el => el.style.display = tab === 'AL' ? '' : 'none');
      document.querySelectorAll('.dl-field').forEach(el => el.style.display = tab === 'DL' ? '' : 'none');
      document.getElementById('cfgPanel').style.display = tab === 'CFG' ? 'block' : 'none';
      const searchPanel = document.getElementById('searchPanel');
      if (searchPanel) searchPanel.style.display = tab === 'SEARCH' ? 'block' : 'none';
      // Tab active class
      ['AL', 'DL', 'SEARCH', 'CFG'].forEach(t => {
        const btn = document.getElementById('tab' + t);
        if (btn) btn.classList.toggle('tab-active', t === tab);
      });
      if (tab === 'DL') convertDL();
      if (tab === 'SEARCH' && typeof initSearchTab === 'function') initSearchTab();
      if (typeof syncSearchResultPlacement === 'function') syncSearchResultPlacement();
    }
