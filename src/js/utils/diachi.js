// ============================================================
// diachi.js — tiện ích Địa chi dùng chung
// ============================================================

const TUVI_DIACHI_UTIL = (() => {
  const NAMES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  const KEYS = ["ty", "suu", "dan", "mao", "thin", "ti", "ngo", "mui", "than", "dau", "tuat", "hoi"];
  const MONTH_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  function keyToIdx(key, label = "chi") {
    const idx = KEYS.indexOf(String(key || "").trim().toLowerCase());
    if (idx < 0) throw new Error(`TTL ${label} key không hợp lệ: ${key}`);
    return idx;
  }

  function nameToIdx(name, chiList) {
    const source = Array.isArray(chiList) ? chiList : NAMES;
    return source.indexOf(name);
  }

  function splitPairToIdx(pairText) {
    const parts = String(pairText || "").split("+").map((s) => s.trim());
    return [keyToIdx(parts[0]), keyToIdx(parts[1])];
  }

  function toIdx(diachi) {
    const s = String(diachi || "").trim();
    if (!s) return -1;
    const byName = nameToIdx(s, NAMES);
    if (byName >= 0) return byName;
    const byKey = KEYS.indexOf(s.toLowerCase());
    return byKey >= 0 ? byKey : -1;
  }

  function getNext(diachi) {
    const i = toIdx(diachi);
    if (i < 0) throw new Error(`Địa chi không hợp lệ: ${diachi}`);
    return NAMES[(i + 1) % 12];
  }

  function getNexts(diachi, step) {
    let cur = diachi;
    let n = Math.max(0, Math.floor(Number(step) || 0));
    while (n > 0) {
      n -= 1;
      cur = getNext(cur);
    }
    const i = toIdx(cur);
    if (i < 0) throw new Error(`Địa chi không hợp lệ: ${diachi}`);
    return NAMES[i];
  }

  return { NAMES, KEYS, MONTH_KEYS, keyToIdx, nameToIdx, splitPairToIdx, toIdx, getNext, getNexts };
})();

globalThis.TUVI_DIACHI_UTIL = TUVI_DIACHI_UTIL;
