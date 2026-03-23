import { useEffect, useState } from "react"
import Alerta from "../components/ui/AlertaError"
//para manejar el formulario de perfil del usuario
export function usePerfilForm({ user, open, onClose, onUserUpdated }) {
  const [nombre, setNombre] = useState("")
  const [apellidoP, setApellidoP] = useState("")
  const [apellidoM, setApellidoM] = useState("")
  const [correo, setCorreo] = useState("")
  const [username, setUsername] = useState("")
  const [telefono, setTelefono] = useState("")
  const [passwordActual, setPasswordActual] = useState("")
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [cambiarPass, setCambiarPass] = useState(false)
  const [showPasswordActual, setShowPasswordActual] = useState(false)
  const [showNuevaPassword, setShowNuevaPassword] = useState(false)
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  //carga los datos del usuario cuando se abre el modal
  useEffect(() => {
    if (user && open) {
      setNombre(user.nombre || "")
      setApellidoP(user.apellido_p || "")
      setApellidoM(user.apellido_m || "")
      setCorreo(user.correo || "")
      setUsername(user.nom_usuario || "")
      setTelefono(user.telefono || "")
      setPasswordActual("")
      setNuevaPassword("")
      setConfirmarPassword("")
      setCambiarPass(false)
      setShowPasswordActual(false)
      setShowNuevaPassword(false)
      setShowConfirmarPassword(false)
      setError("")
      setSuccess("")
    }
  }, [user, open])
  //limpia el bloque de cambio de contraseña
  const cancelarCambioPassword = () => {
    setCambiarPass(false)
    setPasswordActual("")
    setNuevaPassword("")
    setConfirmarPassword("")
    setShowPasswordActual(false)
    setShowNuevaPassword(false)
    setShowConfirmarPassword(false)
  }
  //actualización del perfil y, si aplica, de la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const payload = {
      correo: correo.trim(),
      telefono: telefono ? telefono.trim() : "",
    }
    //valida y agrega datos de contraseña solo si el usuario desea cambiarla
    if (cambiarPass) {
      if (!passwordActual) {
        setError("Debes ingresar tu contraseña actual para cambiar la contraseña.")
        return
      }
      if (!nuevaPassword || !confirmarPassword) {
        setError("Por favor, completa los campos de la nueva contraseña.")
        return
      }
      if (nuevaPassword.length < 8) {
        setError("La nueva contraseña debe tener al menos 8 caracteres.")
        return
      }
      if (nuevaPassword !== confirmarPassword) {
        setError("Las nuevas contraseñas no coinciden.")
        return
      }
      payload.password_actual = passwordActual
      payload.password = nuevaPassword
      payload.confirm_password = confirmarPassword
    }
    try {
      setLoading(true)
      const token = localStorage.getItem("access")
      const response = await fetch(
        `http://localhost:8000/api/cuentas/usuarios/${user.id_usuario}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(Alerta(data))
      }
      setSuccess("¡Perfil actualizado correctamente!")
      if (onUserUpdated) onUserUpdated(data)

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || "Ocurrió un error al actualizar el perfil.")
    } finally {
      setLoading(false)
    }
  }
  return {nombre,apellidoP,apellidoM,correo,setCorreo,
    username,telefono,setTelefono,passwordActual,setPasswordActual,nuevaPassword,setNuevaPassword,confirmarPassword,
    setConfirmarPassword,cambiarPass,setCambiarPass,showPasswordActual,setShowPasswordActual,showNuevaPassword,
    setShowNuevaPassword,showConfirmarPassword,setShowConfirmarPassword,error,success,loading,handleSubmit,cancelarCambioPassword,
  }
}