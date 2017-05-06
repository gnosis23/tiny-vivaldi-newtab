// see http://stackoverflow.com/a/15732476/913334
(function () {
  'use strict';

  var module = angular.module('app');

  module.directive('ngRightClick', ngRightClick);

  ngRightClick.$inject = ['$parse'];

  function ngRightClick($parse) {
    var directive = {
      link: link,
      scope: {
        ngRightClick: '&',
        source: '='
      },
    };
    return directive;

    function link(scope, element, attrs) {
      var fn = scope.ngRightClick;
      element.bind('contextmenu', function (event) {
        scope.$apply(function () {
          event.preventDefault();
          fn && fn({ $event: event, item: scope.source });
        })
      })
    }
  }
})();