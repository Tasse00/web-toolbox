// TODO: ugly
export async function copyToClipboard(text: string) {
  // @ts-ignore
  const copy = function (e) {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain", text);
      // @ts-ignore
    } else if (window.clipboardData) {
      // @ts-ignore
      window.clipboardData.setData("Text", text);
    }
  };
  window.addEventListener("copy", copy);
  document.execCommand("copy");
  window.removeEventListener("copy", copy);
}
