/*
This bookmarklet takes the page you're browsing on and starts an Outlook Web Access calendar item with it's content and gets it onto your calendar.

More info about what brought this about is here: https://chetcromer.com/create-an-outlook-web-task-from-any-webpage-with-one-click-bookmarklet-tutorial/

The journey with AI to get here is here: https://chetcromer.com/how-to-work-with-ai-to-achieve-your-goals/

Current Version I'm Using: 0.2

ChangeLog:
0.1  This is the first file I decided to write down. I'll try to keep this up to date as I update my bookmarklet. All you need to do is minify this and then add it to your browser.
0.2  Added a "focus" section to the message that includes whatever I currently have highlighted on the page. This allows me to get content straight into my appointment that I care about even if it's not in the first few paragraphs or page title.

*/

(function () {
  // Helper function to pad single-digit numbers
  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  const isOutlookMail = location.href.includes("outlook.office.com/mail/");
  const now = new Date();
  let start = new Date();

  // Schedule 4 hours in the future, unless after 5pm
  start.setHours(start.getHours() + 4);
  if (start.getHours() >= 17) {
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);
  } else {
    start.setMinutes(0, 0, 0);
  }

  const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 minutes later

  function formatDateTime(t) {
    return (
      t.getUTCFullYear() +
      "-" +
      pad(t.getUTCMonth() + 1) +
      "-" +
      pad(t.getUTCDate()) +
      "T" +
      pad(t.getUTCHours()) +
      ":" +
      pad(t.getUTCMinutes()) +
      ":00Z"
    );
  }

  const pageTitle = document.title;
  const pageUrl = location.href;
  let subject, pageBodyHTML;

  const selected = window.getSelection()?.toString()?.trim();

  if (isOutlookMail) {
    // If we're viewing an Outlook Web email
    const heading = document.querySelector('[role="heading"]')?.textContent?.trim();
    subject = heading ? "TASK: " + heading : "TASK: Follow up on email";
    pageBodyHTML = `
      <p>This task was created from an email in Outlook Web Access.</p>
      <p>&nbsp;</p>
      <p><a href="${pageUrl}">Open email</a></p>
    `;
  } else {
    // If we're viewing a normal webpage
    const metaSummary = document.querySelector('meta[name="description"]')?.content?.trim() || "";

    // Grab up to 5 paragraphs
    const paragraphs = Array.from(document.querySelectorAll("p"))
      .slice(0, 5)
      .map((p) => p.textContent.trim())
      .filter(Boolean);

    // Grab the first image over 500x500
    let imageHTML = "";
    const images = document.querySelectorAll("img");
    for (let img of images) {
      if (img.naturalWidth > 500 && img.naturalHeight > 500) {
        imageHTML = `<p>&nbsp;</p><img src="${img.src}" alt="Image" style="max-width:100%;">`;
        break;
      }
    }

    const summaryHTML = metaSummary ? `<p>${metaSummary}</p><p>&nbsp;</p>` : "";

    const paragraphHTML =
      "<hr><p>&nbsp;</p>" +
      paragraphs.map((p) => `<p>${p}</p><p>&nbsp;</p>`).join("");

    const focusHTML = selected
      ? `<div style="background:#f2f2f2;padding:10px;border-left:4px solid #ccc;margin:10px 0;">
           <strong>Focus:</strong> ${selected}
         </div><p>&nbsp;</p>`
      : "";

    pageBodyHTML = `
      <h1>${pageTitle}</h1>
      <p>&nbsp;</p>
      ${focusHTML}
      <p><a href="${pageUrl}">${pageUrl}</a></p>
      <p>&nbsp;</p>
      ${summaryHTML}
      ${paragraphHTML}
      ${imageHTML}
    `;

    subject = "TASK: " + pageTitle;
  }

  const bodyEncoded = encodeURIComponent(pageBodyHTML);
  const startStr = formatDateTime(start);
  const endStr = formatDateTime(end);

  // Responsive popup width
  const rawW = Math.min(screen.width * 0.8, window.outerWidth * 0.8);
  const popupWidth = Math.min(2048, Math.max(1024, Math.floor(rawW)));
  const popupHeight = 700;

  // Centering the popup
  const left = (window.outerWidth - popupWidth) / 2 + window.screenX;
  const top = (window.outerHeight - popupHeight) / 2 + window.screenY;

  // Open Outlook Web compose task popup
  window.open(
    `https://outlook.office.com/calendar/deeplink/compose?subject=${encodeURIComponent(
      subject
    )}&body=${bodyEncoded}&startdt=${startStr}&enddt=${endStr}`,
    "_blank",
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
  );
})();
