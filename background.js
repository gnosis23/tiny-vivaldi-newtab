// global events
console.log("--------------------HELLO----------------------")


const storage = chrome.storage.local;

function tabsGetAsync(tabId) {
  return new Promise((resolve, reject) => 
    chrome.tabs.get(tabId, function (tab) {
      resolve(tab);
    })
  )
}

function storageGetAsync(baseUrl) {
  return new Promise((resolve, reject) => 
    chrome.storage.local.get(baseUrl, function (result) {      
      if (chrome.runtime.lastError) {        
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(result);
      }
    })
  )
}

function storageGetBytesInUseAsync(baseUrl) {
  return new Promise((resolve, reject) => 
    chrome.storage.local.getBytesInUse(baseUrl, function (bytesInUse) {
      resolve(bytesInUse);
    })
  )
}

function tabsCaptureVisibleTabAsync() {
  return new Promise((resolve, reject) =>
    chrome.tabs.captureVisibleTab(function (screenshotUrl) {
      resolve(screenshotUrl);
    })
  )
}

chrome.tabs.onUpdated.addListener(function (tabId, changedProps) {
  if (changedProps.status !== "complete")
    return;

  (async function () {
    try {
      const tab = await tabsGetAsync(tabId);
      if (!/^https?.*/.test(tab.url))
        return;

      let groups = tab.url.split('/');
      const baseUrl = `${groups[2]}`;

      const result = await storageGetAsync(baseUrl);
      if (result[baseUrl]) {
        const bytesInUse = await storageGetBytesInUseAsync(baseUrl);
        console.log(`GET ${baseUrl}: ${bytesInUse} bytes`);
        return;
      }

      const screenshotUrl = await tabsCaptureVisibleTabAsync();
      
      console.log(baseUrl + ' screenshot ready');
      let object = {};
      object[baseUrl] = screenshotUrl;
      storage.set(object);
    } catch (err) {

    }
  })();

});