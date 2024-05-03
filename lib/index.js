import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

export const ruleName = 'meowtec/no-px';

export const meta = {
  fixable: true,
};

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rem(remSize) {
    if (remSize) {
      return `Use rem instead of px. 'px' values have been converted to 'rem'.`;
    }
    return `Use rem instead of px. To enable automatic conversion, set the 'remSize' option in the plugin settings.`;
  },
});

const defaultSecondaryOptions = {
  ignore: ['1px'],
  remSize: null,
};

function convertPxToRem(pxValue, baseSize) {
  const numericValue = parseFloat(pxValue.replace('px', ''));
  return `${(numericValue / baseSize).toFixed(5).replace(/\.?0+$/, '')}rem`;
}

function propInIgnoreList(prop, list) {
  return prop && list.some(item => {
    return prop.indexOf(item) > -1;
  });
}

function propAddXpxInIgnoreList(prop, list, px) {
  const reg = new RegExp('\\s' + px);
  return prop && list.some(item => {
    return reg.test(item) && prop.indexOf(item.replace(reg, '')) > -1;
  });
}

function hasForbiddenPX(node, {ignore = defaultSecondaryOptions.ignore, remSize = null, ignoreFunctions = []}) {
  const type = node.type;
  const value = type === 'decl' ? node.value : node.params;
  const prop = type === 'decl' ? node.prop : null;

  const parsed = valueParser(value);
  let hasPX = false;

  if (type === 'atrule' && node.name === 'media') return;
  if (type === 'decl' && propInIgnoreList(node.prop, ignore)) return;

  for (const valueNode of parsed.nodes) {
    if (
        valueNode.type === 'function' &&
        (valueNode.value === 'url' || ignoreFunctions.indexOf(valueNode.value) > -1)
    ) {
      return false;
    }

    let matched;
    if (valueNode.type === 'word' && (matched = valueNode.value.match(/^([-,+]?\d+(\.\d+)?px)$/))) {
      const px = matched[1];

      if (px === '0px') {
        return;
      }

      if (!propAddXpxInIgnoreList(prop, ignore, px) && ignore.indexOf(px) === -1) {
        if (remSize) {
          valueNode.value = convertPxToRem(px, remSize);
        }
        hasPX = true;
      }
    } else if (valueNode.type === 'string' && /(@\{[\w-]+\})px\b/.test(valueNode.value)) {
      if (remSize) {
        valueNode.value = convertPxToRem(valueNode.value, remSize);
      }
      hasPX = true;
    }
  }

  node.value = valueParser.stringify(parsed.nodes);

  return hasPX;
}

function processValueNodes(nodes, prop, options) {
  let hasPx = false;

  for (const valueNode of nodes) {
    if (
        valueNode.type === 'function'
    ) {
      if (valueNode.value === 'url' || options.ignoreFunctions.indexOf(valueNode.value) > -1) {
        continue;
      }

      hasPx ||= processValueNodes(valueNode.nodes, prop, options);
    }

    let matched;
    if (valueNode.type === 'word' && (matched = valueNode.value.match(/^([-,+]?\d+(\.\d+)?px)$/))) {
      const px = matched[1];

      if (px === '0px') {
        continue;
      }

      if (!propAddXpxInIgnoreList(prop, options.ignore, px) && options.ignore.indexOf(px) === -1) {
        if (options.remSize) {
          valueNode.value = convertPxToRem(px, options.remSize);
        }
        hasPx = true;
      }
    } else if (valueNode.type === 'string' && /(@\{[\w-]+\})px\b/.test(valueNode.value)) {
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
    newValue: valueParser.stringify(parsed.nodes),
    hasPx,
  };
}

function processDeclaration(declaration, options) {
  if (propInIgnoreList(declaration.prop, options.ignore)) {
    return;
  }

  const {newValue, hasPx} = processValue(declaration.value, declaration.prop, options);

  declaration.value = newValue;

  return hasPx;
}

function processAtRule(atRule, options) {
  if (atRule.type === 'atrule' && atRule.name === 'media') {
    return;
  }

  const {newValue, hasPx} = processValue(atRule.params, null, options);

  atRule.params = newValue;

  return hasPx;
}

function ruleFunction(primaryOption, secondaryOptionObject, context) {
  primaryOption = primaryOption || '';

  return (root, result) => {
    if (!primaryOption) return;

    const {ignore = defaultSecondaryOptions.ignore, remSize = null, ignoreFunctions = []} = secondaryOptionObject || defaultSecondaryOptions;

    secondaryOptionObject = {ignore, remSize, ignoreFunctions};

    root.walkDecls(declaration => {
      if (processDeclaration(declaration, secondaryOptionObject) && !context.fix) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: declaration,
          message: messages.rem(secondaryOptionObject.remSize),
        });
      }
    });

    root.walkAtRules(atRule => {
      if (processAtRule(atRule, secondaryOptionObject) && !context.fix) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: atRule,
          message: messages.rem(secondaryOptionObject.remSize),
        });
      }
    });
  }
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
