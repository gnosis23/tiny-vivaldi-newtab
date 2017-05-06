(function () {
  'use strict';

  var app = angular.module('app');

  app.directive('clickOut', clickOut);

  function clickOut() {
    var directive = {
      restrict: 'A',
      scope: {
        clickOut: '&'
      },
      link: link
    };

    return directive;

    function link(scope, elems, attrs) {
      document.addEventListener('click', function (event) {
        if (!elems[0].contains(event.target)) {
          scope.$apply(function() {
            scope.clickOut();
          })          
        }
      })
    }
  }
})();