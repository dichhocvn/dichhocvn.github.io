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

function computeFromDlUiInput({ dd, mm, yy, gio, gioiTinh }) {
  const sandbox = buildDlSandbox({ dd, mm, yy, gio });
  sandbox.convertDL();
  return TUVI_LOGIC.compute({
    hoTen: "Solar UI Test",
    ngay: Number.parseInt(sandbox.document.getElementById("ngay").value, 10),
    thang: Number.parseInt(sandbox.document.getElementById("thang").value, 10),
    nam: Number.parseInt(sandbox.document.getElementById("nam").value, 10),
    gioSinh: sandbox.document.getElementById("gio").value,
    gioiTinh,
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
