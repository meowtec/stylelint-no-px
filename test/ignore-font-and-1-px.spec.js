import {messages, ruleName} from "../lib/index.js";

testRule({
    ruleName,
    config: [true, {ignore: ['1px', 'font', '5px']}],

    accept: [
        {code: '.foo { border-left: 1px solid #333; padding: 5px; }'},
        {code: '.foo { font-size: 15px; }'},
        {code: '.foo { font-size: 1px; }'},
    ],

    reject: [
        {
            code: '@width: 1;\n.foo { border-width: ~\'@{width}px solid #333\'; }',
            message: messages.rem(),
            line: 2,
            column: 8,
        },
        {
            code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
            message: messages.rem(),
            line: 1,
            column: 1,
        },
        {
            code: '.foo { padding: 50px; }',
            message: messages.rem(),
            line: 1,
            column: 8,
        },
    ],
})
