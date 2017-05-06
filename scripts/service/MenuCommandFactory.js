(function () {
  'use strict';

  var app = angular.module('app');

  app.factory('MenuCommandFactory', MenuCommandFactory);

  function MenuCommandFactory() {
    return {
      open: open,
      openInNewTabActive: openInNewTabActive,
    }

    function open(bookmark) {
      chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, function (tabs) {
        if (tabs.length > 0)
          chrome.tabs.update(tabs[0].id, { url: bookmark.url });
      });
    }

    function openInNewTabActive(bookmark) {
      chrome.tabs.create({ url: bookmark.url, active: true })
    }
  }

})();