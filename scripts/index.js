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
    vm.goto = _goto;
    vm.removeImage = _remove;
    vm.add = _add;
    vm.addBookmark = _addBookmark;

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
          // Maybe explain that to the user too?
        } else {
          setup();
        }
      });
    }
  }

})();