const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { assert, TUVI_LOGIC, solar2Lunar, validateSolarDateInput } = require("./test-lib");

const ROOT = path.resolve(__dirname, "..");
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function createSandbox() {
  const els = {};

  function el(id, extra = {}) {
    const o = {
      style: {},
      dataset: {},
      value: "",
      textContent: "",
      disabled: false,
      checked: true,
      selectedIndex: 0,
      innerHTML: "",
      options: [],
      classList: {
        _s: new Set(),
        toggle(name, on) {
          if (on === undefined) {
            if (this._s.has(name)) this._s.delete(name);
            else this._s.add(name);
          } else if (on) this._s.add(name);
          else this._s.delete(name);
        },
        contains(name) {
          return this._s.has(name);
        },
      },
      addEventListener() {},
      querySelectorAll() {
        return [];
      },
      ...extra,
    };
    els[id] = o;
    return o;
  }

  const document = {
    documentElement: {
      style: {
        _store: {},
        setProperty(k, v) {
          this._store[k] = v;
        },
        getPropertyValue(k) {
          return this._store[k] || "";
        },
      },
    },
    getElementById(id) {
      return els[id] || null;
    },
    querySelector(sel) {
      if (sel === ".legend") return els.__legend || null;
      if (sel === ".btn-prompt") return els.__promptBtn || null;
      return null;
    },
    querySelectorAll(sel) {
      if (sel === "#cfgPanel select:not([data-var])") {
        return els.templateSelect ? [els.templateSelect] : [];
      }
      return [];
    },
  };

  const sandbox = {
    console,
    Date,
    Math,
    Number,
    parseInt,
    encodeURIComponent,
    document,
    window: {},
    solar2Lunar,
    scheduleCompute() {},
    _lastJson: null,
    TUVI_RENDER: {
      render() {},
      reRenderPills() {},
    },
    scaleGrid() {},
    requestAnimationFrame(fn) {
      fn();
    },
    getComputedStyle(elArg) {
      return {
        getPropertyValue(p) {
          if (p === "--mono-mode") return document.documentElement.style._store["--mono-mode"] || "0";
          if (elArg && elArg.style && p === "transform") return "matrix(1, 0, 0, 1, 0, 0)";
          return "";
        },
      };
    },
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  return { sandbox, el, els };
}

function loadThemeAndTabs(sandbox) {
  const themePath = path.join(ROOT, "src/js/features/theme-config.js");
  const tabPath = path.join(ROOT, "src/js/features/tab-switching.js");
  const ctx = vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(themePath, "utf8"), ctx, { filename: "theme-config.js" });
  vm.runInContext(fs.readFileSync(tabPath, "utf8"), ctx, { filename: "tab-switching.js" });
}

let _renderSharedConst = null;
function getRenderSharedConstants() {
  if (_renderSharedConst) return _renderSharedConst;
  const modPath = path.join(ROOT, "src/js/render/tuvi-render-modules.js");
  const ctx = {
    window: { TUVI_RENDER_SHARED: {} },
    TUVI_RULES_TEXT_BY_CUNG: {},
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(modPath, "utf8"), ctx, { filename: "tuvi-render-modules.js" });
  _renderSharedConst = ctx.window.TUVI_RENDER_SHARED.constants || {};
  return _renderSharedConst;
}

function buildDlSandbox({ dd, mm, yy, gio }) {
  const { sandbox, el } = createSandbox();
  el("cfgPanel", { querySelectorAll() { return []; } });
  el("templateSelect", { value: "classic", dataset: { lysoKeep: "1" } });
  el("gio", { value: gio });
  el("ngayDL", { value: String(dd) });
  el("thangDL", { value: String(mm) });
  el("namDL", { value: String(yy) });
  el("ngay", { value: "" });
  el("thang", { value: "" });
  el("nam", { value: "" });
  el("dlResult", { textContent: "", innerHTML: "" });
  ["ngayDL", "thangDL", "namDL"].forEach((id) => {
    const node = sandbox.document.getElementById(id);
    if (node) node.addEventListener = () => {};
  });
  loadThemeAndTabs(sandbox);
  return sandbox;
}

function computeFromDlUiInput({ dd, mm, yy, gio, gioiTinh, method = "trungchau" }) {
  const sandbox = buildDlSandbox({ dd, mm, yy, gio });
  sandbox.convertDL();
  return TUVI_LOGIC.compute({
    hoTen: "Solar UI Test",
    ngay: Number.parseInt(sandbox.document.getElementById("ngay").value, 10),
    thang: Number.parseInt(sandbox.document.getElementById("thang").value, 10),
    nam: Number.parseInt(sandbox.document.getElementById("nam").value, 10),
    gioSinh: sandbox.document.getElementById("gio").value,
    gioiTinh,
    method,
  });
}

function canIdx(tenCan) {
  return ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"].indexOf(tenCan);
}

