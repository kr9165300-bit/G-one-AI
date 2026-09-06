// G ONE AI Part 6 — Web Search
async function webSearch(query) {
  const r = await fetch('/api/search?q=' + encodeURIComponent(query));
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Search failed');
  return data;
}

async function askPart6(text) {
  const m = text.match(/^(?:search|web search|google|latest|find)\s+(.+)/i);
  if (!m) return null;
  const q = m[1].trim();
  const data = await webSearch(q);
  if (!data.results?.length) return 'Mujhe is query ke liye web results nahi mile.';
  return data.results.slice(0,5).map((x,i) => `${i+1}. ${x.title}\n${x.snippet || ''}\n${x.url}`).join('\n\n');
}
