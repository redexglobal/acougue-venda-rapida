import * as esbuild from 'esbuild'; import babel from '@babel/core'; import fs from 'fs';
const P = '/Users/macbookair/projetos/acougue-venda-rapida/';
const r = await esbuild.build({ entryPoints: [P + 'tv/app.js'], bundle: true, format: 'iife', target: 'es2017', write: false, minify: false });
let code = r.outputFiles[0].text;
const out = babel.transformSync(code, { babelrc: false, configFile: false, sourceType: 'script',
  presets: [['@babel/preset-env', { targets: { chrome: '38' }, useBuiltIns: 'usage', corejs: '3.39', modules: false }]] });
// core-js entra como require(): empacota de novo para resolver
fs.writeFileSync('tmp-es5.js', fs.readFileSync(new URL('./dom-poly.js', import.meta.url), 'utf8') + '\n' + out.code);
const r2 = await esbuild.build({ entryPoints: ['tmp-es5.js'], bundle: true, format: 'iife', target: 'es5', write: false, minify: true, supported: { 'arrow': false } }).catch(e => { console.error(e.message); process.exit(1); });
fs.writeFileSync(P + 'tv/tv.js', '/* gerado por build da TV (26/11/2026): não editar; fonte em tv/app.js + painel.js */\n' + r2.outputFiles[0].text);
console.log('ok', (r2.outputFiles[0].text.length / 1024).toFixed(0) + ' KB');
