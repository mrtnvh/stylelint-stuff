import stylelint from "stylelint";
import type { Rule, PostcssResult } from "stylelint";
import type { Container, ChildNode, Declaration } from "postcss";

import { ruleMeta, ruleName, ruleMessages as messages } from "./base.js";

const {
  createPlugin,
  utils: { report, validateOptions },
} = stylelint;

function traverseParentRules(parent: Container<ChildNode> | undefined) {
  if (!parent?.parent) return false;
  if (parent.parent.type === "root") return false;

  // @ts-ignore
  if (parent.parent.type === "atrule" && parent.parent.name === "layer") {
    return true;
  }

  // @ts-ignore
  return traverseParentRules(parent.parent);
}

function testIfWrappedInLayer(decl: Declaration, result: PostcssResult) {
  const parent = decl.parent;
  if (!parent) return;
  const isWrappedInLayerAtRule = traverseParentRules(parent);

  // Do not require font-face to be layered
  // @ts-ignore
  if (/font\-face/.test(parent.name)) return;

  if (!isWrappedInLayerAtRule) {
    const name = (() => {
      switch (parent.type) {
        case "atrule":
        case "root":
          // @ts-ignore
          return parent.name;
        default:
          // @ts-ignore
          return parent.selector;
      }
    })();

    report({
      message: messages.cascadeLayers(parent.type, name),
      node: parent,
      result,
      ruleName,
    });
  }
}

const ruleFunction: Rule = (primary, secondaryOptions, options) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls((decl) => testIfWrappedInLayer(decl, result));
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = ruleMeta;

export default createPlugin(ruleName, ruleFunction);
