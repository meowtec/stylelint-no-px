import { ruleName } from "../lib/index.js";

testRule({
  ruleName,
  config: false,

  accept: [
    {
      code: ".foo { padding: 20px; }",
    },
    {
      code: "@width: 10px;\n.foo { border-width: @width * 2 solid #333; }",
    },
  ],
});
