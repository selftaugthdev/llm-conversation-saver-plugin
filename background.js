chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "exportConversation",
      title: "Export LLM Conversation",
      contexts: ["page"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "exportConversation") {
      chrome.tabs.sendMessage(tab.id, {action: "exportConversation"});
    }
  });