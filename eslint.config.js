import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                app: "readonly",
                db: "readonly",
                API_BASE_URL: "readonly",
                currentUser: "writable",
                firebase: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["warn", { "vars": "all", "args": "none" }],
            "no-undef": "warn"
        }
    }
];
