(function() {
	'use strict';
	angular
		.module('TADkit')
		.controller('PanelInfoboxController', PanelInfoboxController);

	function PanelInfoboxController($scope) {
		$scope.species = $scope.current.dataset.object.species;
		$scope.region = $scope.current.dataset.object.region;
	}
})();