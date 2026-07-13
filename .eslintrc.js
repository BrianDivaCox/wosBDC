module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": ["warn", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
        "no-undef": "warn",
        "no-unreachable": "warn",
        "no-constant-condition": "warn"
    }
};
