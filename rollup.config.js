// eslint-disable-next-line no-undef
const isDev = process.env.NODE_ENV === "development"
import pkg from "./package.json"
console.log(isDev, "aa")
export default {
  input: "./src/index.js",
  output: {
    file: pkg.browser, // 是打包后的目录
    format: "cjs",
  },
}
