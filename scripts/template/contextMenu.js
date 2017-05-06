(function () {
  'use strict';

  var app = angular.module('app');

  app.directive('contextMenu', contextMenu);

  function contextMenu() {
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: {
        position: '=',
        showMenu: '=',
        clickOutHandler: '&'
      },
      templateUrl: 'views/template/contextMenu.html',
      link: link
    };

    return directive;

    function link(scope, elems, attrs) {
      scope.hideMenu = _hideMenu;

      function _hideMenu() {
        scope.clickOutHandler();
      }

      scope.$watch('position', (newValue) => {
        if (newValue) {
          elems[0].style.left = `${newValue.x}px`;
          elems[0].style.top = `${newValue.y}px`;
        }
      })

      elems[0].addEventListener('contextmenu', function (e) {
        e.preventDefault();
      })
    }
  }
})();