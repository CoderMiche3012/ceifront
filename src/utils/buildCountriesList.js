

export const buildCountriesList = (local = [], api = []) => {
  const map = new Map();

  // usamos clave normalizada SOLO para comparar
  const getKey = (val) => (val || "").trim().toLowerCase();

  // LOCAL (NO tocar display)
  local.forEach((c) => {
    if (!c?.code) return;

    const key = getKey(c.code);

    if (!map.has(key)) {
      map.set(key, {
        code: c.code, // 👈 그대로 como viene
        name: c.name, // 👈 그대로 como viene
      });
    }
  });

  // API (NO tocar display)
  api.forEach((c) => {
    const code = typeof c === "string" ? c : c?.pais;
    if (!code) return;

    const key = getKey(code);

    if (!map.has(key)) {
      map.set(key, {
        code: code, // 👈 sin modificar
        name: code, // 👈 sin modificar
      });
    }
  });

  return Array.from(map.values());
};