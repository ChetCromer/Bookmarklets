(() => {
  // Get the first <h1> tag on the page, or fallback to the document title
  function getTitle() {
    let h1 = document.querySelector("h1");
    return `<h1>${h1 ? h1.innerText.trim() : document.title}</h1>`;
  }

  // Get selected text from the page and wrap it in a styled gray <div>
  function getSelectedText() {
    let selection = window.getSelection().toString().trim();
    if (selection) {
      return `<div style="background-color:#eee; padding:10px; margin:10px 0;">${selection}</div>`;
    } else {
      return "";
    }
  }

  // Generate a clickable link to the current page
  function getPageLink() {
    return `<a href="${location.href}">${location.href}</a>`;
  }

  // Combine all parts into a single HTML snippet
  let resultHTML = `${getTitle()}<hr>${getSelectedText()}<hr>${getPageLink()}`;

  // Write the result to the clipboard as HTML (no alert or popup)
  navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([resultHTML], { type: "text/html" })
    })
  ]);
})();
