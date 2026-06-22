import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useInicioSesion } from "../features/auth/hooks/useLogin";
//componentes
import Input from "../components/ui/Input";
import BotonInicio from "../components/ui/BotonInicio";
import AlertaError from "../components/ui/AlertaError";
//imagenes
import logoCei from "../assets/imagenes/logo.png";
import inicioR from "../assets/imagenes/inicioR.jpeg";
// para el bloqueo
const getBloqueo = (username) => {
  const bloqueo = localStorage.getItem(`bloqueo_${username}`);
  return bloqueo ? Number(bloqueo) : null;
};
const estaBloqueado = (username) => {
  const bloqueo = getBloqueo(username);
  return !!bloqueo && Date.now() < bloqueo;
};

export default function InicioSesion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [bloqueoMsg, setBloqueoMsg] = useState(null);
  const loginMutation = useInicioSesion();

  const isLoading = loginMutation.isPending;

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (bloqueoMsg) setBloqueoMsg(null);
  }, [bloqueoMsg]);

  // tiempo de espera
  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => {
        loginMutation.reset?.();
        setBloqueoMsg("La solicitud tardó demasiado. Intenta de nuevo.");
      }, 15000);
      return () => clearTimeout(t);
    }
  }, [isLoading, loginMutation]);

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.reset?.();
    setBloqueoMsg(null);

    if (isLoading) return;

    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username || !password) {
      setBloqueoMsg("Por favor, completa todos los campos.");
      return;
    }

    if (estaBloqueado(username)) {
      const minutos = Math.ceil((getBloqueo(username) - Date.now()) / 60000);
      setBloqueoMsg(`Cuenta bloqueada. Intenta en ${minutos} min.`);
      return;
    }

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          localStorage.removeItem(`intentos_${username}`);
          localStorage.removeItem(`bloqueo_${username}`);
          setBloqueoMsg(null);
          navigate("/app", { replace: true });
        },
        onError: (err) => {
          const mensaje = err?.message || err?.response?.data?.detail || err?.response?.data?.message || err?.errors?.detail;

          if (mensaje === "Usuario inactivo") {
            setBloqueoMsg("Esta cuenta está inactiva. Contacta al administrador.");
          } else if (mensaje === "Cuenta bloqueada temporalmente") {
            setBloqueoMsg("Tu cuenta está bloqueada temporalmente.");
          } else if (mensaje === "Credenciales inválidas" || err?.status === 401) {
            setBloqueoMsg("El usuario o la contraseña no son correctos.");
          } else {
            setBloqueoMsg(mensaje || "Ocurrió un error inesperado al iniciar sesión.");
          }
          // intentos locales
          if (mensaje !== "Usuario inactivo") {
            const key = `intentos_${username}`;
            let intentos = Number(localStorage.getItem(key) || 0) + 1;
            localStorage.setItem(key, intentos);
            if (intentos >= 3) {
              const bloqueo = Date.now() + 15 * 60 * 1000;
              localStorage.setItem(`bloqueo_${username}`, bloqueo);
              localStorage.removeItem(key);
              setBloqueoMsg("Demasiados intentos. Cuenta bloqueada 15 min.");
            }
          }
          // Reseteo asíncrono controlado para liberar el botón
          setTimeout(() => {
            loginMutation.reset();
          }, 50);
        }
      }
    );
  };

  const visualPanel = useMemo(() => (
    <div className="relative hidden min-h-screen lg:block" aria-hidden="true">
      <img src={inicioR} alt="Niños del centro" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
      <div className="absolute " />
      <div className="relative z-10 flex h-full items-end p-8">
        <div className="relative z-10 flex h-full items-end p-8">
          <div className="w-[750px] rounded-2xl bg-black/35 backdrop-blur-sm p-6">
            <h2 className="text-5xl font-bold text-white">
              Creando esperanza para el futuro de nuestra comunidad.
            </h2>

            <p className="mt-4 text-lg text-white/90">
              Cada inicio de sesión es un paso más hacia un mundo mejor.
            </p>
          </div>
        </div>
      </div>
    </div>
  ), []);

  const mailtoLink = useMemo(() => {
    const correoAdmin = "cei@gmail.com";
    const asunto = encodeURIComponent("Solicitud de recuperación de contraseña");
    const textoMensaje = encodeURIComponent(
      "Hola.\n\nSolicito el restablecimiento de mi contraseña del sistema CEI.\n\nUsuario:\nCorreo registrado:\n\nEnviar esta solicitud desde el correo registrado en el sistema.\n\nGracias."
    );
    return `mailto:${correoAdmin}?subject=${asunto}&body=${textoMensaje}`;
  }, []);

  return (
    <main className="min-h-screen w-screen bg-white">
      <section className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {visualPanel}
        <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] px-6 py-8">
          <div className="w-full max-w-[460px] animate-in fade-in duration-500">
            <header className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                <img src={logoCei} alt="Centro de Esperanza Infantil Logo" className="h-full w-full object-contain" />
              </div>
              <h1 className="text-3xl font-extrabold text-[#0E5F63]">Bienvenido de nuevo</h1>
              <p className="mt-2 text-sm font-medium text-gray-500">Sistema Interno</p>
            </header>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1.5">
                <label htmlFor="username" className="ml-1 text-sm font-bold text-slate-700">Usuario</label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="ml-1 text-sm font-bold text-slate-700">Contraseña</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#0E5F63] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMostrarRecuperacion(true)} // <-- Corregido para abrir el Modal
                    className="text-sm font-medium text-[#0E5F63] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              {bloqueoMsg && <AlertaError mensaje={bloqueoMsg} />}

              <BotonInicio type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verificando...
                  </span>
                ) : (
                  "Ingresar"
                )}
              </BotonInicio>
            </form>

            <footer className="mt-10 border-t border-gray-100 pt-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                © {new Date().getFullYear()} Centro de Esperanza Infantil
              </p>
            </footer>
          </div>
        </div>
      </section>

      {/* modal de recuperacion */}
      {mostrarRecuperacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-[#0E5F63]">Recuperar contraseña</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>Para recuperar tu contraseña debes contactar al administrador del sistema.</p>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-semibold text-slate-700">Importante</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>El correo debe enviarse desde el correo registrado en el sistema.</li>
                  <li>Debes incluir tu nombre de usuario.</li>
                  <li>El administrador verificará tu información antes de restablecer la contraseña.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-[#0E5F63]/20 bg-[#0E5F63]/5 p-3">
                <p className="text-sm font-semibold text-[#0E5F63]">Correo de soporte</p>
                <p className="mt-1 break-all text-sm text-gray-700">cei@gmail.com</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarRecuperacion(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
              <a
                href={mailtoLink}
                className="rounded-xl bg-[#0E5F63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b4e52] transition-colors"
              >
                Abrir correo
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
