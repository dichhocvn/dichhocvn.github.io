const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { assert, solar2Lunar } = require("./test-lib");

const ROOT = path.resolve(__dirname, "..");

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

module.exports = [
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
