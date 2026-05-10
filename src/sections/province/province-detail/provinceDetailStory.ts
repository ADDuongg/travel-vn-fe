/** Split long description into two columns (editorial), like sentence chunks. */
export function splitStoryParagraphs(description: string): { paraA: string; paraB: string } {
  const trimmed = description.trim();
  if (!trimmed) {
    return { paraA: '', paraB: '' };
  }
  const fragments = trimmed.split(/\.\s+/).reduce<string[]>((acc, bit, idx, arr) => {
    const frag = idx < arr.length - 1 ? `${bit.trim()}.` : bit.trim();
    if (frag) acc.push(frag);
    return acc;
  }, []);
  const mid = Math.ceil(fragments.length / 2);
  const paraA = fragments.slice(0, mid).join(' ');
  const paraB = fragments.slice(mid).join(' ');
  return { paraA, paraB };
}
