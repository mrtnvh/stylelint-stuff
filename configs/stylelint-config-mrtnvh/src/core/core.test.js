const { resolve } = require("node:path");
const { describe, test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const config = require("./core");
const fs = require("fs");
const stylelint = require("stylelint");

describe("core", () => {
  describe("flags no warnings with valid css", () => {
    const validCss = fs.readFileSync(resolve(__dirname, "./core.valid.css"), "utf-8");
    let result;

    beforeEach(async () => {
      result = await stylelint.lint({
        code: validCss,
        config,
      });
    });

    test("did not error", () => {
      assert.equal(result.errored, false);
    });

    test("flags no warnings", () => {
      assert.equal(result.results[0].warnings.length, 0);
    });
  });

  describe("flags warnings with invalid css", () => {
    const invalidCss = fs.readFileSync(resolve(__dirname, "./core.invalid.css"), "utf-8");
    let result;

    beforeEach(async () => {
      result = await stylelint.lint({
        code: invalidCss,
        config,
      });
    });

    test("did error", () => {
      assert.equal(result.errored, true);
    });

    test("flags warnings", () => {
      assert.equal(result.results[0].warnings.length, 123);
    });

    test("correct warning text", async () => {
      const { default: assertSnapshot } = await import("snapshot-assertion");
      await assertSnapshot(
        JSON.stringify(result.results[0].warnings.map((w) => w.text)),
        resolve(__dirname, "./__snapshots__/core.test.js/correct-warning-text.json")
      );
    });

    test("correct rule flagged", async () => {
      const { default: assertSnapshot } = await import("snapshot-assertion");
      await assertSnapshot(
        JSON.stringify(result.results[0].warnings.map((w) => w.rule)),
        resolve(__dirname, "./__snapshots__/core.test.js/correct-rule-flagged.json")
      );
    });

    test("correct severity flagged", () => {
      assert.equal(result.results[0].warnings[0].severity, "error");
    });

    test("correct line number", () => {
      assert.equal(result.results[0].warnings[0].line, 395);
    });

    test("correct column number", () => {
      assert.equal(result.results[0].warnings[0].column, 15);
    });
  });

  describe("deprecated rules", () => {
    const deprecatedRuleNames = Object.values(stylelint.rules)
      .filter((rule) => rule.meta.deprecated)
      .map((rule) => rule.ruleName);

    const testFn = deprecatedRuleNames.length === 0 ? test.skip : test;

    testFn("exclude deprecate rules", () => {
      // eslint-disable-next-line jest/no-standalone-expect -- If not using `it` directly, false positives occur.
      const includesDeprecatedRule = deprecatedRuleNames.some((ruleName) =>
        Object.keys(config.rules).includes(ruleName)
      );
      assert.equal(includesDeprecatedRule, false);
    });
  });
});
