// ============================================================
// logic.js — Router phương pháp an sao
// Phụ thuộc: ansao.js + trungchauphai.js + thaithulang.js
// ============================================================

const TUVI_LOGIC = (() => {
  const METHODS = {
    trungchau: ANSAO_TRUNGCHAU,
    thaithulang: ANSAO_THAITHULANG,
  };

  function resolveMethod(method) {
    const key = String(method || 'trungchau').toLowerCase();
    return METHODS[key] ? key : 'trungchau';
  }

  function compute(input) {
    const method = resolveMethod(input?.method);
    const impl = METHODS[method];
    return impl.compute(input);
  }

  return {
    compute,
    chiGioFromStr: ANSAO_SHARED.chiGioFromStr,
    resolveMethod,
  };
})();
