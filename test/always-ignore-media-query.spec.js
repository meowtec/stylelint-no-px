import {ruleName, messages} from "../lib/index.js";

testRule({
    ruleName,
    config: [true, {ignore: []}],

    accept: [
        {
            code: '.a { @media screen and (max-width: 370px) {} }',
        },
    ],

    reject: [
        {
            code: '.a { \n@media screen and (max-width: 370px) { \npadding: 10px; } }',
            message: messages.rem(),
            line: 3,
            column: 1,
            endLine: 3,
            endColumn: 15,
        },
    ],
});

