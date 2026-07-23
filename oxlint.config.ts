import { defineConfig } from "oxlint";
import { REACT_NATIVE_RULES, RECOMMENDED_RULES } from "oxlint-plugin-react-doctor";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "react", "react-perf", "import", "promise"],
  jsPlugins: [
    {
      name: "react-doctor",
      specifier: "oxlint-plugin-react-doctor",
    },
  ],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  env: {
    builtin: true,
  },
  settings: {
    react: {
      version: "19.2.3",
    },
  },
  rules: {
    ...RECOMMENDED_RULES,
    ...REACT_NATIVE_RULES,
    "react-doctor/js-tosorted-immutable": "off",
    "react/react-in-jsx-scope": "off",
    "react/style-prop-object": "off",
    "react-perf/jsx-no-new-array-as-prop": "off",
    "react-perf/jsx-no-new-function-as-prop": "off",
    "react-perf/jsx-no-new-object-as-prop": "off",
    "unicorn/no-array-sort": ["warn", { allowAfterSpread: true }],
  },
});
