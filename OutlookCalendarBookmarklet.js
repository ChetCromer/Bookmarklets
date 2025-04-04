/*
Version: 0.1

ChangeLog:
0.1  This is the first file I decided to write down. I'll try to keep this up to date as I update my bookmarklet. All you need to do is minify this and then add it to your browser.


*/

(function() {
  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  const now = new Date();
  let start = new Date();
  start.setHours(start.getHours() + 4);

  // If it's past 5 PM, set task to 9 AM tomorrow
  if (start.getHours() >= 17) {
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);
  } else {
    start.setMinutes(0, 0, 0);
  }

  const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min later

  function formatDateTime(dt) {
    return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth()+1)}-${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:00Z`;
  }

  // Grab content from the page
  const pageTitle = document.title;
  const pageUrl = location.href;
  const metaSummary = document.querySelector('meta[name="description"]')?.content?.trim() || "";

  // First 5 paragraphs
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .slice(0, 5)
    .map(p => p.textContent.trim())
    .filter(Boolean);

  // First image larger than 500x500
  let imageHTML = "";
  const images = document.querySelectorAll('img');
  for (let img of images) {
    if (img.naturalWidth > 500 && img.naturalHeight > 500) {
      imageHTML = `<p>&nbsp;</p><img src="${img.src}" alt="Image" style="max-width:100%;">`;
      break;
    }
  }

  const summaryHTML = metaSummary ? `<p>${metaSummary}</p><p>&nbsp;</p>` : "";
  const paragraphHTML = "<hr><p>&nbsp;</p>" + paragraphs.map(p => `<p>${p}</p><p>&nbsp;</p>`).join("");

  const bodyHTML = `<h1>${pageTitle}</h1><p>&nbsp;</p><p><a href="${pageUrl}">${pageUrl}</a></p><p>&nbsp;</p>` + summaryHTML + paragraphHTML + imageHTML;
  const subject = `TASK: ${pageTitle}`;
  const bodyEncoded = encodeURIComponent(bodyHTML);
  const startStr = formatDateTime(start);
  const endStr = formatDateTime(end);

  // Calculate popup size
  const rawWidth = Math.min(screen.width * 0.8, window.outerWidth * 0.8);
  const popupWidth = Math.min(2048, Math.max(1024, Math.floor(rawWidth)));
  const popupHeight = 700;
  const left = (window.outerWidth - popupWidth) / 2 + window.screenX;
  const top = (window.outerHeight - popupHeight) / 2 + window.screenY;

  // Build Outlook calendar URL
  const outlookUrl = `https://outlook.office.com/calendar/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${bodyEncoded}&startdt=${startStr}&enddt=${endStr}`;

  window.open(outlookUrl, '_blank', `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`);
})();
