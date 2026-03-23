import { useEffect, useMemo, useState } from "react"
const API_URL = "http://localhost:8000/api/cuentas/usuarios/"
export const initialFormData = {
  nombre: "",
  apellido_p: "",
  apellido_m: "",
  correo: "",
  telefono: "",
  nom_usuario: "",
  id_rol: "",
  password: "",
  confirm_password: "",
}
// para manejar la lógica del modal de creación de usuario
export function useUsuarioCrearModal({ open, roles = [], onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialFormData)
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  //opciones unicas de roles para el select
  const roleOptions = useMemo(() => {
    const uniqueRoles = new Map()
    roles.forEach((rol) => {
      const value = String(rol?.id || rol?.id_rol || rol?.pk_id_rol || rol?.rol_id || "").trim()
      const label = String(rol?.nombre || rol?.nombre_rol || rol?.nb_rol || rol?.name || rol?.rol || "" ).trim()
      if (!value || !label) return
      if (!uniqueRoles.has(value)) {
        uniqueRoles.set(value, { value, label })
      }
    })
    return Array.from(uniqueRoles.values())
  }, [roles])
  // reinicia el formulario al cerrar el modal
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData)
      setFieldErrors({})
      setGeneralError("")
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [open])
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && open && !loading) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, loading])
  //headers autenticados usando el token guardado
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access")
    if (!token) {
      throw new Error("No se encontró el token de autenticación")
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }
  const handleClose = () => {
    if (loading) return
    onClose?.()
  }
  // cierra el modal al hacer click en el fondo
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose()
    }
  }
  //actualiza el formulario y limpia errores relacionados
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    if (generalError) {
      setGeneralError("")
    }
  }
  // valida campos obligatorios y reglas de contraseña
  const validateForm = () => {
    const errors = {}
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio"
    if (!formData.apellido_p.trim()) {
      errors.apellido_p = "El apellido paterno es obligatorio"
    }
    if (!formData.correo.trim()) {
      errors.correo = "El correo electrónico es obligatorio"
    }
    if (!formData.nom_usuario.trim()) {
      errors.nom_usuario = "El nombre de usuario es obligatorio"
    }
    if (!formData.id_rol) errors.id_rol = "Debes seleccionar un rol"
    if (!formData.password) errors.password = "La contraseña es obligatoria"
    if (!formData.confirm_password) {
      errors.confirm_password = "Debes confirmar la contraseña"
    }
    if (
      formData.password &&
      formData.confirm_password &&
      formData.password !== formData.confirm_password
    ) {
      errors.confirm_password = "Las contraseñas no coinciden"
    }
    if (formData.password && formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres"
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      throw new Error("Revisa los campos marcados")
    }
  }
  // construye el payload final para enviar al backend
  const buildPayload = () => ({
    nombre: formData.nombre.trim(),
    apellido_p: formData.apellido_p.trim(),
    apellido_m: formData.apellido_m.trim(),
    correo: formData.correo.trim(),
    telefono: formData.telefono.trim(),
    nom_usuario: formData.nom_usuario.trim(),
    id_rol: Number(formData.id_rol),
    estatus: 1,
    password: formData.password,
    confirm_password: formData.confirm_password,
  })
  // extrae un mensaje legible desde la respuesta de error del backend
  const getErrorMessage = async (response) => {
    let message = "No se pudo crear el usuario"
    try {
      const errorData = await response.json()
      console.log("Error backend crear usuario:", errorData)
      if (typeof errorData === "object" && errorData !== null) {
        return (
          errorData.detail ||
          errorData.message ||
          Object.entries(errorData)
            .map(([campo, valor]) => {
              if (Array.isArray(valor)) {
                return `${campo}: ${valor.join(", ")}`
              }
              return `${campo}: ${valor}`
            })
            .join(" | ") ||
          message
        )
      }
    } catch {
    }
    return message
  }
  //creación del usuario
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setGeneralError("")
      setFieldErrors({})
      validateForm()
      const headers = getAuthHeaders()
      const payload = buildPayload()
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
      if (response.status === 401) {
        throw new Error("Sesión expirada o no autorizada")
      }
      if (!response.ok) {
        throw new Error(await getErrorMessage(response))
      }
      if (onSuccess) {
        await onSuccess()
      }
      onClose?.()
    } catch (err) {
      setGeneralError(err.message || "Ocurrió un error al crear el usuario")
    } finally {
      setLoading(false)
    }
  }
  // datos derivados para mostrar en la interfaz del modal
  const initials = `${formData.nombre?.[0] || "N"}${formData.apellido_p?.[0] || "U"}`
  const fullName =
    `${formData.nombre} ${formData.apellido_p} ${formData.apellido_m}`.trim() ||
    "Nuevo usuario"
  return {formData,fieldErrors,generalError,loading,showPassword,
    showConfirmPassword,roleOptions,initials,fullName,
    setShowPassword,setShowConfirmPassword,handleClose,
    handleBackdropClick,handleChange,handleSubmit,
  }
}