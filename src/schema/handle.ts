export const handleNumToId = (idx: number, source: boolean) => {
  return `${source ? "source" : "target"}-${idx}`;
};

export const handleIdToNum = (id: string): { idx: number; source: boolean } => {
  const s = id.split("-");
  return { idx: parseInt(s[1]), source: s[0] === "source" };
};
