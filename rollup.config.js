import path from 'path';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = process.env.NODE_ENV === 'production';
const development = process.env.NODE_ENV === 'development';

const extensions = ['.ts', '.tsx'];

export default {
  input: 'src/index.ts',

  plugins: [
    copy({
      targets: [
        { src: 'src/*.html', dest: 'dist' },
        { src: 'src/assets', dest: 'dist' }
      ]
    }),
    postcss({
      plugins: [
        autoprefixer,
        cssnano({
          preset: ['default', { discardComments: { removeAll: true } }]
        })
      ],
      extract: 'css/bundle.min.css',
      sourceMap: production ? false : 'inline'
    }),
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
      exclude: ['node_modules/**', 'dist']
    }),
    production && terser(),
    development &&
      serve({
        open: true,
        contentBase: 'dist',
        historyApiFallback: true,
        host: 'localhost',
        port: 3000,
        onListening: function (server) {
          const address = server.address();
          const host = address.address === '::' ? 'localhost' : address.address;
          const protocol = this.https ? 'https' : 'http';

          console.log(
            '\n',
            `Server listening at ${protocol}://${host}:${address.port}/`,
            '\n'
          );
        }
      }),
    development &&
      livereload({
        watch: [path.resolve(__dirname, 'src')],
        exts: ['html', 'ts', 'scss'],
        verbose: false
      })
  ],
  output: {
    dir: 'dist',
    format: 'iife',
    name: 'bundle',
    entryFileNames: 'js/main.min.js'
  }
};
