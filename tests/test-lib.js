const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");

function loadScript(filePath, exposeNames = []) {
  const code = fs.readFileSync(filePath, "utf8");
  const expose = exposeNames.map((n) => `this.${n} = ${n};`).join("\n");
  vm.runInThisContext(`${code}\n${expose}`, { filename: filePath });
}

loadScript(path.join(ROOT, "src/js/core/data.js"), ["TUVI_DATA"]);
loadScript(path.join(ROOT, "src/js/core/logic.js"), ["TUVI_LOGIC"]);
loadScript(path.join(ROOT, "src/js/features/lunar-calendar.js"), [
  "solar2Lunar",
  "lunar2Solar",
]);

function getAllStars(lasoJson) {
  const stars = [];
  lasoJson.cung.forEach((c) => {
    c.sao.forEach((s) => stars.push({ cung: c, star: s }));
  });
  return stars;
}

module.exports = {
  assert,
  TUVI_DATA,
  TUVI_LOGIC,
  solar2Lunar,
  lunar2Solar,
  getAllStars,
};
