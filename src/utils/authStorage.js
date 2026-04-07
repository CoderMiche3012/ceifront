export function obtenerUsuarioLocal() {
  try {
    const rawUser =localStorage.getItem("user") 
    return rawUser ? JSON.parse(rawUser) : {}
  } catch (error) {
    return {}
  }
}