// import 'core-js/stable' // IE polyfill

require('../src/main');
require('../src/renderer');

if(module.hot) {
  module.hot.accept();
}