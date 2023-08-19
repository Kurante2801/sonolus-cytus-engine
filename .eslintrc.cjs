module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
	},
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"prettier",
	],
	rules: {
		"prettier/prettier": "error",
		"no-empty-function": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
	},
};
