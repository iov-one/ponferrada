export function updateExtensionBadge(queueSize: number): void {
  const isExtensionContext = typeof chrome !== "undefined"; // needed for tests
  if (!isExtensionContext) {
    return;
  }

  const badgeText = queueSize === 0 ? "" : `${queueSize}`;
  const iconPath = queueSize === 0 ? "assets/icons/icon128.png" : "assets/icons/request128.png";

  chrome.browserAction.setIcon({ path: iconPath });
  chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
  chrome.browserAction.setBadgeText({ text: badgeText });
}
