# stylelint-no-px

![https://travis-ci.org/meowtec/stylelint-no-px](https://travis-ci.org/meowtec/stylelint-no-px.svg?branch=master)

A stylelint custom rule to ensure rem instead of px

If you are using `rem` (instead of `px`) as **1px solution** or for other purposes, you should need a stylelint rule to enforce using rem. Thats it.

```less
width: 10px; // not ok
border: 1px solid #eee; // ok
```

## Installation

```
npm install stylelint-no-px
```

## Usage

Add it to your stylelint config

```javascript
// .stylelintrc
{
  "plugins": [
    "stylelint-no-px"
  ],
  "rules": {
    // ...
    "meowtec/no-px": [true, { "ignore": ["1px", "font"] }],
    // or just:
    "meowtec/no-px": true,
    // ...
  }
}
```

## Options

Use `ignore: string[]` to skip-over value check.

```javascript
"meowtec/no-px": [true, { "ignore": ["1px", "font"] }],
```

```less

.foo {
  height: 1px; // ok
  font-size: 24px; // ok
  padding: 10px; // not ok
}
```