function chiIdx(tenChi) {
  return CHI.indexOf(tenChi);
}

function cucSo(tenCuc) {
  if (String(tenCuc).includes("Nhị")) return 2;
  if (String(tenCuc).includes("Tam")) return 3;
  if (String(tenCuc).includes("Tứ")) return 4;
  if (String(tenCuc).includes("Ngũ")) return 5;
  if (String(tenCuc).includes("Lục")) return 6;
  return 0;
}

function tinhCungDVHienTai(meta, namXem) {
  const soCucVal = cucSo(meta.tenCuc);
  const chiMenhIdx = chiIdx(meta.chiCungMenh);
  const tuoi = namXem - meta.namAL + 1;
  if (tuoi < 0) return null;
  let sttDV = 0;
  while (true) {
    const start = soCucVal + sttDV * 10;
    const end = start + 9;
    if (tuoi < start) return null;
    if (tuoi >= start && tuoi <= end) break;
    sttDV++;
  }
  return meta.thuanChieu
    ? (chiMenhIdx + sttDV) % 12
    : (chiMenhIdx - sttDV + 120) % 12;
}

function enrichWithLuuStars(laso, namXem, method = "trungchau") {
  const C = getRenderSharedConstants();
  const chiDVMenh = tinhCungDVHienTai(laso.meta, namXem);
  const chiNamXem = ((namXem - 4) % 12 + 12) % 12;
  const canNamXem = ((namXem - 4) % 10 + 10) % 10;
  const canDVMenh = TUVI_DATA.BANG_THIENCAN_CUNGMENH[canIdx(laso.meta.canNam)][chiDVMenh];

  const lSaoTheoChiMethod = method === "thaithulang"
    ? {
        ...(C.L_SAO_THEO_CHI || {}),
        "L.Thái Tuế": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        "L.Đào Hoa": [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0],
        ...(((typeof ANSAO_THAITHULANG !== "undefined")
          && ANSAO_THAITHULANG.TABLES
          && ANSAO_THAITHULANG.TABLES.LUU_SAO_THEO_CHI) || {}),
      }
    : (C.L_SAO_THEO_CHI || {});

  const dvSaoMap = {};
  const pushToChi = (chi, name) => {
    if (!dvSaoMap[chi]) dvSaoMap[chi] = [];
    dvSaoMap[chi].push(name);
  };

  Object.entries(C.DV_SAO_THEO_MENH || {}).forEach(([tenSao, arr]) => pushToChi(arr[chiDVMenh], tenSao));
  Object.entries(C.DV_SAO_THEO_CAN || {}).forEach(([tenSao, arr]) => pushToChi(arr[canDVMenh], tenSao));
  Object.entries(C.L_SAO_THEO_CAN || {}).forEach(([tenSao, arr]) => pushToChi(arr[canNamXem], tenSao));
  Object.entries(lSaoTheoChiMethod || {}).forEach(([tenSao, arr]) => pushToChi(arr[chiNamXem], tenSao));

  const HOA_TEN = ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"];
  const chiCuaSao = (tenSao) => {
    const c = laso.cung.find((x) => (x.sao || []).some((s) => s.name === tenSao));
    return c ? chiIdx(c.diaChi) : undefined;
  };
  TUVI_DATA.TU_HOA[canDVMenh].forEach((tenSaoHoa, i) => {
    const chi = chiCuaSao(tenSaoHoa);
    if (chi !== undefined) pushToChi(chi, `ĐV.${HOA_TEN[i]}`);
  });
  TUVI_DATA.TU_HOA[canNamXem].forEach((tenSaoHoa, i) => {
    const chi = chiCuaSao(tenSaoHoa);
    if (chi !== undefined) pushToChi(chi, `L.${HOA_TEN[i]}`);
  });

  return laso.cung.map((c) => {
    const ci = chiIdx(c.diaChi);
    return {
      ...c,
      sao: [...c.sao, ...(dvSaoMap[ci] || []).map((name) => ({ name, sucManh: "" }))],
    };
  });
}

