console.clear()

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const path = require('path');
const express = require('express');
const { spawn } = require('child_process');
const port = require('./get-port');

const webpackConfig = require('../webpack.config');

const compiler = webpack(webpackConfig);
compiler.hooks.done.tap('ProgressPlugin', (context, entry) => {
  console.clear();
  console.log(`\nServer running at : http://localhost:${PORT}\n`);
});

const app = express();

let PORT;

function runDevServer(app, port) {
  app.use(webpackDevMiddleware(compiler, {stats: 'minimal'}));
  app.use(webpackHotMiddleware(compiler));
  app.use('*', (req, res, next) => { // https://github.com/jantimon/html-webpack-plugin/issues/145#issuecomment-170554832
    var filename = path.join(compiler.outputPath,'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  });  
  
  app.listen(port, () => {
    spawn( 'electron', ['.', port], { shell: true, env: process.env, stdio: 'inherit' } )
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError))
  });
};

const main = async () => {
  PORT = await port.getPort().catch(() => { throw Error('fail run')});
  runDevServer(app, PORT);
};
main();