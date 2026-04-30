window.TUVI_RENDER_SHARED = window.TUVI_RENDER_SHARED || {};

window.TUVI_RENDER_SHARED.constants = {
  CHI_MAU: {
    0: '#111118',
    1: '#c8960a',
    2: '#2d6a2d',
    3: '#2d6a2d',
    4: '#c8960a',
    5: '#c0392b',
    6: '#c0392b',
    7: '#c8960a',
    8: '#a8a8b0',
    9: '#a8a8b0',
    10: '#c8960a',
    11: '#111118',
  },
  CAN_VIET_DAU: ['G', 'Ấ', 'B', 'Đ', 'M', 'K', 'C', 'T', 'N', 'Q'],
  CAT_BOLD: ['Thiên Khôi', 'Thiên Việt', 'Tả Phụ', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Hồng Loan', 'Đào Hoa'],
  HUNG_BOLD: ['Đà La', 'Kình Dương', 'Địa Kiếp', 'Địa Không', 'Linh Tinh', 'Hỏa Tinh', 'Hóa Kỵ', 'Thiên Không', 'Cô Thần', 'Quả Tú', 'Thiên Hình', 'Thiên Diêu'],
  CHI_GRID_R: {
    5: { r: 1, c: 1 }, 6: { r: 1, c: 2 }, 7: { r: 1, c: 3 }, 8: { r: 1, c: 4 },
    9: { r: 2, c: 4 }, 10: { r: 3, c: 4 },
    11: { r: 4, c: 4 }, 0: { r: 4, c: 3 }, 1: { r: 4, c: 2 }, 2: { r: 4, c: 1 },
    3: { r: 3, c: 1 }, 4: { r: 2, c: 1 },
  },
  TEN_CUNG_DV: ['ĐV.MỆNH', 'ĐV.PHỤ', 'ĐV.PHÚC', 'ĐV.ĐIỀN', 'ĐV.QUAN', 'ĐV.NÔ', 'ĐV.DI', 'ĐV.TẬT', 'ĐV.TÀI', 'ĐV.TỬ', 'ĐV.PHỐI', 'ĐV.BÀO'],
  TEN_CUNG_LN: ['L.MỆNH', 'L.PHỤ', 'L.PHÚC', 'L.ĐIỀN', 'L.QUAN', 'L.NÔ', 'L.DI', 'L.TẬT', 'L.TÀI', 'L.TỬ', 'L.PHỐI', 'L.BÀO'],
  DV_SAO_THEO_MENH: {
    'ĐV.Thiên Mã': [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
  },
  L_SAO_THEO_CHI: {
    'L.Thiên Mã': [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
    'L.Cô Thần': [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2],
    'L.Quả Tú': [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10],
    'L.Hàm Trì': [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0],
    'L.Hồng Loan': [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4],
    'L.Thiên Hỉ': [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10],
  },
  DV_SAO_THEO_CAN: {
    'ĐV.Đà La': [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
    'ĐV.Lộc Tồn': [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
    'ĐV.Kình Dương': [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
    'ĐV.Thiên Khôi': [1, 0, 11, 11, 1, 0, 6, 6, 3, 3],
    'ĐV.Thiên Việt': [7, 8, 9, 9, 7, 8, 2, 2, 5, 5],
    'ĐV.Văn Xương': [5, 6, 8, 9, 8, 9, 11, 0, 2, 3],
    'ĐV.Văn Khúc': [9, 8, 6, 5, 6, 5, 3, 2, 0, 11],
  },
  L_SAO_THEO_CAN: {
    'L.Đà La': [1, 2, 4, 5, 4, 5, 7, 8, 10, 11],
    'L.Lộc Tồn': [2, 3, 5, 6, 5, 6, 8, 9, 11, 0],
    'L.Kình Dương': [3, 4, 6, 7, 6, 7, 9, 10, 0, 1],
    'L.Thiên Khôi': [1, 0, 11, 11, 1, 0, 6, 6, 3, 3],
    'L.Thiên Việt': [7, 8, 9, 9, 7, 8, 2, 2, 5, 5],
    'L.Văn Xương': [5, 6, 8, 9, 8, 9, 11, 0, 2, 3],
    'L.Văn Khúc': [9, 8, 6, 5, 6, 5, 3, 2, 0, 11],
  },
};

window.TUVI_RENDER_SHARED.createRuleEngine = function createRuleEngine(deps) {
  const { CHI_STR, chiIdx, doiCung, tamHopGroup, getLastJson } = deps;
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
      const cungMenh = (getLastJson()?.cung || []).find(c => c.isMenh);
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
    return andTerms.every(orTerms => orTerms.some(tok => expandStarToken(tok).some(s => starSet.has(s))));
  }
  function relationExprSatisfied(starExpr, relExpr, posChi, chartIndex) {
    const andTerms = splitAndOr(relExpr);
    return andTerms.every(orTerms => orTerms.some(raw => {
      const neg = /^NOT\s+/i.test(raw);
      const relName = raw.replace(/^NOT\s+/i, '').trim();
      const starSet = starsInRelation(posChi, relName, chartIndex);
      if (!starSet.size) return false;
      const yes = matchStarExpr(starExpr, starSet);
      return neg ? !yes : yes;
    }));
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
    return posAndTerms.some(orTerms => orTerms.some(tok => {
      if (vnNorm(tok) === '$this') return true;
      const resolved = resolvePosToken(tok, contextChi, chartIndex);
      return resolved.includes(contextChi);
    }));
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
    if (!hits.length) return `<div>Không có rule nào khớp cho cung <b>${cungData.cungChuc}</b> (${cungData.diaChi})${starTitle}.</div>`;
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
    const lastJson = getLastJson();
    if (!lastJson || !lastJson.cung) return;
    const cungData = lastJson.cung.find(c => chiIdx(c.diaChi) === chi);
    if (!cungData) return;
    const hits = evaluateRulesForCung(chi, cungData.cungChuc, lastJson, onlyStarName);
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
  return { onCungTitleLeftClick, onChinhTinhClick };
};

window.TUVI_RENDER_SHARED.createPillEngine = function createPillEngine(deps) {
  const { CHI_GRID_R } = deps;

  function getScale() {
    const scaler = document.getElementById('gridScaler');
    if (!scaler) return 1;
    const m = new DOMMatrix(getComputedStyle(scaler).transform);
    return m.a || 1;
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
    let left; let top;
    if (isSameRow) {
      const lEl = g1.c < g2.c ? el1 : el2;
      const rEl = g1.c < g2.c ? el2 : el1;
      const lR = lEl.getBoundingClientRect();
      const rR = rEl.getBoundingClientRect();
      left = (((lR.right + rR.left) / 2) - gr.left) / scale;
      top = g1.r === 1 ? (lR.bottom - gr.top) / scale : (lR.top - gr.top) / scale;
    } else {
      const tEl = g1.r < g2.r ? el1 : el2;
      const bEl = g1.r < g2.r ? el2 : el1;
      const tR = tEl.getBoundingClientRect();
      const bR = bEl.getBoundingClientRect();
      left = ((tR.left + tR.right) / 2 - gr.left) / scale;
      top = ((tR.bottom + bR.top) / 2 - gr.top) / scale;
    }
    return { left, top };
  }

  function findPillAt(pos, gridEl) {
    const pills = gridEl.querySelectorAll('.triet-pill,.tuan-pill,.tuantriet-pill,.luu-triet-pill,.luu-tuan-pill');
    for (const p of pills) {
      if (Math.abs(parseFloat(p.style.left) - pos.left) < 5 &&
        Math.abs(parseFloat(p.style.top) - pos.top) < 5) return p;
    }
    return null;
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
    const trietPill = gridEl.querySelector('.triet-pill');
    if (trietPill) {
      const tLeft = parseFloat(trietPill.dataset.left);
      const tTop = parseFloat(trietPill.dataset.top);
      if (Math.abs(tLeft - pos.left) < 5 && Math.abs(tTop - pos.top) < 5) {
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

  function render(meta, gridEl, luuPills) {
    gridEl.querySelectorAll('.triet-pill,.tuan-pill,.tuantriet-pill,.luu-triet-pill,.luu-tuan-pill').forEach(p => p.remove());
    if (meta.viTriTriet) renderTriet(meta.viTriTriet, gridEl);
    if (meta.viTriTuan) renderTuan(meta.viTriTuan, gridEl);
    const xemHan = document.getElementById('chkXemHan')?.checked ?? true;
    if (xemHan) {
      if (luuPills?.triet) renderLuuTriet(luuPills.triet, gridEl);
      if (luuPills?.tuan) renderLuuTuan(luuPills.tuan, gridEl);
    }
  }

  return { render };
};

window.TUVI_RENDER_SHARED.createCenterRenderer = function createCenterRenderer(deps) {
  const { chiIdx, cucSo, getLastJson } = deps;

  function renderCenter(meta) {
    const { hoTen, ngayAL, thangAL, namAL, canNam, chiNam, gioSinh, tenChiGio,
      gioiTinh, chiCungMenh, tenCuc, thuanChieu, napAm } = meta;

    const canChi = `${canNam} ${chiNam}`;
    const amDuong = gioiTinh === 'nam'
      ? (thuanChieu ? 'Dương Nam' : 'Âm Nam')
      : (thuanChieu ? 'Âm Nữ' : 'Dương Nữ');

    const V = getLastJson() ? getLastJson().cung : null;
    const chiMenhIdx = chiIdx(chiCungMenh);
    const cungMenhSao = V ? (V.find(c => chiIdx(c.diaChi) === chiMenhIdx)?.sao.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—') : '—';
    const cungThanSao = V ? (V.find(c => c.isThan)?.sao.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '—') : '—';

    const chiMenhAmDuong = chiMenhIdx % 2 === 1 ? 'am' : 'duong';
    const nguoiAmDuong = (amDuong === 'Âm Nam' || amDuong === 'Âm Nữ') ? 'am' : 'duong';
    const thuanLy = (nguoiAmDuong === 'am' && chiMenhAmDuong === 'am')
      || (nguoiAmDuong === 'duong' && chiMenhAmDuong === 'duong');
    const amDuongLy = thuanLy ? 'Âm Dương Thuận Lý' : 'Âm Dương Nghịch Lý';

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
    const thanCu = V ? (V.find(c => c.isThan)?.cungChuc || '—') : '—';

    const isMono = getComputedStyle(document.documentElement).getPropertyValue('--mono-mode').trim() === '1';
    const bl = isMono ? '#000000' : 'rgb(51,47,142)';
    const namXemEl = document.getElementById('namXem');
    const namXem = namXemEl ? (parseInt(namXemEl.dataset.val) || 0) : 0;
    const showNamHan = (document.getElementById('chkXemHan')?.checked ?? true) && namXem > 0;

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
      <div style="text-align:center;width:100%;margin-bottom:6px;">
        <div style="font-size:11px;font-weight:bold;color:${bl};letter-spacing:1px;">LÁ SỐ TỬ VI</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;font-family:Arial,sans-serif;">
        ${row('Họ tên:', hoTen || '—')}
        ${row('Năm:', namAL, canChi)}
        ${row('Ngày AL:', `${ngayAL}/${thangAL}/${namAL}`)}
        ${row('Giờ:', `${gioSinh} (${tenChiGio})`)}
        ${showNamHan ? `<tr>
          <td style="font-weight:bold;color:#111;white-space:nowrap;padding:1.5px 8px 1.5px 0;vertical-align:top;">Năm hạn:</td>
          <td colspan="2" style="color:${bl};padding:1.5px 0;vertical-align:top;font-weight:700;font-size:13px;">${namXem}</td>
        </tr>` : ''}
        <tr><td colspan="3" style="padding:3px 0;"><div style="border-top:1px solid #ddd;"></div></td></tr>
        ${row('Âm Dương:', amDuong)}
        ${row('Nạp Âm:', napAm || '—')}
        ${row('Cục:', tenCuc)}
        <tr><td colspan="3" style="padding:3px 0;"><div style="border-top:1px solid #ddd;"></div></td></tr>
        ${row('Chủ Mệnh:', cungMenhSao)}
        ${row('Chủ Thân:', cungThanSao)}
        ${row('Đại hạn:', thuanChieu ? 'Thuận chiều' : 'Nghịch chiều')}
        ${row('Thân cư:', `Cung ${thanCu}`)}
        <tr><td colspan="3" style="padding:3px 0;"><div style="border-top:1px solid #ddd;"></div></td></tr>
        <tr><td></td><td colspan="2" style="color:${bl};font-size:11px;padding:1.5px 0;">${amDuongLy}</td></tr>
        <tr><td></td><td colspan="2" style="color:${bl};font-size:11px;padding:1.5px 0;">${quanHeMenhCuc}</td></tr>
        <tr><td></td><td colspan="2" style="color:${bl};font-size:11px;padding:1.5px 0;">Thân cư ${thanCu}</td></tr>
      </table>
      </div>
    </div>`;
  }

  return { renderCenter };
};