function quanHeMenhCuc(meta, menhChi) {
  const hanhNapAm = (meta.napAm || "")
    .split(" ")
    .pop()
    .toLowerCase()
    .replace("thủy", "thuy")
    .replace("mộc", "moc")
    .replace("hỏa", "hoa")
    .replace("thổ", "tho");
  const tenCuc = String(meta.tenCuc || "");
  const cucSo = tenCuc.includes("Nhị")
    ? 2
    : tenCuc.includes("Tam")
      ? 3
      : tenCuc.includes("Tứ")
        ? 4
        : tenCuc.includes("Ngũ")
          ? 5
          : tenCuc.includes("Lục")
            ? 6
            : 0;
  const hanhCuc = { 2: "thuy", 3: "moc", 4: "kim", 5: "tho", 6: "hoa" }[cucSo] || "";
  const sinh = { kim: "thuy", thuy: "moc", moc: "hoa", hoa: "tho", tho: "kim" };
  const khac = { kim: "moc", thuy: "hoa", moc: "tho", hoa: "kim", tho: "thuy" };
  const chiMenhIdx = CHI.indexOf(menhChi);
  const chiMenhAmDuong = chiMenhIdx % 2 === 1 ? "am" : "duong";
  const amDuong = meta.gioiTinh === "nam"
    ? (meta.thuanChieu ? "Dương Nam" : "Âm Nam")
    : (meta.thuanChieu ? "Âm Nữ" : "Dương Nữ");
  const nguoiAmDuong = (amDuong === "Âm Nam" || amDuong === "Âm Nữ") ? "am" : "duong";
  const amDuongLy = (nguoiAmDuong === chiMenhAmDuong) ? "Âm Dương Thuận Lý" : "Âm Dương Nghịch Lý";
  let menhCuc = "Mệnh Cục Bình Hòa";
  if (sinh[hanhNapAm] === hanhCuc) menhCuc = "Mệnh Sinh Cục";
  else if (sinh[hanhCuc] === hanhNapAm) menhCuc = "Cục Sinh Mệnh";
  else if (khac[hanhNapAm] === hanhCuc) menhCuc = "Mệnh Khắc Cục";
  else if (khac[hanhCuc] === hanhNapAm) menhCuc = "Cục Khắc Mệnh";
  return { menhCuc, amDuongLy };
}

