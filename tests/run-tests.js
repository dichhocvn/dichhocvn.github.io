#!/usr/bin/env node
const suites = [
  ...require("./calendar.test"),
  ...require("./date-validation.test"),
  ...require("./logic.test"),
  ...require("./stars.test"),
  ...require("./search-laso-counts.test"),
  ...require("./ui-state.test"),
  ...require("./laso-flow.test"),
];

for (const t of suites) {
  try {
    t.fn();
    console.log(`PASS ${t.name}`);
  } catch (err) {
    console.error(`FAIL ${t.name}`);
    console.error(err.stack || err.message || err);
    process.exitCode = 1;
  }
}

if (!process.exitCode) console.log("All tests passed.");
