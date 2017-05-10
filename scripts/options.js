// Saves options to chrome.storage
function save_options() {
  var tab = document.getElementById('newTab').value;  
  chrome.storage.local.set({
    options: {newTab: tab}
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = '保存成功';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    options: {newTab: 'open'}
  }, function(items) {
    document.getElementById('newTab').value = items.options.newTab;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);