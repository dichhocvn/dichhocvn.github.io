// ── Layout responsive: mobile / desktop ──────────────────
    // mobile  = chỉ hiện lá số (col-laso), ẩn thanh bên trái (col-chat)
    // desktop = hiện cả hai: col-chat (trái) + col-laso (phải)
    const MOBILE_BP = 768; // breakpoint px — dưới ngưỡng này là mobile

    function applyResponsiveLayout() {
      const vw = document.documentElement.clientWidth;
      const isDesktop = vw > MOBILE_BP;
      const layoutMode = isDesktop ? 'desktop' : 'mobile';

      // Gắn data-layout="mobile"|"desktop" lên <body> để CSS/JS có thể query
      document.body.dataset.layout = layoutMode;

      const colChat = document.getElementById('colChat');
      const sep = document.getElementById('separator');
      const formArea = document.getElementById('formArea');      // slot trong col-chat (desktop)
      const formLaso = document.getElementById('formAreaLaso');   // slot trong col-laso (mobile)

      if (isDesktop) {
        // Chế độ desktop: hiện col-chat + separator, move form vào col-chat
        colChat.classList.add('visible');
        sep.classList.add('visible');
        if (formLaso && formLaso.children.length > 0) {
          while (formLaso.firstChild) {
            formArea.appendChild(formLaso.firstChild);
          }
        }
      } else {
        // Chế độ mobile: ẩn col-chat + separator, move form về col-laso
        colChat.classList.remove('visible');
        sep.classList.remove('visible');
        if (formArea && formArea.children.length > 0) {
          while (formArea.firstChild) {
            // Giữ nguyên thứ tự node (tab-bar phải nằm trên cùng)
            formLaso.appendChild(formArea.firstChild);
          }
        }
      }
      requestAnimationFrame(scaleGrid);
    }
    window.addEventListener('resize', applyResponsiveLayout);
