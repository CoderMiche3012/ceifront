export const normalizeName = (str) => {
  if (!str) return "";

  return str
    .trim()
    .toLowerCase()
    .split(/\s+/) // 👈 mejor que " "
    .filter(Boolean)
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};