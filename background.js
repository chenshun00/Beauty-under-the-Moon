'use strict'

let develop_tools_id = null;

function showPage(tab) {
    if (develop_tools_id) {
        chrome.tabs.update(develop_tools_id, {
            active: true
        });
    } else {
        chrome.tabs.create({
                url: 'src/index.html',
                selected: true
            },
            function (tab) {
                develop_tools_id = tab.id;
            })
    }
}

chrome.action.onClicked.addListener(function (tab) {
    showPage(tab)
})

chrome.tabs.onRemoved.addListener(function (tabId) {
    if (tabId === develop_tools_id) {
        develop_tools_id = null;
    }
});
