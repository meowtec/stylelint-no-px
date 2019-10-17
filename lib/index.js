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
  ignore: ['1px']
}

const propInIgnoreList = (prop, list) => {
  return prop && list.some(item => {
    return prop.indexOf(item) > -1
  })
}

const propAddXpxInIgnoreList = (prop, list, px) => {
  const reg = new RegExp('\\s' + px)

  return prop && list.some(item => {
    return reg.test(item) && prop.indexOf(item.replace(reg, '')) > -1
  })
}

/**
 * check if a value has forbidden `px`
 */
const hasForbiddenPX = (node, options) => {
  const type = node.type
  const value = type === 'decl' ? node.value : node.params
  const prop = type === 'decl' ? node.prop : null

  const parsed = valueParser(value)
  let hasPX = false

  const ignore = options.ignore || defaultSecondaryOptions.ignore
  const ignoreFunctions = options.ignoreFunctions || []

  if (type === 'atrule' && node.name === 'media') return

  if (type === 'decl' && propInIgnoreList(node.prop, ignore)) return

  parsed.walk(node => {
    // if node is `url(xxx)`, prevent the traversal
    if (
      node.type === 'function' &&
      (
        node.value === 'url' ||
        ignoreFunctions.indexOf(node.value) > -1
      )
    ) {
      return false
    }

    // console.log('[[[node >>>]]]', node, '[[[<<< node]]]')

    let matched
    if (node.type === 'word' && (matched = node.value.match(/^([-,+]?\d+(\.\d+)?px)$/))) {
      const px = matched[1]

      if (px === '0px') {
        return
      }

      if (
        !propAddXpxInIgnoreList(prop, ignore, px) &&
        ignore.indexOf(px) === -1
      ) {
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
