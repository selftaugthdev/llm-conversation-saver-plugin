const LLM_CONFIGS = {
    'chat.openai.com': {
      container: '.flex.flex-col.items-center.text-sm',
      messageSelector: '.text-base',
      userClass: '.dark\\:bg-gray-800',
      assistantClass: '.dark\\:bg-gray-700',
    },
    'claude.ai': {
      container: '.flex.flex-col.items-center.text-sm',
      messageSelector: '.text-base',
      userClass: '.bg-white',
      assistantClass: '.bg-gray-100',
    },
  };
  
  function detectLLMPlatform() {
    const hostname = window.location.hostname;
    return LLM_CONFIGS[hostname] || null;
  }
  
  function extractConversation() {
    const config = detectLLMPlatform();
    if (!config) {
      console.error('Unsupported LLM platform');
      return null;
    }
  
    const container = document.querySelector(config.container);
    if (!container) return null;
  
    const messages = container.querySelectorAll(config.messageSelector);
    return Array.from(messages).map(msg => ({
      role: msg.closest(config.userClass) ? 'user' : 'assistant',
      content: msg.textContent.trim()
    }));
  }
  
  function exportConversation() {
    const conversation = extractConversation();
    if (!conversation) {
      alert('Unable to extract conversation. This LLM might not be supported.');
      return;
    }
  
    const blob = new Blob([JSON.stringify(conversation, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {  // Ctrl+E to export
      exportConversation();
    }
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "exportConversation") {
      exportConversation();
      sendResponse({status: "Export initiated"});
    }
  });