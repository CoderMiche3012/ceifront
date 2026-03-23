import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Input from "../../components/ui/Input";
import BotonInicio from "../../components/ui/BotonInicio";
import AlertaError from "../../components/ui/AlertaError";
import { formatError } from "../../utils/errorHandlers";
import inicio from "../../assets/imagenes/inicio.png";
import logoCei from "../../assets/imagenes/logo.png";
import { obtenerInicioSesion, guardarUsuarioLocal,} from "../../services/usuariosService";
export default function InicioSesion() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //maneja el envio del formulario y el proceso de autenticación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Debes completar ambos campos para continuar.");
      return;
    }
    setLoading(true);
    try {
      const response = await obtenerInicioSesion({
        username: username.trim(),
        password: password.trim(),
      });
      //si la autenticacion fue correcta, guarda la sesión y navega a la app
      if (response?.access) {
        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        guardarUsuarioLocal(response.user || {});
        navigate("/app");
      } else {
        throw new Error("No se pudo obtener la sesión.");
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen w-screen bg-white">
      <section className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">    
        {/* panel visual lateral, visible en pantallas grandes */}
        <div className="relative hidden min-h-screen lg:block">
          <img
            src={inicio}
            alt="Niños"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1F8A8A]/70" />
          <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-10 text-white">
            <h2 className="max-w-[500px] text-4xl font-extrabold leading-tight">
              Creando esperanza para el futuro de nuestra comunidad.
            </h2>
            <p className="mt-4 max-w-[420px] text-lg text-white/90">
              Cada inicio de sesión es un paso más hacia un mundo mejor.
            </p>
          </div>
        </div>
        {/* formulario de acceso */}
        <div className="flex min-h-screen w-full items-center justify-center bg-[#fcfcfc] px-6 py-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                <img
                  src={logoCei}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-extrabold text-[#0E5F63]">
                Bienvenido de nuevo
              </h1>
              <p className="mt-2 text-sm font-medium text-gray-500">
                Sistema Interno del Centro de Esperanza Infantil
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="ml-1 text-sm font-bold text-slate-700">
                  Usuario
                </label>
                <Input
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className="ml-1 text-sm font-bold text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-12"
                  />
                  {/* mostrar u ocultar la contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0E5F63] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <AlertaError mensaje={error} />
              <BotonInicio type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Ingresar"}
              </BotonInicio>
            </form>
            <div className="mt-10 border-t border-gray-100 pt-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                © 2026 Centro de Esperanza Infantil
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}