/**
 * bohao bookmarks
 * 
 */

(function () {
  'use strict';

  function chromeBookmarksGetChildrenAsync(id) {
    return new Promise(function (resolve, reject) {
      chrome.bookmarks.getChildren("1", function (nodes) {
        return resolve(nodes.filter(x => x.url));
      });
    })
  }

  function baseurl(url) {
    const groups = url.split('/');
    return groups[2];
  }

  var module = angular.module('app', []);

  module.controller('TabCtrl', [
    '$scope',
    function ($scope) {
      $scope.bookmarks = [];
      let _imageBuf = {};

      $scope.goto = function (url) {
        chrome.tabs.create({ url: url })
      }

      // Init
      chromeBookmarksGetChildrenAsync("1").then(function (data) {
        $scope.$apply(function () {
          $scope.bookmarks = data;          
        })
      });

      chrome.storage.local.get(null, function(result) {
        $scope.$apply(function() {
          _imageBuf = result;
          $scope.bookmarks = $scope.bookmarks.map(x => {
            x.image = _imageBuf[baseurl(x.url)] || "";
            return x;
          })
        })
      })
    }
  ]);

})();