import {ruleName, messages} from "../lib/index.js";

testRule({
    ruleName,
    config: [true, {ignore: []}],

    accept: [],

    reject: [
        {
            code: '.foo { border-left: 1px solid #333; }',
            message: messages.rem(null),
            line: 1,
            column: 8,
            endLine: 1,
            endColumn: 36,
        },
        {
            code: '@width: 1;\n.foo { border-width: ~\'@{width}px solid #333\'; }',
            message: messages.rem(null),
            line: 2,
            column: 8,
            endLine: 2,
            endColumn: 47,
        },
        {
            code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
            message: messages.rem(null),
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 14,
        },
    ],
});
