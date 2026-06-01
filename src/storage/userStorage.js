export const guardarSesionLocal = ({ access, refresh }) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};
export const guardarUsuarioLocal = (usuario) => {
  localStorage.setItem( "user", JSON.stringify(usuario) );
};
export const obtenerAccessToken = () =>
  localStorage.getItem("access");

export const obtenerRefreshToken = () =>
  localStorage.getItem("refresh");

export const limpiarSesionLocal = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const obtenerUsuario = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};