export function obtenerUsuarioLocal() {
  try {
    const rawUser =
      localStorage.getItem("usuario") ||
      localStorage.getItem("user") ||
      localStorage.getItem("usuarioLogueado") ||
      localStorage.getItem("auth")

    return rawUser ? JSON.parse(rawUser) : {}
  } catch (error) {
    console.error("Error al leer usuario del localStorage:", error)
    return {}
  }
}