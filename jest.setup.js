import jestPreset from 'jest-preset-stylelint';
import stylelint from 'stylelint';
import plugin from "./lib/index.js";

const { getTestRule, getTestRuleConfigs } = jestPreset;

const loadLint = async () => stylelint.lint;

global.testRule = getTestRule({ loadLint, plugins: [plugin] });
global.testRuleConfigs = getTestRuleConfigs({ loadLint, plugins: [plugin] });
