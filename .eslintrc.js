module.exports = {
  "extends": "airbnb",
	"rules": {
    "max-len": [1, 120, 2, {ignoreComments: true}],
    "no-unused-vars": [1, {"vars": "local", "args": "none"}],
    "default-case": 0,
		"one-var": [1],
		"no-use-before-define": [1],
		"no-tabs": [0],
		"no-shadow": [1],
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jasmine": true
  },
};
