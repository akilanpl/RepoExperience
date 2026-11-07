/** Move the thinking particles into a sampled product symbol. */
export function morphFrame(frame, logo, size, amount) {
  if (amount <= 0 || !frame.dots.length) return frame;
  const source = [...frame.dots].sort((a, b) => a.x - b.x || a.y - b.y);
  const count = Math.max(512, source.length);
  const dots = [];
  const radius = Math.max(.55, size * .005);
  for (let index = 0; index < count; index++) {
    const from = source[Math.min(source.length - 1, Math.floor(index * source.length / count))];
    const point = logo.points[Math.min(logo.points.length - 1, Math.floor(index * logo.points.length / count))];
    const x = size * (.5 + point[0] * .9);
    const y = size * (.5 + point[1] * .9);
    dots.push({
      x: from.x + (x - from.x) * amount,
      y: from.y + (y - from.y) * amount,
      z: from.z * (1 - amount),
      r: from.r + (radius - from.r) * amount,
      white: from.white * (1 - amount),
      a: (from.a ?? 1) + (1 - (from.a ?? 1)) * amount,
    });
  }
  return {
    dots,
    lines: frame.lines.map((line) => ({ ...line, a: (line.a ?? 1) * (1 - amount) })),
  };
}
