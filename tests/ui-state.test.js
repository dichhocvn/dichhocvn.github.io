const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { assert } = require("./test-lib");

const ROOT = path.resolve(__dirname, "..");

function makeEl() {
  const classes = new Set();
  return {
    style: {},
    dataset: {},
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

module.exports = [
  {
    name: "ui-state: switchTab toggles AL/DL/SEARCH panels correctly",
    fn: () => {
      const els = {
        formWrap: makeEl(),
        cfgPanel: makeEl(),
        searchPanel: makeEl(),
        tabAL: makeEl(),
        tabDL: makeEl(),
        tabSEARCH: makeEl(),
        tabCFG: makeEl(),
      };
      const alFields = [makeEl(), makeEl()];
      const dlFields = [makeEl(), makeEl()];
      let convertDLCalls = 0;
      let initSearchCalls = 0;
      let syncPlacementCalls = 0;

      const context = {
        window: {},
        document: {
          getElementById(id) {
            return els[id] || null;
          },
          querySelectorAll(selector) {
            if (selector === ".al-field") return alFields;
            if (selector === ".dl-field") return dlFields;
            return [];
          },
        },
        convertDL() {
          convertDLCalls++;
        },
        initSearchTab() {
          initSearchCalls++;
        },
        syncSearchResultPlacement() {
          syncPlacementCalls++;
        },
      };
      context.window = context;

      const code = fs.readFileSync(path.join(ROOT, "src/js/features/tab-switching.js"), "utf8");
      vm.runInNewContext(code, context, { filename: "tab-switching.js" });

      context.switchTab("DL");
      assert.equal(els.formWrap.style.display, "");
      assert.equal(alFields[0].style.display, "none");
      assert.equal(dlFields[0].style.display, "");
      assert.equal(els.cfgPanel.style.display, "none");
      assert.equal(els.searchPanel.style.display, "none");
      assert.equal(convertDLCalls, 1);
      assert.equal(els.tabDL.classList.contains("tab-active"), true);

      context.switchTab("SEARCH");
      assert.equal(els.formWrap.style.display, "none");
      assert.equal(els.searchPanel.style.display, "block");
      assert.equal(initSearchCalls, 1);
      assert.equal(els.tabSEARCH.classList.contains("tab-active"), true);
      assert.ok(syncPlacementCalls >= 2);
    },
  },
  {
    name: "ui-state: lapLaSo clears search results outside SEARCH tab",
    fn: () => {
      const els = {
        hoTen: { value: "Test User" },
        ngay: { value: "5" },
        thang: { value: "9" },
        nam: { value: "1993" },
        gio: { value: "04:00" },
        gt: { value: "nam" },
        err: { style: {}, textContent: "" },
        grid: makeEl(),
        lasoWrap: { style: { display: "none" }, scrollIntoView() {} },
      };

      let clearCalls = 0;
      const context = {
        window: {
          _currentTab: "AL",
          _searchResults: [{ id: 1 }],
        },
        document: {
          getElementById(id) {
            return els[id] || null;
          },
        },
        TUVI_LOGIC: {
          compute() {
            return { meta: {}, cung: [] };
          },
        },
        TUVI_RENDER: {
          render() {},
        },
        clearSearchResultsState() {
          clearCalls++;
          context.window._searchResults = [];
        },
        updateChatInfo() {},
        scaleGrid() {},
        applyResponsiveLayout() {},
        requestAnimationFrame(fn) {
          fn();
        },
      };
      context._searchResults = context.window._searchResults;

      const code = fs.readFileSync(path.join(ROOT, "src/js/app/controller-core.js"), "utf8");
      vm.runInNewContext(code, context, { filename: "controller-core.js" });

      context.lapLaSo();
      assert.equal(clearCalls, 1);
      assert.equal(context.window._searchResults.length, 0);
    },
  },
];

