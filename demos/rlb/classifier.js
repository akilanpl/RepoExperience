const examples = {
  Billing: ['invoice charged twice', 'refund my payment', 'update credit card', 'receipt for subscription'],
  Account: ['reset my password', 'cannot sign in', 'change account email', 'locked out of profile'],
  Technical: ['app crashes on launch', 'page shows error', 'upload fails on desktop', 'screen freezes after update'],
};
const tokenize = text => text.toLowerCase().match(/[a-z]+/g) ?? [];

export function trainClassifier() {
  const classes = Object.entries(examples).map(([label, documents]) => {
    const words = documents.flatMap(tokenize);
    const counts = new Map();
    for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
    return { label, counts, total: words.length };
  });
  const vocabulary = new Set(classes.flatMap(({ counts }) => [...counts.keys()]));

  return text => {
    const terms = tokenize(text).filter(word => vocabulary.has(word));
    if (!terms.length) return null;
    const scores = classes.map(({ label, counts, total }) => ({
      label,
      score: terms.reduce((sum, word) =>
        sum + Math.log(((counts.get(word) ?? 0) + 1) / (total + vocabulary.size)), 0),
    }));
    scores.sort((a, b) => b.score - a.score);
    if (scores[0].score === scores[1].score) return null;
    const weight = scores.reduce((sum, { score }) => sum + Math.exp(score - scores[0].score), 0);
    return { label: scores[0].label, modelScore: Math.round(100 / weight) };
  };
}