module.exports = [
  {
    name: "laso-flow: DL UI input 31/02/2050 is rejected as invalid date",
    fn: () => {
      const out = validateSolarDateInput(31, 2, 2050);
      assert.equal(out.ok, false);
    },
  },
  {
    name: "laso-flow: thaithulang 08/08/2008 10:30 nam with 2026 han matches expected stars and strengths",
    fn: () => {
      const laso = computeFromDlUiInput({
        dd: 8, mm: 8, yy: 2008, gio: "10:30", gioiTinh: "nam", method: "thaithulang",
      });
      const cungAll = enrichWithLuuStars(laso, 2026, "thaithulang");
      const byCung = Object.fromEntries(cungAll.map((c) => [c.cungChuc, c]));

      assert.equal(byCung["Mệnh"]?.diaChi, "Mão");
      assert.equal(byCung["Phu Thê"]?.isThan, true);

      const expected = {
        "Mệnh": {
          names: ["Thiên Tướng", "Hồng Loan", "Thiên Quý", "Thiên Quan", "Thiên Phúc", "Thiếu Âm", "Thiên Tài", "Thiên Hình", "Phục Binh"],
          sm: { "Thiên Tướng": "H", "Thiên Hình": "Đ" },
        },
        "Phụ Mẫu": {
          names: ["Thiên Cơ", "Thiên Lương", "Hữu Bật", "Hóa Khoa", "Hoa Cái", "Long Trì", "Địa Kiếp", "Đà La", "Hóa Kỵ", "Quan Phủ", "Quan Phù", "Thiên La", "L.Đà La"],
          sm: { "Thiên Cơ": "M", "Thiên Lương": "M", "Địa Kiếp": "H", "Đà La": "Đ"},
        },
        "Phúc Đức": {
          names: ["Tử Vi", "Thất Sát", "Văn Xương", "Lộc Tồn", "Tam Thai", "Bác Sĩ", "Nguyệt Đức", "L.Lộc Tồn", "Linh Tinh", "Tử Phù", "Kiếp Sát", "Phá Toái"],
          sm: { "Tử Vi": "M", "Thất Sát": "V", "Văn Xương": "Đ", "Linh Tinh": "Đ" },
        },
        "Điền Trạch": {
          names: ["Lực Sĩ", "Thiên Trù", "Địa Không", "Kình Dương", "Tuế Phá", "Thiên Hư", "Thiên Khốc", "L.Thái Tuế", "L.Kình Dương"],
          sm: { "Địa Không": "H", "Kình Dương": "H", "Thiên Hư": "Đ", "Thiên Khốc": "Đ" },
        },
        "Quan Lộc": {
          names: ["Thiên Việt", "Thiên Y", "Phong Cáo", "Thanh Long", "Long Đức", "Hỏa Tinh", "Thiên Diêu"],
          sm: { "Hỏa Tinh": "H", "Thiên Diêu": "H" },
        },
        "Nô Bộc": {
          names: ["Lưu Niên Văn Tinh", "L.Thiên Mã", "Tiểu Hao", "Bạch Hổ", "Thiên Thương", "L.Tang Môn"],
          sm: { "Tiểu Hao": "Đ", "Bạch Hổ": "Đ" },
        },
        "Thiên Di": {
          names: ["Liêm Trinh", "Phá Quân", "Văn Khúc", "Thiên Hỉ", "Đào Hoa", "Bát Tọa", "Phúc Đức", "Thiên Đức", "Tướng Quân"],
          sm: { "Liêm Trinh": "H", "Phá Quân": "H", "Văn Khúc": "H" },
        },
        "Tật Ách": {
          names: ["Tả Phụ", "Tấu Thư", "Đường Phù", "Giải Thần", "Phượng Các", "Quả Tú", "Điếu Khách", "Địa Võng", "Thiên Sứ"],
          sm: {},
        },
        "Tài Bạch": {
          names: ["Thiên Phủ", "Thai Phụ", "Ân Quang", "Phi Liêm", "Trực Phù", "Đẩu Quân"],
          sm: { "Thiên Phủ": "Đ" },
        },
        "Tử Tức": {
          names: ["Thiên Đồng", "Thái Âm", "Hóa Quyền", "Hỉ Thần", "Lưu Hà", "Thái Tuế", "L.Thiên Khốc", "L.Thiên Hư"],
          sm: { "Thiên Đồng": "V", "Thái Âm": "V"},
        },
        "Phu Thê": {
          names: ["Vũ Khúc", "Tham Lang", "Thiên Khôi", "Hóa Lộc", "Địa Giải", "Quốc Ấn", "Thiếu Dương", "Thiên Thọ", "Thiên Không", "Bệnh Phù"],
          sm: { "Vũ Khúc": "M", "Tham Lang": "M"},
        },
        "Huynh Đệ": {
          names: ["Thái Dương", "Cự Môn", "Thiên Giải", "Thiên Mã", "Cô Thần", "Đại Hao", "Tang Môn", "L.Bạch Hổ"],
          sm: { "Thái Dương": "V", "Cự Môn": "V", "Thiên Mã": "Đ", "Đại Hao": "Đ", "Tang Môn": "Đ" },
        },
      };

      const alias = {
        "LN Văn Tinh": "Lưu Niên Văn Tinh",
        "Đầu Quân": "Đẩu Quân",
        "Bác Sỹ": "Bác Sĩ",
        "Thiên Hỷ": "Thiên Hỉ",
      };
      const canon = (n) => alias[n] || n;

      Object.entries(expected).forEach(([cungName, exp]) => {
        const c = byCung[cungName];
        assert.ok(c, `Missing cung ${cungName}`);
        const actualNames = new Set((c.sao || []).map((s) => s.name));
        exp.names.map(canon).forEach((n) => assert.ok(actualNames.has(n), `${cungName} missing star ${n}`));
        Object.entries(exp.sm).forEach(([star, sm]) => {
          const s = (c.sao || []).find((x) => x.name === canon(star));
          assert.ok(s, `${cungName} missing star for sucManh ${star}`);
          assert.equal(s.sucManh, sm, `${cungName} ${star} expected ${sm} got ${s.sucManh}`);
        });
      });
    },
  },
  {
    name: "laso-flow: thaithulang 28/02/2016 23:30 nam with 2026 han matches expected stars and strengths",
    fn: () => {
      const laso = computeFromDlUiInput({
        dd: 28, mm: 2, yy: 2016, gio: "23:30", gioiTinh: "nam", method: "thaithulang",
      });
      const cungAll = enrichWithLuuStars(laso, 2026, "thaithulang");
      const byCung = Object.fromEntries(cungAll.map((c) => [c.cungChuc, c]));

      assert.equal(byCung["Mệnh"]?.diaChi, "Dần");
      assert.equal(byCung["Mệnh"]?.isThan, true);

      const expected = {
        "Mệnh": {
          names: ["Phong Cáo", "Thiên Mã", "Giải Thần", "Phượng Các", "Hỏa Tinh", "Đại Hao", "Tuế Phá", "Thiên Hư", "L.Bạch Hổ"],
          sm: { "Thiên Mã": "Đ", "Hỏa Tinh": "Đ", "Đại Hao": "Đ", "Thiên Hư": "H" },
        },
        "Phụ Mẫu": {
          names: ["Liêm Trinh", "Phá Quân", "Long Đức", "Hóa Kỵ", "Phục Binh"],
          sm: { "Liêm Trinh": "H", "Phá Quân": "H" },
        },
        "Phúc Đức": {
          names: ["Văn Khúc", "Tả Phụ", "Hoa Cái", "Đà La", "Quan Phủ", "Bạch Hổ", "Thiên La", "L.Đà La"],
          sm: { "Văn Khúc": "Đ", "Đà La": "Đ", "Bạch Hổ": "H" },
        },
        "Điền Trạch": {
          names: ["Thiên Phủ", "Lộc Tồn", "Bác Sĩ", "Thiên Quan", "Phúc Đức", "Thiên Đức", "L.Lộc Tồn", "Kiếp Sát"],
          sm: { "Thiên Phủ": "Đ"},
        },
        "Quan Lộc": {
          names: ["Thiên Đồng", "Thái Âm", "Hóa Lộc", "Thai Phụ", "Ân Quang", "Lực Sĩ", "Kình Dương", "Điếu Khách", "L.Thái Tuế", "L.Kình Dương"],
          sm: { "Thiên Đồng": "H", "Thái Âm": "H", "Kình Dương": "H" },
        },
        "Nô Bộc": {
          names: ["Vũ Khúc", "Tham Lang", "Hồng Loan", "Địa Giải", "Thanh Long", "Quả Tú", "Lưu Hà", "Trực Phù", "Thiên Thương"],
          sm: { "Vũ Khúc": "M", "Tham Lang": "M" },
        },
        "Thiên Di": {
          names: ["Thái Dương", "Cự Môn", "Thiên Giải", "Thiên Quý", "Lưu Niên Văn Tinh", "L.Thiên Mã", "Tiểu Hao", "Thái Tuế", "Đẩu Quân", "L.Tang Môn"],
          sm: { "Thái Dương": "H", "Cự Môn": "Đ", "Tiểu Hao": "Đ" },
        },
        "Tật Ách": {
          names: ["Thiên Tướng", "Thiên Việt", "Đào Hoa", "Thiếu Dương", "Thiên Không", "Thiên Hình", "Tướng Quân", "Phá Toái", "Thiên Sứ"],
          sm: { "Thiên Tướng": "H", "Thiên Hình": "Đ" },
        },
        "Tài Bạch": {
          names: ["Thiên Cơ", "Thiên Lương", "Hữu Bật", "Văn Xương", "Hóa Khoa", "Hóa Quyền", "Tấu Thư", "Đường Phù", "Thiên Tài", "Thiên Thọ", "Linh Tinh", "Tang Môn", "Thiên Khốc", "Địa Võng"],
          sm: { "Thiên Cơ": "M", "Thiên Lương": "M", "Văn Xương": "Đ", "Linh Tinh": "H", "Tang Môn": "H", "Thiên Khốc": "H" },
        },
        "Tử Tức": {
          names: ["Tử Vi", "Thất Sát", "Thiên Khôi", "Thiếu Âm", "Địa Không", "Địa Kiếp", "Cô Thần", "Phi Liêm"],
          sm: { "Tử Vi": "B", "Thất Sát": "V", "Địa Không": "Đ", "Địa Kiếp": "Đ" },
        },
        "Phu Thê": {
          names: ["Hỉ Thần", "Thiên Trù", "Thiên Phúc", "Long Trì", "Quan Phù", "L.Thiên Khốc", "L.Thiên Hư"],
          sm: {},
        },
        "Huynh Đệ": {
          names: ["Thiên Hỉ", "Thiên Y", "Tam Thai", "Bát Tọa", "Quốc Ấn", "Nguyệt Đức", "Thiên Diêu", "Bệnh Phù", "Tử Phù"],
          sm: { "Thiên Diêu": "H" },
        },
      };

      const alias = {
        "LN Văn Tinh": "Lưu Niên Văn Tinh",
        "Đầu Quân": "Đẩu Quân",
        "Bác Sỹ": "Bác Sĩ",
        "Thiên Hỷ": "Thiên Hỉ",
        "Điều Khách": "Điếu Khách",
      };
      const canon = (n) => alias[n] || n;

      Object.entries(expected).forEach(([cungName, exp]) => {
        const c = byCung[cungName];
        assert.ok(c, `Missing cung ${cungName}`);
        const actualNames = new Set((c.sao || []).map((s) => s.name));
        exp.names.map(canon).forEach((n) => assert.ok(actualNames.has(n), `${cungName} missing star ${n}`));
        Object.entries(exp.sm).forEach(([star, sm]) => {
          const s = (c.sao || []).find((x) => x.name === canon(star));
          assert.ok(s, `${cungName} missing star for sucManh ${star}`);
          assert.equal(s.sucManh, sm, `${cungName} ${star} expected ${sm} got ${s.sucManh}`);
        });
      });
    },
  },
  {
    name: "laso-flow: thaithulang 08/08/2020 10:30 nam with 2026 han matches expected stars and strengths",
    fn: () => {
      const laso = computeFromDlUiInput({
        dd: 8, mm: 8, yy: 2020, gio: "10:30", gioiTinh: "nu", method: "thaithulang",
      });
      const cungAll = enrichWithLuuStars(laso, 2026, "thaithulang");
      const byCung = Object.fromEntries(cungAll.map((c) => [c.cungChuc, c]));

      assert.equal(byCung["Mệnh"]?.diaChi, "Dần");
      assert.equal(byCung["Phu Thê"]?.isThan, true);

      const expected = {
        "Mệnh": {
          names: ["Tham Lang", "Thiên Khôi", "Thiên Trù", "Thiên Mã", "Thiên Tài", "Thiên Hình", "Cô Thần", "Phi Liêm", "Tang Môn", "L.Bạch Hổ"],
          sm: { "Tham Lang": "Đ", "Thiên Mã": "Đ", "Thiên Hình": "Đ", "Tang Môn": "Đ" },
        },
        "Phụ Mẫu": {
          names: ["Thiên Cơ", "Cự Môn", "Hồng Loan", "Tam Thai", "Tấu Thư", "Thiếu Âm", "Linh Tinh", "Lưu Hà"],
          sm: { "Thiên Cơ": "M", "Cự Môn": "M", "Linh Tinh": "Đ" },
        },
        "Phúc Đức": {
          names: ["Tử Vi", "Thiên Tướng", "Thiên Quý", "Quốc Ấn", "Hoa Cái", "Long Trì", "Địa Kiếp", "Tướng Quân", "Quan Phù", "Thiên La", "L.Đà La"],
          sm: { "Tử Vi": "V", "Thiên Tướng": "V", "Địa Kiếp": "H" },
        },
        "Điền Trạch": {
          names: ["Thiên Lương", "Hữu Bật", "Văn Xương", "Nguyệt Đức", "L.Lộc Tồn", "Tiểu Hao", "Tử Phù", "Kiếp Sát", "Phá Toái"],
          sm: { "Thiên Lương": "H", "Văn Xương": "Đ", "Tiểu Hao": "H" },
        },
        "Quan Lộc": {
          names: ["Thất Sát", "Thiên Việt", "Thiên Y", "Thanh Long", "Thiên Phúc", "Địa Không", "Thiên Diêu", "Tuế Phá", "Thiên Hư", "Thiên Khốc", "L.Thái Tuế", "L.Kình Dương"],
          sm: { "Thất Sát": "M", "Địa Không": "H", "Thiên Diêu": "H", "Thiên Hư": "Đ", "Thiên Khốc": "Đ" },
        },
        "Nô Bộc": {
          names: ["Phong Cáo", "Lực Sĩ", "Long Đức", "Đà La", "Thiên Thương"],
          sm: { "Đà La": "Đ" },
        },
        "Thiên Di": {
          names: ["Liêm Trinh", "Lộc Tồn", "Bác Sĩ", "L.Thiên Mã", "Bạch Hổ", "L.Tang Môn"],
          sm: { "Liêm Trinh": "V", "Bạch Hổ": "Đ" },
        },
        "Tật Ách": {
          names: ["Văn Khúc", "Tả Phụ", "Thiên Hỉ", "Đào Hoa", "Phúc Đức", "Thiên Đức", "Hỏa Tinh", "Kình Dương", "Quan Phủ", "Thiên Sứ"],
          sm: { "Văn Khúc": "H", "Hỏa Tinh": "H", "Kình Dương": "H" },
        },
        "Tài Bạch": {
          names: ["Phá Quân", "Ân Quang", "Giải Thần", "Phượng Các", "Quả Tú", "Phục Binh", "Điếu Khách", "Địa Võng"],
          sm: { "Phá Quân": "Đ" },
        },
        "Tử Tức": {
          names: ["Thiên Đồng", "Thai Phụ", "Bát Tọa", "Lưu Niên Văn Tinh", "Thiên Quan", "Hóa Kỵ", "Đại Hao", "Trực Phù"],
          sm: { "Thiên Đồng": "Đ", "Đại Hao": "H" },
        },
        "Phu Thê": {
          names: ["Vũ Khúc", "Thiên Phủ", "Hóa Quyền", "Địa Giải", "Thiên Thọ", "Bệnh Phù", "Thái Tuế", "Đẩu Quân", "L.Thiên Khốc", "L.Thiên Hư"],
          sm: { "Vũ Khúc": "V", "Thiên Phủ": "M" },
        },
        "Huynh Đệ": {
          names: ["Thái Dương", "Thái Âm", "Hóa Khoa", "Hóa Lộc", "Thiên Giải", "Hỉ Thần", "Đường Phù", "Thiếu Dương", "Thiên Không"],
          sm: { "Thái Dương": "Đ", "Thái Âm": "Đ" },
        },
      };

      const alias = {
        "LN Văn Tinh": "Lưu Niên Văn Tinh",
        "Đầu Quân": "Đẩu Quân",
        "Bác Sỹ": "Bác Sĩ",
        "Thiên Hỷ": "Thiên Hỉ",
        "Điều Khách": "Điếu Khách",
        "Phu": "Phu Thê",
      };
      const canon = (n) => alias[n] || n;

      Object.entries(expected).forEach(([cungNameRaw, exp]) => {
        const cungName = canon(cungNameRaw);
        const c = byCung[cungName];
        assert.ok(c, `Missing cung ${cungName}`);
        const actualNames = new Set((c.sao || []).map((s) => s.name));
        exp.names.map(canon).forEach((n) => assert.ok(actualNames.has(n), `${cungName} missing star ${n}`));
        Object.entries(exp.sm).forEach(([star, sm]) => {
          const s = (c.sao || []).find((x) => x.name === canon(star));
          assert.ok(s, `${cungName} missing star for sucManh ${star}`);
          assert.equal(s.sucManh, sm, `${cungName} ${star} expected ${sm} got ${s.sucManh}`);
        });
      });
    },
  },
  {
    name: "laso-flow: DL UI input 28/02/2050 00:30 nu validates expected an sao data",
    fn: () => {
      const laso = computeFromDlUiInput({
        dd: 28,
        mm: 2,
        yy: 2050,
        gio: "00:30",
        gioiTinh: "nu",
      });
      const menh = laso.cung.find((c) => c.cungChuc === "Mệnh");
      const huynhDe = laso.cung.find((c) => c.cungChuc === "Huynh Đệ");
      const thanCung = laso.cung.find((c) => c.isThan);
      assert.ok(menh);
      assert.equal(menh.diaChi, "Mão");
      assert.ok(menh.sao.some((s) => s.name === "Thiên Tướng"));
      assert.ok(menh.sao.some((s) => s.name === "Đào Hoa"));
      assert.equal(menh.daiVan, 5);
      assert.equal(huynhDe?.daiVan, 15);
      assert.equal(thanCung?.diaChi, "Mão");
      const relation = quanHeMenhCuc(laso.meta, menh.diaChi);
      assert.equal(relation.amDuongLy, "Âm Dương Nghịch Lý");
    },
  },
  {
    name: "laso-flow: DL UI input 08/08/2008 23:30 maps to Menh Than with Liem Trinh",
    fn: () => {
      const laso = computeFromDlUiInput({
        dd: 8,
        mm: 8,
        yy: 2008,
        gio: "23:30",
        gioiTinh: "nam",
      });
      const menh = laso.cung.find((c) => c.cungChuc === "Mệnh");
      assert.ok(menh);
      assert.equal(menh.diaChi, "Thân");
      assert.ok(menh.sao.some((s) => s.name === "Liêm Trinh"));
    },
  },
  {
    name: "laso-flow: DL UI input 08/08/2008 10:30 validates expected an sao data",
    fn: () => {
      const laso = computeFromDlUiInput({
        dd: 8,
        mm: 8,
        yy: 2008,
        gio: "10:30",
        gioiTinh: "nam",
      });
      const menh = laso.cung.find((c) => c.cungChuc === "Mệnh");
      assert.ok(menh);
      assert.equal(menh.diaChi, "Mão");
      assert.ok(menh.sao.some((s) => s.name === "Thiên Tướng"));
      assert.ok(menh.sao.some((s) => s.name === "Thiên Hình"));
      assert.equal(menh.daiVan, 2);
      assert.equal(laso.meta.napAm, "Tích Lịch Hỏa");
      const relation = quanHeMenhCuc(laso.meta, menh.diaChi);
      assert.equal(relation.menhCuc, "Cục Khắc Mệnh");
      assert.equal(relation.amDuongLy, "Âm Dương Nghịch Lý");
      assert.deepEqual((laso.meta.viTriTuan || []).map((i) => CHI[i]), ["Ngọ", "Mùi"]);
      assert.deepEqual((laso.meta.viTriTriet || []).map((i) => CHI[i]), ["Tý", "Sửu"]);
    },
  },
  {
    name: "laso-flow: apply lyso switches to API image immediately",
    fn: () => {
      const { sandbox, el } = createSandbox();

      el("cfgPanel", {
        querySelectorAll(sel) {
          if (sel === "input[type=color]" || sel === "input[type=range]" || sel === "select[data-var]")
            return [];
          if (sel === "input, select, button") return [];
          return [];
        },
      });
      el("templateSelect", {
        value: "lyso",
        dataset: { lysoKeep: "1" },
      });
      el("gridScalerOuter", { style: {} });
      el("lysoApiWrap", { style: {} });
      el("lysoApiImage", { src: "" });
      el("lasoWrap", { style: {} });
      el("luuModeBar", { style: { display: "flex" } });
      el("chkXemHan", { checked: true });
      el("gt", { value: "nam" });
      el("gio", { value: "04:00" });
      el("ngayDL", { value: "15" });
      el("thangDL", { value: "6" });
      el("namDL", { value: "1990" });
      el("hoTen", { value: "Nguyen Van A" });
      el("namXem", { dataset: { val: "2026" }, textContent: "2026" });
      el("ngay", { value: "1" });
      el("thang", { value: "1" });
      el("nam", { value: "1990" });
      el("dlResult", { textContent: "", innerHTML: "" });

      ["ngayDL", "thangDL", "namDL"].forEach((id) => el(id, { ...sandbox.document.getElementById(id), addEventListener() {} }));

      loadThemeAndTabs(sandbox);

      sandbox.applyTemplate("lyso");

      const grid = sandbox.document.getElementById("gridScalerOuter");
      const api = sandbox.document.getElementById("lysoApiWrap");
      const img = sandbox.document.getElementById("lysoApiImage");

      assert.equal(grid.style.display, "none");
      assert.equal(api.style.display, "block");
      assert.ok(img.src.includes("lyso.vn/lasotuvi"));
      assert.ok(img.src.includes("/2026/"));
      assert.ok(img.src.includes("Nguyen%20Van%20A") || img.src.includes(encodeURIComponent("Nguyen Van A")));
      assert.equal(sandbox.document.getElementById("lasoWrap").style.display, "block");
      assert.equal(sandbox.document.getElementById("luuModeBar").style.display, "none");
    },
  },
  {
    name: "laso-flow: lyso stays selected after switching tabs",
    fn: () => {
      const { sandbox, el } = createSandbox();

      el("formWrap", { style: {} });
      el("cfgPanel", {
        style: { display: "none" },
        querySelectorAll() {
          return [];
        },
      });
      el("searchPanel", { style: {} });
      el("tabAL", makeTabBtn());
      el("tabDL", makeTabBtn());
      el("tabSEARCH", makeTabBtn());
      el("tabCFG", makeTabBtn());

      const alFields = [makeField(), makeField()];
      const dlFields = [makeField(), makeField(), makeField()];
      sandbox.document.querySelectorAll = function (sel) {
        if (sel === ".al-field") return alFields;
        if (sel === ".dl-field") return dlFields;
        return [];
      };

      el("templateSelect", { value: "lyso", dataset: { lysoKeep: "1" } });
      el("gridScalerOuter", { style: {} });
      el("lysoApiWrap", { style: {} });
      el("lysoApiImage", { src: "" });
      el("lasoWrap", { style: {} });
      el("gt", { value: "nam" });
      el("gio", { value: "10:00" });
      el("ngayDL", { value: "1" });
      el("thangDL", { value: "1" });
      el("namDL", { value: "2000" });
      el("hoTen", { value: "x" });
      el("namXem", { dataset: { val: "2026" }, textContent: "2026" });
      el("ngay", { value: "1" });
      el("thang", { value: "1" });
      el("nam", { value: "2000" });
      el("dlResult", { textContent: "" });

      ["ngayDL", "thangDL", "namDL"].forEach((id) => {
        const node = sandbox.document.getElementById(id);
        if (node) node.addEventListener = () => {};
      });

      loadThemeAndTabs(sandbox);
      sandbox.applyTemplate("lyso");

      assert.equal(sandbox.document.getElementById("templateSelect").value, "lyso");

      sandbox.switchTab("CFG");
      assert.equal(sandbox.document.getElementById("templateSelect").value, "lyso");
      assert.equal(sandbox.document.getElementById("gridScalerOuter").style.display, "none");

      sandbox.switchTab("SEARCH");
      assert.equal(sandbox.document.getElementById("templateSelect").value, "lyso");

      sandbox.switchTab("AL");
      assert.equal(sandbox.document.getElementById("templateSelect").value, "lyso");
    },
  },
  {
    name: "laso-flow: lyso image URL updates when nam xem han changes (refreshLysoImageForNamXem)",
    fn: () => {
      const { sandbox, el } = createSandbox();

      el("cfgPanel", { querySelectorAll() { return []; } });
      el("templateSelect", { value: "lyso", dataset: { lysoKeep: "1" } });
      el("gridScalerOuter", { style: {} });
      el("lysoApiWrap", { style: {} });
      const img = el("lysoApiImage", { src: "" });
      el("lasoWrap", { style: {} });
      el("gt", { value: "nu" });
      el("gio", { value: "14:30" });
      el("ngayDL", { value: "20" });
      el("thangDL", { value: "3" });
      el("namDL", { value: "1988" });
      el("hoTen", { value: "User" });
      const namXem = el("namXem", { dataset: { val: "2026" }, textContent: "2026" });
      el("ngay", { value: "1" });
      el("thang", { value: "1" });
      el("nam", { value: "1988" });
      el("dlResult", { textContent: "" });

      ["ngayDL", "thangDL", "namDL"].forEach((id) => {
        const node = sandbox.document.getElementById(id);
        if (node) node.addEventListener = () => {};
      });

      loadThemeAndTabs(sandbox);
      sandbox.applyTemplate("lyso");

      const srcAfterFirst = img.src;
      assert.ok(srcAfterFirst.includes("/2026/"));

      namXem.dataset.val = "2035";
      namXem.textContent = "2035";
      sandbox.refreshLysoImageForNamXem();

      assert.ok(img.src.includes("/2035/"));
      assert.notEqual(img.src, srcAfterFirst);
    },
  },
];

function makeTabBtn() {
  const classes = new Set();
  return {
    classList: {
      toggle(name, on) {
        if (on) classes.add(name);
        else classes.delete(name);
      },
      contains(name) {
        return classes.has(name);
      },
    },
  };
}

function makeField() {
  return { style: {} };
}
