'use strict'

const stylelint = require('stylelint')
const valueParser = require('postcss-value-parser')
const ruleName = 'meowtec/no-px'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rem() {
    return `Use rem instead of px`
  },
})

const defaultSecondaryOptions = {
  ignore: [ '1px' ]
}

const propInList = (prop, list) => {
  return prop && list.some(item => prop.indexOf(item) > -1)
}

/**
 * check if a value has forbidden `px`
 * @param {string} value
 */
const hasForbiddenPX = (node, options) => {
  const type = node.type
  const value = type === 'decl' ? node.value : node.params

  const parsed = valueParser(value)
  let hasPX = false

  const ignore = options.ignore || defaultSecondaryOptions.ignore
  const ignore1px = ignore.indexOf('1px') > -1

  if (type === 'decl' && propInList(node.prop, ignore)) return

  parsed.walk(node => {
    // if node is `url(xxx)`, prevent the traversal
    if (node.type === 'function' && node.value === 'url') {
      return false
    }

    let matched
    if (node.type === 'word' && (matched = node.value.match(/^(\d+(\.\d+)?)px$/))) {
      const px = matched[1]

      if (px === '0') {
        return
      }

      if (px !== '1' || !ignore1px) {
        hasPX = true
      }
    } else if (node.type === 'string' && /(@\{[\w-]+\})px\b/.test(node.value)) {
      // eg. ~'@{width}px'
      hasPX = true
    }
  })

  return hasPX
}

module.exports = stylelint.createPlugin(ruleName, (primaryOption, secondaryOptionObject) => {
  primaryOption = primaryOption || ''

  return (root, result) => {
    if (!primaryOption) return

    secondaryOptionObject = secondaryOptionObject || defaultSecondaryOptions

    // const validOptions = stylelint.utils.validateOptions({
    //   ruleName: ruleName,
    //   result: result,
    //   actual: primaryOption,
    // })

    // if (!validOptions) {
    //   return
    // }

    root.walkDecls(declaration => {
      if (hasForbiddenPX(declaration, secondaryOptionObject)) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: declaration,
          message: messages.rem(),
        })
      }
    })

    root.walkAtRules(atRule => {
      if (hasForbiddenPX(atRule, secondaryOptionObject)) {
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
