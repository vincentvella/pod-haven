export function stripHtml(htmlString: string): string {
  // Regular expression to match HTML tags
  const htmlTagPattern = /<\/?[^>]+>/gi;

  // Replace all HTML tags with an empty string
  const textContent = htmlString.replace(htmlTagPattern, "");

  return textContent;
}
