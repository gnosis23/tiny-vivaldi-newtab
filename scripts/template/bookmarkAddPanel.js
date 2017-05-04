(function () {
  'use strict';

  var module = angular.module('app');

  module.directive('bookmarkAddPanel', bookmarkAddPanel);

  function bookmarkAddPanel() {
    var directive = {
      restrict: 'EA',
      scope: {
        isOpen: '=',
        addBookmark: '&',
      },
      replace: true,
      templateUrl: 'views/template/bookmarkAddPanel.html',
      link: link,
    };
    return directive; 

    function link(scope, elems) {
      scope.isOpen = false;
      scope.add = _add;
      scope.newUrl = '';

      // implementation
      function _add(url) {
        scope.addBookmark({url: url + ''});
        scope.newUrl = '';
      }
    }
  }
})();