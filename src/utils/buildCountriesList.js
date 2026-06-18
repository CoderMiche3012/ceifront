
export const buildCountriesList = (local = [], api = []) => {
  const map = new Map();

  const getKey = (val) => (val || "").trim().toLowerCase();

  // LOCAL (NO tocar display)
  local.forEach((c) => {
    if (!c?.code) return;

    const key = getKey(c.code);

    if (!map.has(key)) {
      map.set(key, {
        code: c.code, 
        name: c.name, 
      });
    }
  });

  api.forEach((c) => {
    const code = typeof c === "string" ? c : c?.pais;
    if (!code) return;

    const key = getKey(code);

    if (!map.has(key)) {
      map.set(key, {
        code: code, 
        name: code, 
      });
    }
  });

  return Array.from(map.values());
};