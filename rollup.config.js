/* eslint-disable no-unused-vars */
import pkg from "./package.json"
import * as path from "path"
import { terser } from "rollup-plugin-terser"
import pluginCommonjs from "@rollup/plugin-commonjs"
import pluginNodeResolve from "@rollup/plugin-node-resolve"
import { babel } from "@rollup/plugin-babel"
import strip from "@rollup/plugin-strip"
const camelize = (str) => {
  return str.replace(/[\s-_]([a-z])/g, (_all, letter) => letter.toUpperCase())
}

// eslint-disable-next-line no-undef
const isDev = process.env.NODE_ENV === "development"
const moduleName = pkg.name.replace(/^@.*\//, "")
const inputFileName = "src/index.js"
const author = pkg.author
const banner = `
  /**
   * @license
   * author: ${author}
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`
const esm = [
  {
    input: inputFileName,
    output: {
      file: pkg.module,
      format: "es",
      sourcemap: isDev ? true : "inline",
      banner,
      exports: "named",
    },
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginCommonjs({
        extensions: [".js"],
      }),
      babel({
        babelHelpers: "bundled",
        // eslint-disable-next-line no-undef
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
      strip(),
      isDev ? null : terser(),
    ],
  },
]
const cjs = [
  {
    input: inputFileName,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: "inline",
      banner,
      exports: "named",
    },
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginCommonjs({
        extensions: [".js"],
      }),
      babel({
        babelHelpers: "bundled",
        // eslint-disable-next-line no-undef
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
      strip(),
      terser(),
    ],
  },
]

const iife = [
  {
    input: inputFileName,
    output: [
      {
        name: camelize(moduleName),
        file: pkg.browser,
        format: "iife",
        sourcemap: "inline",
        banner,
      },
      {
        name: camelize(moduleName),
        file: pkg.browser.replace("js", "min.js"),
        format: "iife",
        sourcemap: "inline",
        banner,
      },
    ],
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginCommonjs({
        extensions: [".js"],
      }),
      babel({
        babelHelpers: "bundled",
        // eslint-disable-next-line no-undef
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: true,
      }),
      strip(),
      terser(),
    ],
  },
]
export default isDev ? esm : esm.concat(cjs, iife)
