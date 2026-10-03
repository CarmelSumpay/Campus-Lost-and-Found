(function () {
  const iconContent = {
    '↪': '<path d="M9 5 4 10l5 5M4 10h10a6 6 0 0 1 0 12h-2"/>',
    '☀️': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    '☁': '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z"/>',
    '⚠️': '<path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 3h.01"/>',
    '⚽': '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 5h-5L8 10zm-4 3-4-1m4 1-2 6m8-6 5-1m-3 6 3 4m-11-3 4 5"/>',
    '✅': '<path d="m5 12 4 4L19 6"/>',
    '✉️': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    '✏️': '<path d="m4 16.5 11-11 4 4-11 11H4zM13 7.5l4 4M4 16.5l4 4M17 3l4 4"/>',
    '❓': '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.6 1.3c-1 1.3-2.2 1.4-2.2 3.2m0 3h.01"/>',
    '🌙': '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14z"/>',
    '🎒': '<rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 7V5a3 3 0 0 1 6 0v2M4 12h16M10 12v2h4v-2"/>',
    '🎯': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    '🏷️': '<path d="M20 13 13 20 3 10V4h6z"/><circle cx="7.5" cy="7.5" r="1"/>',
    '👕': '<path d="m8 4 4 2 4-2 5 3-3 5-2-1v10H8V11l-2 1-3-5z"/><path d="M9 4a3 3 0 0 0 6 0"/>',
    '👤': '<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    '💍': '<path d="m3 9 4-5h10l4 5-9 12zM3 9h18M7 4l5 17 5-17M7 9l5-5 5 5"/>',
    '💬': '<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z"/>',
    '📅': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    '📋': '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M9 10h6m-6 4h6m-6 4h4"/>',
    '📌': '<path d="m16 3 5 5-4 1-4 5-1 4-2-2-7 7 6-8-2-2 4-1 5-4z"/>',
    '📍': '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    '📚': '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 5v16.5M8 6h8M8 10h8"/>',
    '📝': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8m-8 4h8"/><path d="m15 18 4-4 2 2-4 4-3 1z"/>',
    '📞': '<path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    '📦': '<path d="m3 7 9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/>',
    '📱': '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M10 5h4m-3 13.5h2"/>',
    '📲': '<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M10 5h4m-3 13.5h2M2 9h3m-3 0 2-2m-2 2 2 2"/>',
    '📷': '<path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="4"/>',
    '🪪': '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2.5"/><path d="M5.5 17a3.5 3.5 0 0 1 7 0m3-8h3m-3 4h3"/>',
    '🔍': '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    '🔑': '<circle cx="8" cy="10" r="5"/><path d="m12 13 8 8m-3-3 2-2m-5-1 2-2"/>',
    '🔒': '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    '🔔': '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"/>',
    '🕐': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    '🖨️': '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/><path d="M18 12h.01"/>',
    '🗑️': '<path d="M3 6h18m-2 0-1 15H6L5 6m4 0V3h6v3m-5 4v7m4-7v7"/>',
    '🗓️': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m4 4h.01m4 4h.01m4 0h.01"/>',
    '🚀': '<path d="M5 15c-2 0-3 2-3 5 3 0 5-1 5-3m-2-2 5 5c6-2 10-8 11-18-10 1-16 5-18 11z"/><circle cx="15" cy="9" r="2"/>',
    '🛡️': '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
    '🤝': '<path d="m8 12 3 3a2 2 0 0 0 3 0l3-3m-9 0 3-3 3 3m-7 4-4-4 4-4 3 2m8 6 4-4-4-4-4 2"/>'
  };
  const emojiPattern = new RegExp(
    `(${Object.keys(iconContent).sort((a, b) => b.length - a.length).map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gu'
  );
  const style = document.createElement('style');
  style.textContent = '.ui-icon{display:inline-flex;width:1em;height:1em;align-items:center;justify-content:center;vertical-align:-.14em;flex:0 0 auto}.ui-icon svg{display:block;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}';
  document.head.appendChild(style);

  function convertTextNode(node) {
    const text = node.nodeValue;
    if (!emojiPattern.test(text)) {
      emojiPattern.lastIndex = 0;
      return;
    }
    emojiPattern.lastIndex = 0;
    const fragments = document.createDocumentFragment();
    for (const part of text.split(emojiPattern)) {
      if (!part) continue;
      if (!iconContent[part]) {
        fragments.appendChild(document.createTextNode(part));
        continue;
      }
      const wrapper = document.createElement('span');
      wrapper.className = 'ui-icon';
      wrapper.setAttribute('aria-hidden', 'true');
      wrapper.innerHTML = `<svg viewBox="0 0 24 24" focusable="false">${iconContent[part]}</svg>`;
      fragments.appendChild(wrapper);
    }
    node.parentNode.replaceChild(fragments, node);
  }

  function convertSubtree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      convertTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches('script,style,textarea,input,select,option,svg,code,pre')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(convertTextNode);
  }

  convertSubtree(document.body);
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) convertSubtree(node);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
