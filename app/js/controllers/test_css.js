'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function TestCssCtrl() {
	console.log('TestCssCtrl')
  
}

controllersModule.controller('TestCssCtrl', TestCssCtrl);
