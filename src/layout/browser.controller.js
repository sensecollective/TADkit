(function() {
	'use strict';
	angular
		.module('TADkit')
		.controller('BrowserController', BrowserController);

	function BrowserController ($scope, initialData){
		console.log(initialData);
	}
})();