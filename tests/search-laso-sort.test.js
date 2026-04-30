const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { assert } = require("./test-lib");

const ROOT = path.resolve(__dirname, "..");

function loadCompareFn() {
  const context = {
    window: {},
    document: {},
  };
  context.window = context;
  const code = fs.readFileSync(path.join(ROOT, "src/js/features/search-laso.js"), "utf8");
  vm.runInNewContext(code, context, { filename: "search-laso.js" });
  return context._compareSearchResultRank;
}

module.exports = [
  {
    name: "search-sort: tie catKhiScore prefers larger cat-hung delta",
    fn: () => {
      const compare = loadCompareFn();
      const a = { catKhiScore: 70, catCountTarget: 6, hungCountTarget: 3, solar: { dd: 30, mm: 4, yy: 2026 } };
      const b = { catKhiScore: 70, catCountTarget: 5, hungCountTarget: 3, solar: { dd: 29, mm: 4, yy: 2026 } };
      assert.ok(compare(a, b) < 0);
    },
  },
  {
    name: "search-sort: when score and delta tie keeps date order",
    fn: () => {
      const compare = loadCompareFn();
      const a = { catKhiScore: 70, catCountTarget: 5, hungCountTarget: 2, solar: { dd: 29, mm: 4, yy: 2026 } };
      const b = { catKhiScore: 70, catCountTarget: 5, hungCountTarget: 2, solar: { dd: 30, mm: 4, yy: 2026 } };
      assert.ok(compare(a, b) < 0);
    },
  },
];
