import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

export const ruleName = "meowtec/no-px";

export const meta = {
  fixable: true,
};

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rem(remSize) {
    if (remSize) {
      return `Use rem instead of px.`;
    }
    return `Use rem instead of px. To enable automatic conversion, set the 'remSize' option in the plugin settings.`;
  },
});

const defaultSecondaryOptions = {
  ignore: ["1px"],
  remSize: null,
};

function convertPxToRem(pxValue, baseSize) {
  const numericValue = parseFloat(pxValue.replace("px", ""));
  return `${(numericValue / baseSize).toFixed(5).replace(/\.?0+$/, "")}rem`;
}

function propInIgnoreList(prop, list) {
  return (
    prop &&
    list.some((item) => {
      return prop.indexOf(item) > -1;
    })
  );
}

function propAddXpxInIgnoreList(prop, list, px) {
  const reg = new RegExp("\\s" + px);
  return (
    prop &&
    list.some((item) => {
      return reg.test(item) && prop.indexOf(item.replace(reg, "")) > -1;
    })
  );
}

function processValueNodes(nodes, prop, options) {
  let hasPx = false;

  for (const valueNode of nodes) {
    if (valueNode.type === "function") {
      if (
        valueNode.value === "url" ||
        options.ignoreFunctions.indexOf(valueNode.value) > -1
      ) {
        continue;
      }

      hasPx ||= processValueNodes(valueNode.nodes, prop, options);
    }

    let matched;
    if (
      valueNode.type === "word" &&
      (matched = valueNode.value.match(/^([-,+]?\d+(\.\d+)?px)$/))
    ) {
      const px = matched[1];

      if (px === "0px") {
        continue;
      }

      if (
        !propAddXpxInIgnoreList(prop, options.ignore, px) &&
        options.ignore.indexOf(px) === -1
      ) {
        if (options.remSize) {
          valueNode.value = convertPxToRem(px, options.remSize);
        }
        hasPx = true;
      }
    } else if (
      valueNode.type === "string" &&
      /(@\{[\w-]+\})px\b/.test(valueNode.value)
    ) {
      if (options.remSize) {
        valueNode.value = convertPxToRem(valueNode.value, options.remSize);
      }
      hasPx = true;
    }
  }

  return hasPx;
}

function processValue(value, prop, options) {
  const parsed = valueParser(value);
  const hasPx = processValueNodes(parsed.nodes, prop, options);

  return {
    hasPx,
    getFixedValue: () => {
        return valueParser.stringify(parsed.nodes);
    }
  };
}

function processDeclaration(declaration, options) {
  if (propInIgnoreList(declaration.prop, options.ignore)) {
    return { hasPx: false, fixCallback: null };
  }

  const { hasPx, getFixedValue } = processValue(
    declaration.value,
    declaration.prop,
    options,
  );

  const fixCallback = () => {
    declaration.value = getFixedValue();
  };

  return { hasPx, fixCallback };
}

function processAtRule(atRule, options) {
  if (atRule.type === "atrule" && atRule.name === "media") {
    return { hasPx: false, fixCallback: null };
  }

  const { hasPx, getFixedValue } = processValue(atRule.params, null, options);

  const fixCallback = () => {
    const newValue = getFixedValue();

    atRule.params = newValue;
    atRule.value = newValue;
  }

  return { hasPx, fixCallback };
}

function ruleFunction(primaryOption, secondaryOptionObject) {
  primaryOption = primaryOption || "";

  return (root, result) => {
    if (!primaryOption) return;

    const {
      ignore = defaultSecondaryOptions.ignore,
      remSize = null,
      ignoreFunctions = [],
    } = secondaryOptionObject || defaultSecondaryOptions;

    secondaryOptionObject = { ignore, remSize, ignoreFunctions };

    root.walkDecls((declaration) => {
      const { hasPx, fixCallback } = processDeclaration(declaration, secondaryOptionObject);

      if (hasPx) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: declaration,
          message: messages.rem(secondaryOptionObject.remSize),
          fix: fixCallback,
        });
      }
    });

    root.walkAtRules((atRule) => {
      const { hasPx, fixCallback } = processAtRule(atRule, secondaryOptionObject);

      if (hasPx) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: atRule,
          message: messages.rem(secondaryOptionObject.remSize),
          fix: fixCallback,
        });
      }
    });
  };
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
