/**
 * bohao bookmarks
 * 
 */

(function () {
  'use strict';

  // promise chrome api
  function chromeBookmarksGetChildrenAsync(id) {
    return new Promise(function (resolve, reject) {
      chrome.bookmarks.getChildren("1", function (nodes) {
        return resolve(nodes.filter(x => x.url));
      });
    })
  }

  function storageGetAsync(baseUrl) {
    return new Promise((resolve, reject) =>
      chrome.storage.local.get(baseUrl, function (result) {
        resolve(result);
      })
    )
  }

  function baseurl(url) {
    const groups = url.split('/');
    return groups[2];
  }

  // 
  var module = angular.module('app', []);

  module.controller('TabCtrl', TabCtrl);

  TabCtrl.$inject = ['$scope']

  function TabCtrl($scope) {
    var vm = this;
    vm.bookmarks = [];
    vm.panelOpen = false;
    vm.showMenu = false;
    vm.clickPosition = {x:0, y: 0};
    vm.goto = _goto;
    vm.removeImage = _remove;
    vm.add = _add;
    vm.addBookmark = _addBookmark;
    vm.changeName = _changeName;
    vm.openContextMenu = _openContextMenu;
    vm.hideMenu = _hideMenu;

    // Init
    setup();

    /////  Functions
    function setup() {
      let _imageBuf = {};

      chromeBookmarksGetChildrenAsync("1").then(function (data) {
        vm.bookmarks = data;
        return storageGetAsync(null)
      }).then(function (result) {
        $scope.$apply(function () {
          _imageBuf = result;
          vm.bookmarks = vm.bookmarks.map(x => {
            x.image = _imageBuf[baseurl(x.url)] || "";
            x.text = x.title || x.url;;
            return x;
          });
        })
      }).catch(function (err) {
        console.log(err);
      });

    }

    function _remove($event, item) {
      $event.stopPropagation();
      item.image = "";
      let obj = {};
      obj[baseurl(item.url)] = null;
      chrome.storage.local.set(obj);
    }

    function _goto(url) {
      chrome.tabs.create({ url: url })
    }

    function _add() {
      vm.panelOpen = !vm.panelOpen;
    }

    function _addBookmark(url) {
      chrome.bookmarks.create({ 'parentId': "1", 'title': "", 'url': url }, function (result) {
        if (chrome.runtime.lastError) {
          // Something went wrong
          console.warn("Whoops.. " + chrome.runtime.lastError.message);         
        } else {
          setup();
        }
      });
    }

    function _changeName(item) {
      chrome.bookmarks.update(item.id, {"title": item.text}, function(result) {
        if (chrome.runtime.lastError) {
          // Something went wrong
          console.warn("Whoops.. " + chrome.runtime.lastError.message);        
        } else {
          setup();
        }
      })
    }

    function _openContextMenu($event, item) {
      vm.showMenu = true;
      vm.clickPosition = {x: $event.clientX, y: $event.clientY};
    }

    function _hideMenu() {
      vm.showMenu = false;
    }
  }

})();