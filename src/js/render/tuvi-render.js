const TUVI_RENDER = (() => {

      // ── Lookup helpers: infer số từ string ───────────────────
      const CHI_STR  = ['Tý','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
      const CAN_STR  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
      const CUNG_STR = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
      const CUC_SO   = { 'Thủy Nhị Cục':2,'Mộc Tam Cục':3,'Kim Tứ Cục':4,'Thổ Ngũ Cục':5,'Hỏa Lục Cục':6 };

      function chiIdx(str)  { return CHI_STR.indexOf(str); }
      function canIdx(str)  { return CAN_STR.indexOf(str); }
      function cungIdx(str) { return CUNG_STR.indexOf(str); }
      function cucSo(str)   { return CUC_SO[str] ?? 0; }

      const SM_CLASS = { 'M': 'sm-m', 'V': 'sm-v', 'B': 'sm-b', 'H': 'sm-h' };

      // ── Tên hiển thị rút gọn ─────────────────────────────────
      const DISPLAY_NAME = { 'Lưu Niên Văn Tinh': 'LN. Văn Tinh' };
      function dn(name) { return DISPLAY_NAME[name] || name; }

      // ── Màu ngũ hành (render tự tính từ nguHanh trong JSON) ──
      const HANH_COLOR = {
        kim: '#a8a8b0',  // bạc
        moc: '#2d6a2d',  // xanh lá
        thuy: '#111118',  // đen
        hoa: '#c0392b',  // đỏ
        tho: '#c8960a',  // vàng
      };
      function hanhStyle(nguHanh) {
        // Mono mode: bỏ màu ngũ hành
        if (getComputedStyle(document.documentElement).getPropertyValue('--mono-mode').trim() === '1') return '';
        if (!nguHanh) return '';
        const c = HANH_COLOR[nguHanh];
        return c ? `color:${c}` : '';
      }

      // sucManh hiển thị dạng "(M)" inline, màu sẽ do parent div quyết định
      const SM_LABEL = { 'M': '(M)', 'V': '(V)', 'B': '(B)', 'H': '(H)' };
      function smTag(star) {
        return star.sucManh && SM_LABEL[star.sucManh]
          ? `<span class="sm-inline">${SM_LABEL[star.sucManh]}</span>` : '';
      }
      // Tam hợp: Thân-Tý-Thìn, Tị-Dậu-Sửu, Dần-Ngọ-Tuất, Hợi-Mão-Mùi
      const TAM_HOP = [
        [8, 0, 4],   // Thân Tý Thìn
        [5, 9, 1],   // Tị  Dậu Sửu
        [2, 6, 10],  // Dần Ngọ Tuất
        [11, 3, 7],  // Hợi Mão Mùi
      ];
      // Đối cung: cách nhau 6
      function doiCung(chi) { return (chi + 6) % 12; }
      function tamHopGroup(chi) { return TAM_HOP.find(g => g.includes(chi)) || []; }

      // ============================================================
      // Rule engine (click cung/chính tinh để luận rule thỏa)
      // Rule data runtime: src/js/rules/rules-data.js
      // ============================================================

      const STAR_GROUPS = {
        'sat tinh': ['kình dương', 'đà la', 'hỏa tinh', 'linh tinh', 'địa không', 'địa kiếp'],
        'luc sat tinh': ['kình dương', 'đà la', 'hỏa tinh', 'linh tinh', 'địa không', 'địa kiếp'],
        'tu sat': ['kình dương', 'đà la', 'hỏa tinh', 'linh tinh'],
      };

      function vnNorm(s) {
        return (s || '')
          .toLowerCase()
          .replace(/đ/g, 'd')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function getRuleTextForCung(cungName) {
        return (typeof TUVI_RULES_TEXT_BY_CUNG !== 'undefined'
          ? (TUVI_RULES_TEXT_BY_CUNG[vnNorm(cungName)] || '')
          : '');
      }

      function parseRuleBlocks(text) {
        const blocks = text.match(/Rule:\s*[\s\S]*?(?=(?:\n\s*Rule:)|\s*$)/g) || [];
        return blocks.map(block => {
          const ruleMatch = block.match(/Rule:\s*([^\n]+)/);
          const explainMatch = block.match(/Explain:\s*([\s\S]*?)(?=(?:\n\s*Raw:)|\s*$)/);
          const rawMatch = block.match(/Raw:\s*([\s\S]*?)\s*$/);
          return {
            rule: (ruleMatch?.[1] || '').trim(),
            explain: (explainMatch?.[1] || '').trim(),
            raw: (rawMatch?.[1] || '').trim(),
          };
        }).filter(x => x.rule && x.explain);
      }

      function parseCondition(condText) {
        const m = condText.trim().match(/^\((.*)\)$/);
        if (!m) return null;
        const parts = m[1].split(',').map(s => s.trim());
        if (parts.length !== 3) return null;
        return { starExpr: parts[0], posExpr: parts[1], relExpr: parts[2] };
      }

      function splitAndOr(expr) {
        const andTerms = expr.split('&').map(t => t.trim()).filter(Boolean);
        return andTerms.map(t => t.split('|').map(x => x.trim()).filter(Boolean));
      }

      function expandStarToken(token) {
        const k = vnNorm(token);
        if (STAR_GROUPS[k]) return STAR_GROUPS[k].map(vnNorm);
        return [k];
      }

      function buildChartIndex(lasoJson) {
        const chiToStars = {};
        const cungNameToChi = {};
        lasoJson.cung.forEach(c => {
          const ci = chiIdx(c.diaChi);
          cungNameToChi[vnNorm(c.cungChuc)] = ci;
          chiToStars[ci] = (c.sao || []).map(s => vnNorm(s.name));
        });
        return { chiToStars, cungNameToChi };
      }

      function resolvePosToken(posToken, contextChi, chartIndex) {
        const k = vnNorm(posToken);
        if (k === '$this') return [contextChi];
        if (k === 'cung menh') {
          const cungMenh = (_lastJson?.cung || []).find(c => c.isMenh);
          return cungMenh ? [chiIdx(cungMenh.diaChi)] : [];
        }
        if (chartIndex.cungNameToChi[k] !== undefined) return [chartIndex.cungNameToChi[k]];
        const chiPos = CHI_STR.findIndex(x => vnNorm(x) === k);
        if (chiPos >= 0) return [chiPos];
        return [];
      }

      function starsInRelation(posChi, relationName, chartIndex) {
        const rel = vnNorm(relationName);
        let chis = [];
        if (rel === 'toa thu') chis = [posChi];
        else if (rel === 'xung chieu') chis = [doiCung(posChi)];
        else if (rel === 'hoi hop') chis = [posChi, doiCung(posChi), ...tamHopGroup(posChi)];
        else return new Set();
        const set = new Set();
        chis.forEach(chi => (chartIndex.chiToStars[chi] || []).forEach(s => set.add(s)));
        return set;
      }

      function matchStarExpr(starExpr, starSet) {
        const andTerms = splitAndOr(starExpr);
        return andTerms.every(orTerms =>
          orTerms.some(tok => expandStarToken(tok).some(s => starSet.has(s)))
        );
      }

      function relationExprSatisfied(starExpr, relExpr, posChi, chartIndex) {
        const andTerms = splitAndOr(relExpr);
        return andTerms.every(orTerms =>
          orTerms.some(raw => {
            const neg = /^NOT\s+/i.test(raw);
            const relName = raw.replace(/^NOT\s+/i, '').trim();
            const starSet = starsInRelation(posChi, relName, chartIndex);
            if (!starSet.size) return false;
            const yes = matchStarExpr(starExpr, starSet);
            return neg ? !yes : yes;
          })
        );
      }

      function conditionSatisfied(cond, contextChi, chartIndex) {
        const posAndTerms = splitAndOr(cond.posExpr);
        return posAndTerms.every(orTerms => {
          const posCandidates = new Set();
          orTerms.forEach(tok => resolvePosToken(tok, contextChi, chartIndex).forEach(p => posCandidates.add(p)));
          if (!posCandidates.size) return false;
          for (const pos of posCandidates) {
            if (relationExprSatisfied(cond.starExpr, cond.relExpr, pos, chartIndex)) return true;
          }
          return false;
        });
      }

      function conditionReferencesContext(cond, contextChi, chartIndex) {
        const posAndTerms = splitAndOr(cond.posExpr);
        return posAndTerms.some(orTerms =>
          orTerms.some(tok => {
            if (vnNorm(tok) === '$this') return true;
            const resolved = resolvePosToken(tok, contextChi, chartIndex);
            return resolved.includes(contextChi);
          })
        );
      }

      function evaluateRulesForCung(contextChi, cungName, lasoJson, onlyStarName = '') {
        const chartIndex = buildChartIndex(lasoJson);
        const rules = parseRuleBlocks(getRuleTextForCung(cungName));
        const starNeed = vnNorm(onlyStarName);
        const hits = [];
        rules.forEach(r => {
          const conds = r.rule.split(';').map(s => s.trim()).filter(Boolean).map(parseCondition).filter(Boolean);
          if (!conds.length) return;
          if (!conds.some(c => conditionReferencesContext(c, contextChi, chartIndex))) return;
          const ok = conds.every(c => conditionSatisfied(c, contextChi, chartIndex));
          if (!ok) return;
          if (starNeed) {
            const matchedStarToken = conds.some(c => vnNorm(c.starExpr).includes(starNeed));
            if (!matchedStarToken) return;
          }
          hits.push({ ...r });
        });
        return hits;
      }

      function renderRuleHitsHtml(cungData, hits, onlyStarName = '') {
        const starTitle = onlyStarName ? ` cho chính tinh <b>${onlyStarName}</b>` : '';
        if (!hits.length) {
          return `<div>Không có rule nào khớp cho cung <b>${cungData.cungChuc}</b> (${cungData.diaChi})${starTitle}.</div>`;
        }
        const list = hits.map((h, i) => `
          <div class="rule-hit">
            <div><b>Rule ${i + 1}</b> - ${h.explain}</div>
            <div class="rule-hit-rule">Rule: ${h.rule}</div>
            ${h.raw ? `<div style="margin-top:6px;color:#5a4630;"><i>Raw: ${h.raw}</i></div>` : ''}
          </div>
        `).join('');
        return `<div style="margin-bottom:8px;color:#6e4d1a;">Tìm thấy <b>${hits.length}</b> rule khớp${starTitle}.</div>${list}`;
      }

      function openRuleModalForChi(chi, onlyStarName = '') {
        if (!_lastJson || !_lastJson.cung) return;
        const cungData = _lastJson.cung.find(c => chiIdx(c.diaChi) === chi);
        if (!cungData) return;
        const hits = evaluateRulesForCung(chi, cungData.cungChuc, _lastJson, onlyStarName);
        const titleEl = document.getElementById('ruleModalTitle');
        const bodyEl = document.getElementById('ruleModalBody');
        if (!titleEl || !bodyEl) return;
        titleEl.textContent = `Luận cung ${cungData.cungChuc} (${cungData.diaChi})`;
        bodyEl.innerHTML = renderRuleHitsHtml(cungData, hits, onlyStarName);
        document.getElementById('ruleOverlay')?.classList.add('open');
      }

      function onCungTitleLeftClick(event, chi) {
        if (event && event.button !== 0) return;
        if (event) { event.preventDefault(); event.stopPropagation(); }
        openRuleModalForChi(chi);
      }

      function onChinhTinhClick(event, chi, starName) {
        if (event && event.button !== 0) return;
        if (event) { event.preventDefault(); event.stopPropagation(); }
        openRuleModalForChi(chi, starName);
      }

      // ── Màu địa chi theo ngũ hành ───────────────────────────
      // Tý=0,Sửu=1,Dần=2,Mão=3,Thìn=4,Tị=5,Ngọ=6,Mùi=7,Thân=8,Dậu=9,Tuất=10,Hợi=11
      const CHI_MAU = {
        0: '#111118',  // Tý  — thủy
        1: '#c8960a',  // Sửu — thổ
        2: '#2d6a2d',  // Dần — mộc
        3: '#2d6a2d',  // Mão — mộc
        4: '#c8960a',  // Thìn — thổ
        5: '#c0392b',  // Tị  — hỏa
        6: '#c0392b',  // Ngọ — hỏa
        7: '#c8960a',  // Mùi — thổ
        8: '#a8a8b0',  // Thân — kim
        9: '#a8a8b0',  // Dậu  — kim
        10: '#c8960a',  // Tuất — thổ
        11: '#111118',  // Hợi  — thủy
      };

      // ── Render header (TOP) ─────────────────────────────────
      // Chữ cái đầu thiên can
      const CAN_VIET_DAU = ['G', 'Ấ', 'B', 'Đ', 'M', 'K', 'C', 'T', 'N', 'Q'];

      function renderHeader({ cungChuc, diaChi, daiVan, isThan, canCung, tenThang }) {
        const badge = isThan ? `<span class="badge badge-t">THÂN</span>` : '';
        const isMono = getComputedStyle(document.documentElement).getPropertyValue('--mono-mode').trim() === '1';
        const ci = chiIdx(diaChi);
        const chiColor = (!isMono && CHI_MAU[ci]) ? ` style="color:${CHI_MAU[ci]}"` : '';
        const canStr = canCung !== undefined ? `${CAN_VIET_DAU[canCung]}.` : '';
        const thangBadge = tenThang ? `<span class="top-thang-inner">${tenThang}</span>` : '';
        return `<div class="cung-top">
      <span class="top-chi"${chiColor}>${canStr}${diaChi}</span>
      <span class="top-ten" title="Click để luận cung"
        onclick="TUVI_RENDER.onCungTitleLeftClick(event, ${ci})">${cungChuc.toUpperCase()}${badge}</span>
      <span class="top-dh">${daiVan !== null ? daiVan : ''}${thangBadge ? `<span class="top-thang">${thangBadge}</span>` : ''}</span>
    </div>`;
      }

      // ── Sao in đậm ──────────────────────────────────────────
      const CAT_BOLD = new Set(['Thiên Khôi', 'Thiên Việt', 'Tả Phụ', 'Hữu Bật', 'Văn Xương', 'Văn Khúc',
        'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Hồng Loan', 'Đào Hoa']);
      const HUNG_BOLD = new Set(['Đà La', 'Kình Dương', 'Địa Kiếp', 'Địa Không', 'Linh Tinh', 'Hỏa Tinh',
        'Hóa Kỵ', 'Thiên Không', 'Cô Thần', 'Quả Tú', 'Thiên Hình', 'Thiên Diêu']);

      // ── Render MIDDLE ────────────────────────────────────────
      function renderMiddle(saoCung, dvSao = [], chi) {
        const chinh = saoCung.filter(s => s.type === 'chinh');
        const cat = saoCung.filter(s => s.type === 'cat');
        const hung = saoCung.filter(s => s.type === 'hung');
        const trung = saoCung.filter(s => s.type === 'trung');

        const chinhLines = ['', ''];
        chinh.forEach((s, i) => {
          if (i < 2) {
            const _ms = hanhStyle(s.nguHanh);
            const safeStar = String(s.name || '').replace(/"/g, '&quot;');
            chinhLines[i] = `<div class="sao-chinh" title="Click để luận theo chính tinh"
            onclick="TUVI_RENDER.onChinhTinhClick(event, ${chi}, &quot;${safeStar}&quot;)"${_ms ? ` style="${_ms}"` : ''}>${s.name.toUpperCase()}${smTag(s)}</div>`;
          }
        });
        const chinhHtml = `<div class="mid-chinh">
      <div class="chinh-row">${chinhLines[0] || '<div class="chinh-empty"></div>'}</div>
      <div class="chinh-row">${chinhLines[1] || '<div class="chinh-empty"></div>'}</div>
    </div>`;

        const catList = [...cat, ...trung].sort((a, b) => (CAT_BOLD.has(b.name) ? 1 : 0) - (CAT_BOLD.has(a.name) ? 1 : 0));
        const hungList = hung.sort((a, b) => (HUNG_BOLD.has(b.name) ? 1 : 0) - (HUNG_BOLD.has(a.name) ? 1 : 0));

        const catHtml = catList.map(s => {
          const bold = CAT_BOLD.has(s.name) ? ' bold' : '';
          const _ms = hanhStyle(s.nguHanh);
          return `<div class="sao-cat${bold}"${_ms ? ` style="${_ms}"` : ''}>${dn(s.name)}${smTag(s)}</div>`;
        }).join('');
        const hungHtml = hungList.map(s => {
          if (s.name === 'Triệt') return '';
          const bold = HUNG_BOLD.has(s.name) ? ' bold' : '';
          const _ms = hanhStyle(s.nguHanh);
          return `<div class="sao-hung${bold}"${_ms ? ` style="${_ms}"` : ''}>${dn(s.name)}${smTag(s)}</div>`;
        }).join('');

        // Sao lưu ĐV - bỏ "ĐV." lấy tên thật, tra SAO_META/SAO_HANH để lấy class và màu
        let dvSaoCatHtml = '', dvSaoHungHtml = '';
        dvSao.forEach(t => {
          const tenThat = t.replace(/^(ĐV\.|L\.)/, '');
          const meta2 = TUVI_DATA.SAO_META[tenThat];
          const hanhRaw = TUVI_DATA.SAO_HANH[tenThat] || '';
          const hanh = hanhRaw.split('-')[0];
          const isHung = meta2?.type === 'hung';
          const isBold = isHung ? HUNG_BOLD.has(tenThat) : CAT_BOLD.has(tenThat);
          const cls = (isHung ? 'sao-hung' : 'sao-cat') + (isBold ? ' bold' : '');
          const _ms = hanhStyle(hanh);
          const html2 = `<div class="${cls}"${_ms ? ` style="${_ms}"` : ''}>${t}</div>`;
          if (isHung) dvSaoHungHtml += html2;
          else dvSaoCatHtml += html2;
        });

        return `<div class="cung-mid">${chinhHtml}<div class="mid-cathung-wrap"><div class="mid-cathung">
      <div class="col-cat">${catHtml}${dvSaoCatHtml}</div>
      <div class="col-hung">${hungHtml}${dvSaoHungHtml}</div>
    </div></div></div>`;
      }

      // ── Render footer (BOTTOM) ──────────────────────────────
      function renderFooter({ truongSinh, thang, daiHan, tenDV, tenLN }) {
        const dvHtml = tenDV
          ? `<span class="bot-dv"><span class="bot-dv-inner">${tenDV}</span></span>`
          : `<span class="bot-dv"></span>`;
        const lnHtml = tenLN ? `<div class="bot-ln"><span class="bot-ln-inner">${tenLN}</span></div>` : '';
        return `<div class="cung-bot">
      <div class="bot-left-col">${dvHtml}</div>
      <span class="bot-ts">${truongSinh}</span>
      <div class="bot-right-col">
        ${lnHtml}
      </div>
    </div>`;
      }

      // ── Render một ô cung ───────────────────────────────────
      function renderCung(cungData) {
        const { diaChi, gridRow, gridCol, sao, dvSao = [] } = cungData;
        const ci = chiIdx(diaChi);
        return `<div class="cung" data-chi="${ci}"
        style="grid-row:${gridRow};grid-column:${gridCol}"
        onclick="TUVI_RENDER.clickCung(${ci})">
      ${renderHeader(cungData)}
      ${renderMiddle(sao, dvSao, ci)}
      ${renderFooter(cungData)}
    </div>`;
      }

      // ── Render ô center 2×2 ─────────────────────────────────
      function renderCenter(meta) {
        const { hoTen, ngayAL, thangAL, namAL, canNam, chiNam, gioSinh, tenChiGio,
          gioiTinh, chiCungMenh, chiCungThan, tenCuc, thuanChieu, napAm } = meta;

        const gtStr = gioiTinh === 'nam' ? 'Nam' : 'Nữ';
        const canChi = `${canNam} ${chiNam}`;
        const amDuong = gioiTinh === 'nam'
          ? (thuanChieu ? 'Dương Nam' : 'Âm Nam')
          : (thuanChieu ? 'Âm Nữ' : 'Dương Nữ');

        const V = typeof _lastJson !== 'undefined' && _lastJson ? _lastJson.cung : null;
        const chiMenhIdx = chiIdx(chiCungMenh);
        const cungMenhSao = V ? (V.find(c => chiIdx(c.diaChi) === chiMenhIdx)?.sao.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—') : '—';
        const cungThanSao = V ? (V.find(c => c.isThan)?.sao.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—') : '—';

        // ── Âm Dương thuận/nghịch lý ────────────────────────────
        const chiMenhAmDuong = chiMenhIdx % 2 === 1 ? 'am' : 'duong';
        const nguoiAmDuong = (amDuong === 'Âm Nam' || amDuong === 'Âm Nữ') ? 'am' : 'duong';
        const thuanLy = (nguoiAmDuong === 'am' && chiMenhAmDuong === 'am')
          || (nguoiAmDuong === 'duong' && chiMenhAmDuong === 'duong');
        const amDuongLy = thuanLy ? 'Âm Dương Thuận Lý' : 'Âm Dương Nghịch Lý';

        // ── Quan hệ Mệnh - Cục ──────────────────────────────────
        const hanhNapAm = (napAm || '').split(' ').pop().toLowerCase()
          .replace('kim', 'kim').replace('thủy', 'thuy').replace('mộc', 'moc')
          .replace('hỏa', 'hoa').replace('thổ', 'tho');
        const hanhCuc = { 2: 'thuy', 3: 'moc', 4: 'kim', 5: 'tho', 6: 'hoa' }[cucSo(tenCuc)] || '';
        function quanheMenhCuc(menh, cuc) {
          const sinh = { kim: 'thuy', thuy: 'moc', moc: 'hoa', hoa: 'tho', tho: 'kim' };
          const khac = { kim: 'moc', thuy: 'hoa', moc: 'tho', hoa: 'kim', tho: 'thuy' };
          if (sinh[menh] === cuc) return 'Mệnh Sinh Cục';
          if (sinh[cuc] === menh) return 'Cục Sinh Mệnh';
          if (khac[menh] === cuc) return 'Mệnh Khắc Cục';
          if (khac[cuc] === menh) return 'Cục Khắc Mệnh';
          return 'Mệnh Cục Bình Hòa';
        }
        const quanHeMenhCuc = quanheMenhCuc(hanhNapAm, hanhCuc);

        // ── Thân cư cung chức ───────────────────────────────────
        const thanCu = V ? (V.find(c => c.isThan)?.cungChuc || '—') : '—';

        const isMono = getComputedStyle(document.documentElement).getPropertyValue('--mono-mode').trim() === '1';
        const bl = isMono ? '#000000' : 'rgb(51,47,142)';
        const namXemEl = document.getElementById('namXem');
        const namXem = namXemEl ? (parseInt(namXemEl.dataset.val) || 0) : 0;
        const showNamHan = (document.getElementById('chkXemHan')?.checked ?? true) && namXem > 0;

        // Watermark bát quái
        const bq = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#1a1008"/>
      <path d="M100,10 A90,90 0 0,1 100,190 A45,45 0 0,1 100,100 A45,45 0 0,0 100,10Z" fill="#fff"/>
      <circle cx="100" cy="55" r="15" fill="#1a1008"/>
      <circle cx="100" cy="145" r="15" fill="#fff"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#1a1008" stroke-width="2"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const ang = i * 45 - 90, rad = ang * Math.PI / 180, cx = 100 + 102 * Math.cos(rad), cy = 100 + 102 * Math.sin(rad), que = [[1, 1, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 0, 0]][i]; return que.map((h, j) => { const hy = cy + (j - 1) * 5; return h ? `<line x1="${cx - 8}" y1="${hy}" x2="${cx + 8}" y2="${hy}" stroke="#1a1008" stroke-width="2" transform="rotate(${ang + 90},${cx},${cy})"/>` : `<line x1="${cx - 8}" y1="${hy}" x2="${cx - 2}" y2="${hy}" stroke="#1a1008" stroke-width="2" transform="rotate(${ang + 90},${cx},${cy})"/><line x1="${cx + 2}" y1="${hy}" x2="${cx + 8}" y2="${hy}" stroke="#1a1008" stroke-width="2" transform="rotate(${ang + 90},${cx},${cy})"/>`; }).join(''); }).join('')}
    </svg>`;

        const row = (label, val, extra = '') => `
      <tr>
        <td style="font-weight:bold;color:#111;white-space:nowrap;padding:1.5px 8px 1.5px 0;vertical-align:top;">${label}</td>
        <td style="color:${bl};padding:1.5px 0;vertical-align:top;">${val}</td>
        ${extra ? `<td style="color:${bl};padding:1.5px 0 1.5px 6px;vertical-align:top;">${extra}</td>` : '<td></td>'}
      </tr>`;

        return `<div class="center" style="grid-row:2/4;grid-column:2/4;align-items:center;justify-content:center;padding:0;overflow-y:auto;text-align:left;">
      <div class="center-bg">${bq}</div>
      <div style="width:67%;position:relative;z-index:1;margin:auto;">

      <!-- Tiêu đề -->
      <div style="text-align:center;width:100%;margin-bottom:6px;">
        <div style="font-size:11px;font-weight:bold;color:${bl};letter-spacing:1px;">LÁ SỐ TỬ VI</div>
      </div>

      <!-- Bảng thông tin -->
      <table style="width:100%;border-collapse:collapse;font-size:11px;font-family:Arial,sans-serif;">

        <!-- Khối hành chính -->
        ${row('Họ tên:', hoTen || '—')}
        ${row('Năm:', namAL, canChi)}
        ${row('Ngày AL:', `${ngayAL}/${thangAL}/${namAL}`)}
        ${row('Giờ:', `${gioSinh} (${tenChiGio})`)}
        ${showNamHan ? `<tr>
          <td style="font-weight:bold;color:#111;white-space:nowrap;padding:1.5px 8px 1.5px 0;vertical-align:top;">Năm hạn:</td>
          <td colspan="2" style="color:${bl};padding:1.5px 0;vertical-align:top;font-weight:700;font-size:13px;">${namXem}</td>
        </tr>` : ''}

        <!-- Spacer -->
        <tr><td colspan="3" style="padding:3px 0;"><div style="border-top:1px solid #ddd;"></div></td></tr>

        <!-- Khối bản mệnh -->
        ${row('Âm Dương:', amDuong)}
        ${row('Nạp Âm:', napAm || '—')}
        ${row('Cục:', tenCuc)}

        <!-- Spacer -->
        <tr><td colspan="3" style="padding:3px 0;"><div style="border-top:1px solid #ddd;"></div></td></tr>

        <!-- Khối sao chủ -->
        ${row('Chủ Mệnh:', cungMenhSao)}
        ${row('Chủ Thân:', cungThanSao)}
        ${row('Đại hạn:', thuanChieu ? 'Thuận chiều' : 'Nghịch chiều')}
        ${row('Thân cư:', `Cung ${thanCu}`)}

        <!-- Spacer -->
        <tr><td colspan="3" style="padding:3px 0;"><div style="border-top:1px solid #ddd;"></div></td></tr>

        <!-- Nhận định tổng quát - chỉ hiện ở cột 2 -->
        <tr><td></td><td colspan="2" style="color:${bl};font-size:11px;padding:1.5px 0;">${amDuongLy}</td></tr>
        <tr><td></td><td colspan="2" style="color:${bl};font-size:11px;padding:1.5px 0;">${quanHeMenhCuc}</td></tr>
        <tr><td></td><td colspan="2" style="color:${bl};font-size:11px;padding:1.5px 0;">Thân cư ${thanCu}</td></tr>

      </table>
      </div>
    </div>`;
      }

      // ── Click cung: highlight tam phương tứ chính ───────────
      let _selectedChi = null;

      function clickCung(chi) {
        if (_selectedChi === chi) {
          _selectedChi = null;
          clearHighlight();
          return;
        }
        _selectedChi = chi;
        clearHighlight();

        // Tam phương tứ chính: cung chọn + đối cung + 2 tam hợp → cùng 1 màu
        const doi = doiCung(chi);
        const tamH = tamHopGroup(chi);
        setCungClass(chi, 'hl-selected');
        setCungClass(doi, 'hl-selected');
        tamH.forEach(c => { if (c !== chi) setCungClass(c, 'hl-selected'); });
      }

      function clearHighlight() {
        document.querySelectorAll('.cung').forEach(el => {
          el.classList.remove('hl-selected', 'hl-doi', 'hl-tamhop');
        });
      }

      function setCungClass(chi, cls) {
        const el = document.querySelector(`.cung[data-chi="${chi}"]`);
        if (el) el.classList.add(cls);
      }

      // ── Hàm chính ───────────────────────────────────────────
      // ── Render pill Triệt ───────────────────────────────────
      // CHI_GRID: 5=r1c1, 6=r1c2, 7=r1c3, 8=r1c4, 9=r2c4, 10=r3c4,
      //          11=r4c4, 0=r4c3, 1=r4c2, 2=r4c1, 3=r3c1, 4=r2c1
      const CHI_GRID_R = {
        5: { r: 1, c: 1 }, 6: { r: 1, c: 2 }, 7: { r: 1, c: 3 }, 8: { r: 1, c: 4 },
        9: { r: 2, c: 4 }, 10: { r: 3, c: 4 },
        11: { r: 4, c: 4 }, 0: { r: 4, c: 3 }, 1: { r: 4, c: 2 }, 2: { r: 4, c: 1 },
        3: { r: 3, c: 1 }, 4: { r: 2, c: 1 },
      };

      // ── Helper tính vị trí pill ─────────────────────────────
      function getScale() {
        const scaler = document.getElementById('gridScaler');
        if (!scaler) return 1;
        const m = new DOMMatrix(getComputedStyle(scaler).transform);
        return m.a || 1; // m.a = scaleX
      }

      function pillPos(c1, c2, gridEl) {
        const g1 = CHI_GRID_R[c1], g2 = CHI_GRID_R[c2];
        if (!g1 || !g2) return null;
        const el1 = gridEl.querySelector(`.cung[data-chi="${c1}"]`);
        const el2 = gridEl.querySelector(`.cung[data-chi="${c2}"]`);
        if (!el1 || !el2) return null;
        const gr = gridEl.getBoundingClientRect();
        const scale = getScale();
        const isSameRow = g1.r === g2.r;
        let left, top;
        if (isSameRow) {
          const lEl = g1.c < g2.c ? el1 : el2;
          const rEl = g1.c < g2.c ? el2 : el1;
          const lR = lEl.getBoundingClientRect(), rR = rEl.getBoundingClientRect();
          left = (((lR.right + rR.left) / 2) - gr.left) / scale;
          // Row 1 (Ngọ-Mùi): pill ở border bottom; các row khác: border top
          top = g1.r === 1
            ? (lR.bottom - gr.top) / scale
            : (lR.top - gr.top) / scale;
        } else {
          const tEl = g1.r < g2.r ? el1 : el2;
          const bEl = g1.r < g2.r ? el2 : el1;
          const tR = tEl.getBoundingClientRect(), bR = bEl.getBoundingClientRect();
          left = ((tR.left + tR.right) / 2 - gr.left) / scale;
          top = ((tR.bottom + bR.top) / 2 - gr.top) / scale;
        }
        return { left, top };
      }

      function renderTriet(viTriTriet, gridEl) {
        const pos = pillPos(viTriTriet[0], viTriTriet[1], gridEl);
        if (!pos) return;
        const pill = document.createElement('div');
        pill.className = 'triet-pill';
        pill.dataset.left = pos.left;
        pill.dataset.top = pos.top;
        pill.textContent = 'Triệt';
        pill.style.left = pos.left + 'px';
        pill.style.top = pos.top + 'px';
        gridEl.appendChild(pill);
      }

      function renderTuan(viTriTuan, gridEl) {
        if (!viTriTuan) return;
        const pos = pillPos(viTriTuan[0], viTriTuan[1], gridEl);
        if (!pos) return;

        // Kiểm tra có trùng vị trí với pill Triệt không (±5px)
        const trietPill = gridEl.querySelector('.triet-pill');
        if (trietPill) {
          const tLeft = parseFloat(trietPill.dataset.left);
          const tTop = parseFloat(trietPill.dataset.top);
          if (Math.abs(tLeft - pos.left) < 5 && Math.abs(tTop - pos.top) < 5) {
            // Cùng vị trí → gộp thành "Tuần-Triệt"
            trietPill.textContent = 'Tuần-Triệt';
            trietPill.className = 'tuantriet-pill';
            return;
          }
        }

        const pill = document.createElement('div');
        pill.className = 'tuan-pill';
        pill.textContent = 'Tuần';
        pill.style.left = pos.left + 'px';
        pill.style.top = pos.top + 'px';
        gridEl.appendChild(pill);
      }

      // Tìm pill đã có tại vị trí (±5px)
      function findPillAt(pos, gridEl) {
        const pills = gridEl.querySelectorAll('.triet-pill,.tuan-pill,.tuantriet-pill,.luu-triet-pill,.luu-tuan-pill');
        for (const p of pills) {
          if (Math.abs(parseFloat(p.style.left) - pos.left) < 5 &&
            Math.abs(parseFloat(p.style.top) - pos.top) < 5) return p;
        }
        return null;
      }

      function renderLuuTriet(chis, gridEl) {
        if (!chis) return;
        const pos = pillPos(chis[0], chis[1], gridEl);
        if (!pos) return;
        const existing = findPillAt(pos, gridEl);
        if (existing) { existing.textContent += '·L.Triệt'; return; }
        const pill = document.createElement('div');
        pill.className = 'luu-triet-pill';
        pill.textContent = 'L.Triệt';
        pill.style.left = pos.left + 'px';
        pill.style.top = pos.top + 'px';
        gridEl.appendChild(pill);
      }

      function renderLuuTuan(chis, gridEl) {
        if (!chis) return;
        const pos = pillPos(chis[0], chis[1], gridEl);
        if (!pos) return;
        const existing = findPillAt(pos, gridEl);
        if (existing) { existing.textContent += '·L.Tuần'; return; }
        const pill = document.createElement('div');
        pill.className = 'luu-tuan-pill';
        pill.textContent = 'L.Tuần';
        pill.style.left = pos.left + 'px';
        pill.style.top = pos.top + 'px';
        gridEl.appendChild(pill);
      }

      let _lastMeta = null;
      let _lastLuuPills = { triet: null, tuan: null };

      function renderPills(meta, gridEl) {
        gridEl.querySelectorAll('.triet-pill,.tuan-pill,.tuantriet-pill,.luu-triet-pill,.luu-tuan-pill').forEach(p => p.remove());
        if (meta.viTriTriet) renderTriet(meta.viTriTriet, gridEl);
        if (meta.viTriTuan) renderTuan(meta.viTriTuan, gridEl);
        // Lưu Triệt/Tuần — chỉ render nếu xemHan
        const xemHan = document.getElementById('chkXemHan')?.checked ?? true;
        if (xemHan) {
          if (_lastLuuPills.triet) renderLuuTriet(_lastLuuPills.triet, gridEl);
          if (_lastLuuPills.tuan) renderLuuTuan(_lastLuuPills.tuan, gridEl);
        }
      }

      // Thứ tự tên ĐV theo thứ tự cung chức (Mệnh=0, Phụ Mẫu=1, ...)
      const TEN_CUNG_DV = ['ĐV.MỆNH', 'ĐV.PHỤ', 'ĐV.PHÚC', 'ĐV.ĐIỀN', 'ĐV.QUAN', 'ĐV.NÔ', 'ĐV.DI', 'ĐV.TẬT', 'ĐV.TÀI', 'ĐV.TỬ', 'ĐV.PHỐI', 'ĐV.BÀO'];
      const TEN_CUNG_LN = ['L.MỆNH', 'L.PHỤ', 'L.PHÚC', 'L.ĐIỀN', 'L.QUAN', 'L.NÔ', 'L.DI', 'L.TẬT', 'L.TÀI', 'L.TỬ', 'L.PHỐI', 'L.BÀO'];
      // Ánh xạ tên cung chức → index thứ tự
      const CUNG_CHUC_IDX = { 'Mệnh': 0, 'Phụ Mẫu': 1, 'Phúc Đức': 2, 'Điền Trạch': 3, 'Quan Lộc': 4, 'Nô Bộc': 5, 'Thiên Di': 6, 'Tật Ách': 7, 'Tài Bạch': 8, 'Tử Tức': 9, 'Phu Thê': 10, 'Huynh Đệ': 11 };

      // Sao an theo địa chi cung ĐV.Mệnh (Tý=0..Hợi=11)
      // Sao an theo địa chi cung ĐV.Mệnh (chi: Tý=0..Hợi=11)
      const DV_SAO_THEO_MENH = {
        'ĐV.Thiên Mã': [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
      };

      // Sao L. an theo địa chi năm xem hạn (Tý=0..Hợi=11)
      const L_SAO_THEO_CHI = {
        'L.Thiên Mã': [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
        'L.Cô Thần': [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2],
        'L.Quả Tú': [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10],
        'L.Hàm Trì': [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0],
        'L.Hồng Loan': [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4],
        'L.Thiên Hỉ': [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10],
      };

      // Sao an theo thiên can cung ĐV.Mệnh (can: Giáp=0..Quý=9)
      const DV_SAO_THEO_CAN = {
        'ĐV.Đà La': [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
        'ĐV.Lộc Tồn': [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
        'ĐV.Kình Dương': [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
        'ĐV.Thiên Khôi': [1, 0, 11, 11, 1, 0, 6, 6, 3, 3],
        'ĐV.Thiên Việt': [7, 8, 9, 9, 7, 8, 2, 2, 5, 5],
        'ĐV.Văn Xương': [5, 6, 8, 9, 8, 9, 11, 0, 2, 3],
        'ĐV.Văn Khúc': [9, 8, 6, 5, 6, 5, 3, 2, 0, 11],
      };

      // Sao L. an theo thiên can năm xem hạn (cùng bảng, khác tiền tố)
      const L_SAO_THEO_CAN = {
        'L.Đà La': [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
        'L.Lộc Tồn': [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
        'L.Kình Dương': [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
        'L.Thiên Khôi': [1, 0, 11, 11, 1, 0, 6, 6, 3, 3],
        'L.Thiên Việt': [7, 8, 9, 9, 7, 8, 2, 2, 5, 5],
        'L.Văn Xương': [5, 6, 8, 9, 8, 9, 11, 0, 2, 3],
        'L.Văn Khúc': [9, 8, 6, 5, 6, 5, 3, 2, 0, 11],
      };

      function tinhCungDVHienTai(meta, namXem) {
        const { tenCuc, chiCungMenh, thuanChieu, namAL: namSinh } = meta;
        const soCucVal = cucSo(tenCuc);
        const chiMenhIdx = chiIdx(chiCungMenh);
        const tuoi = namXem - namSinh + 1;
        if (tuoi < 0) return null;
        let sttDV = 0;
        while (true) {
          const start = soCucVal + sttDV * 10;
          const end = start + 9;
          if (tuoi < start) return null;
          if (tuoi >= start && tuoi <= end) break;
          sttDV++;
        }
        const chiDVMenh = thuanChieu
          ? (chiMenhIdx + sttDV) % 12
          : (chiMenhIdx - sttDV + 12 * 10) % 12;
        return chiDVMenh;
      }

      function render(lasoJson, gridEl) {
        _selectedChi = null;
        _lastMeta = lasoJson.meta;
        const { meta, cung } = lasoJson;

        // Tính cung ĐV hiện tại từ năm xem
        const namXemEl = document.getElementById('namXem');
        const namXem = namXemEl ? (parseInt(namXemEl.dataset.val) || 0) : 0;
        const xemHanChecked = document.getElementById('chkXemHan')?.checked ?? true;
        const xemHan = xemHanChecked && namXem > 0;
        const luuMode = document.querySelector('input[name="luuMode"]:checked')?.value || 'qt';

        // Reset lưu pills
        _lastLuuPills = { triet: null, tuan: null };

        // Sao lưu quan trọng
        const SAOQT = new Set([
          'ĐV.Hóa Lộc', 'ĐV.Hóa Quyền', 'ĐV.Hóa Khoa', 'ĐV.Hóa Kỵ',
          'L.Hóa Lộc', 'L.Hóa Quyền', 'L.Hóa Khoa', 'L.Hóa Kỵ',
          'L.Đào Hoa', 'L.Hàm Trì', 'L.Hồng Loan', 'L.Thiên Hỉ',
          'L.Kình Dương', 'L.Đà La', 'ĐV.Kình Dương', 'ĐV.Đà La',
          'L.Thiên Khôi', 'L.Thiên Việt',
          'L.Tang Môn', 'L.Bạch Hổ', 'L.Thiên Khốc', 'L.Thiên Hư',
        ]);
        const chiDVMenh = xemHan ? tinhCungDVHienTai(meta, namXem) : null;

        // Map chiIndex → tên ĐV dựa trên tên cung chức
        const dvMap = {};
        if (chiDVMenh !== null) {
          // Tìm cung có chi = chiDVMenh → đó là cung Mệnh ĐV
          // Từ đó ánh xạ: cung có ten X → TEN_CUNG_DV[CUNG_CHUC_IDX[X] offset từ Mệnh ĐV]
          // Thực chất: cung chiDVMenh là ĐV.MỆNH, cung kế tiếp (thuận) là ĐV.PHỤ...
          // Thứ tự cung chức đi thuận chiều từ cung Mệnh ĐV
          for (let i = 0; i < 12; i++) {
            dvMap[(chiDVMenh + i) % 12] = TEN_CUNG_DV[i];
          }
        }

        // An sao lưu theo địa chi cung ĐV.Mệnh
        // Cung lưu niên: L.Mệnh = địa chi năm xem, đi thuận
        const chiLNMenh = namXem % 12;
        const chiNamXem = ((namXem - 4) % 12 + 12) % 12;
        const lnMap = {};
        const thangMap = {};
        if (xemHan) {
          for (let i = 0; i < 12; i++) lnMap[(chiNamXem + i) % 12] = TEN_CUNG_LN[i];
          const delta = Math.abs(namXem - 1900) % 12;
          let chiThang = (delta - (meta.thangAL - 1) + 12 * 12) % 12;
          chiThang = (chiThang + chiIdx(meta.tenChiGio)) % 12;
          for (let i = 0; i < 12; i++) thangMap[(chiThang + i) % 12] = `T${i + 1}`;
        }

        const dvSaoMap = {}; // chiIndex → [tên sao lưu]
        if (chiDVMenh !== null) {
          // Theo địa chi
          Object.entries(DV_SAO_THEO_MENH).forEach(([tenSao, arr]) => {
            const chiSao = arr[chiDVMenh];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });
          // Theo thiên can: lấy can của cung ĐV.Mệnh = BANG_THIENCAN_CUNGMENH[canNam][chiDVMenh]
          const canDVMenh = TUVI_DATA.BANG_THIENCAN_CUNGMENH[canIdx(meta.canNam)][chiDVMenh];
          Object.entries(DV_SAO_THEO_CAN).forEach(([tenSao, arr]) => {
            const chiSao = arr[canDVMenh];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });
          // An sao L. theo thiên can năm xem hạn
          const canNamXem = ((namXem - 4) % 10 + 10) % 10;
          Object.entries(L_SAO_THEO_CAN).forEach(([tenSao, arr]) => {
            const chiSao = arr[canNamXem];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });
          // An sao N. theo địa chi năm xem hạn
          Object.entries(L_SAO_THEO_CHI).forEach(([tenSao, arr]) => {
            const chiSao = arr[chiNamXem];
            if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
            dvSaoMap[chiSao].push(tenSao);
          });

          // ĐV.Tứ Hóa: theo thiên can cung ĐV.Mệnh
          const HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
          // Lookup: tên sao → chiIndex của cung chứa sao đó (từ cung[])
          const chiCuaSao = (tenSao) => {
            const c = cung.find(c => c.sao.some(s => s.name === tenSao));
            return c ? chiIdx(c.diaChi) : undefined;
          };
          TUVI_DATA.TU_HOA[canDVMenh].forEach((tenSaoHoa, i) => {
            const chiSao = chiCuaSao(tenSaoHoa);
            if (chiSao !== undefined) {
              if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
              dvSaoMap[chiSao].push(`ĐV.${HOA_TEN[i]}`);
            }
          });

          // L.Tứ Hóa: theo thiên can năm xem hạn
          TUVI_DATA.TU_HOA[canNamXem].forEach((tenSaoHoa, i) => {
            const chiSao = chiCuaSao(tenSaoHoa);
            if (chiSao !== undefined) {
              if (!dvSaoMap[chiSao]) dvSaoMap[chiSao] = [];
              dvSaoMap[chiSao].push(`L.${HOA_TEN[i]}`);
            }
          });

        }

        // Lưu Triệt: theo thiên can NĂM XEM (canNamXem)
        // Lưu Tuần: theo địa chi + thiên can NĂM XEM
        if (xemHan) {
          const canNamXemForPill = ((namXem - 4) % 10 + 10) % 10;
          _lastLuuPills.triet = TUVI_DATA.TRIET[canNamXemForPill] || null;
          _lastLuuPills.tuan = TUVI_DATA.TUAN[chiNamXem]?.[canNamXemForPill] || null;
        }

        let html = '';
        cung.forEach(c => {
          const ci = chiIdx(c.diaChi);
          const canCung = TUVI_DATA.BANG_THIENCAN_CUNGMENH[canIdx(meta.canNam)][ci];
          // Lọc sao lưu theo chế độ
          let rawDvSao = dvSaoMap[ci] || [];
          if (luuMode === 'dv') rawDvSao = rawDvSao.filter(t => t.startsWith('ĐV.'));
          if (luuMode === 'ln') rawDvSao = rawDvSao.filter(t => t.startsWith('L.'));
          if (luuMode === 'qt') rawDvSao = rawDvSao.filter(t => SAOQT.has(t));
          // luuMode === 'all': giữ nguyên không lọc
          html += renderCung({ ...c, tenDV: dvMap[ci] || '', tenLN: lnMap[ci] || '', tenThang: thangMap[ci] || '', dvSao: rawDvSao, canCung });
        });
        html += renderCenter(meta);
        gridEl.innerHTML = html;
        requestAnimationFrame(() => renderPills(meta, gridEl));
      }

      function reRenderPills() {
        if (!_lastMeta) return;
        const gridEl = document.getElementById('grid');
        if (gridEl) requestAnimationFrame(() => renderPills(_lastMeta, gridEl));
      }

      return { render, clickCung, reRenderPills, onCungTitleLeftClick, onChinhTinhClick };
    })();
