(function () {
  'use strict';

  var app = angular.module('app');

  app.directive('contextMenu', contextMenu);

  contextMenu.$inject = ['MenuCommandFactory']

  function contextMenu(MenuCommandFactory) {
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: {
        position: '=',        
        showMenu: '=',
        clickOutHandler: '&',
        commandHandler: '&',
      },
      templateUrl: 'views/template/contextMenu.html',
      link: link
    };

    return directive;

    function link(scope, elems, attrs) {
      scope.hideMenu = _hideMenu;
      scope.command = _command;

      setup();

      // implementations
      function _hideMenu() {
        scope.clickOutHandler();
      }

      function setup() {
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

      function _command(name) {
        scope.commandHandler({command: MenuCommandFactory[name]})
      }
    }
  }
})();