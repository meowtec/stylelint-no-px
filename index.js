const stylelint = require('stylelint')
const valueParser = require('postcss-value-parser')
const ruleName = 'hm/prefer-rem'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rem() {
    return `Use rem instead of px`
  },
})

/**
 * check if a value has forbidden `px`
 * @param {string} value
 */
const hasForbiddenPX = value => {
  const parsed = valueParser(value)
  let hasPx = false

  parsed.walk(node => {
    // if node is `url(xxx)`, prevent the traversal
    if (node.type === 'function' && node.value === 'url') {
      return false
    }

    let matched
    if (node.type === 'word' && (matched = node.value.match(/^(\d+(\.\d+)?)px$/))) {
      // eg. 10px
      const px = matched[1]
      if (px !== '1') {
        hasPx = true
      }
    } else if (node.type === 'string' && /(@\{[\w-]+\})px\b/.test(node.value)) {
      // eg. ~'@{width}px'
      hasPx = true
    }
  })

  return hasPx
}

module.exports = stylelint.createPlugin(ruleName, (options) => {
  options = options || ''

  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions({
      ruleName: ruleName,
      result: result,
      actual: options,
    })

    if (!validOptions) {
      return
    }

    root.walkDecls(declaration => {
      if (hasForbiddenPX(declaration.value)) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: declaration,
          message: messages.rem(),
        })
      }
    })

    root.walkAtRules(atRule => {
      if (hasForbiddenPX(atRule.params)) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: atRule,
          message: messages.rem(),
        })
      }
    })
  }
})

module.exports.ruleName = ruleName
module.exports.messages = messages
