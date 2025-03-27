// Add this function within your file
function wrapText(text: string, charsPerLine: number): string[] {
  if (text.length <= charsPerLine) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentLineLength = 0;

  words.forEach((word) => {
    if (
      currentLineLength + word.length + 1 <= charsPerLine ||
      currentLine.length === 0
    ) {
      currentLine.push(word);
      currentLineLength += word.length + (currentLine.length > 1 ? 1 : 0);
    } else {
      lines.push(currentLine.join(" "));
      currentLine = [word];
      currentLineLength = word.length;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return lines;
}
