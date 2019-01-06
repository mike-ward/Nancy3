import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';
import postcss from 'rollup-plugin-postcss'
import sucrase from 'rollup-plugin-sucrase';
import { terser } from "rollup-plugin-terser";
//import serve from 'rollup-plugin-serve';
//import livereload from 'rollup-plugin-livereload';
import fileSize from 'rollup-plugin-filesize';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'app.ts',
  output: {
    name: 'App',
    file: '../wwwroot/content/app.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve({
      extensions: ['.js', '.ts']
    }),
    commonjs(),
    includePaths({
      paths: ['./'],
      extensions: ['.js']
    }),
    postcss({
      extract: true,
      minimize: true
    }),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript']
    }),
    production && terser(),
    //!production && serve('dist'), // index.html should be in root of project
    //!production && livereload(),
    fileSize()
  ],
  watch: {
    clearScreen: true
  }
};