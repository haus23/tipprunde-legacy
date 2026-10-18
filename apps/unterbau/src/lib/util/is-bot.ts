// Crawlers and tools that render pages with JavaScript, e.g. Googlebot as a
// Nexus 5X. They start without storage, so every visit looks like a new
// device. `bot` must end a word: phone names like CUBOT stay devices.
const botPattern =
  /(bot|crawler|spider)\b|google-read-aloud|lighthouse|headlesschrome|slurp/i;

export function isBot(userAgent: string) {
  return botPattern.test(userAgent);
}
