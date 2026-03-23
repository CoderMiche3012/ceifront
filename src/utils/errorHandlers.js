export const formatError = (err) => {
    //si el error viene como objeto y no tiene propiedad "message",
    if (typeof err === 'object' && !err.message) {
        //cambio de nombres internos de campos a etiquetas más legibles
        const etiquetas = {
            'nom_usuario': 'El nombre de usuario',
            'password': 'La contraseña',
            'correo': 'El correo electrónico',
            'telefono': 'El teléfono',
            'nombre': 'El nombre',
            'apellido_p': 'El apellido paterno'
        };
        //recorremos cada campo con error para construir un mejor mensaje 
        return Object.keys(err).map(campo => {
            // si el error del campo es un arreglo se une en un solo texto, si no se usa el valor directamente
            let mensaje = Array.isArray(err[campo]) ? err[campo].join(" ") : err[campo];
            //se busca una etiqueta amigable para el campo o  el nombre del campo reemplazando por espacio
            const etiqueta = etiquetas[campo] || campo.replace('_', ' ');
            //mensajes técnicos del backend por textos más entendibles
            mensaje = mensaje.replace("Ya existe un/a usuario con este/a nom usuario.", "ya está registrado");
            mensaje = mensaje.replace("Este campo es requerido.", "es obligatorio");
            //si el mensaje ya incluye la etiqueta solo se corrige el formato
            if (mensaje.toLowerCase().includes(etiqueta.toLowerCase())) {
                return mensaje.charAt(0).toUpperCase() + mensaje.slice(1).trim();
            }
            return `${etiqueta} ${mensaje.toLowerCase()}`.trim();
        }).join(". ") + "."; 
    }

    //si el error viene como texto plano o dentro de err.message
    const mensaje = typeof err === 'string' ? err : err.message || "";

    //errores comunes de autenticación
    if (mensaje.includes("No active account") || mensaje.includes("401") || mensaje.includes("detail")) {
        return "El usuario o la contraseña no son correctos. Verifica tus datos.";
    }
    //errores de conexión con el servidor
    if (mensaje.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Revisa tu conexión.";
    }
    // si no coincide con ningún caso anterior,
    return mensaje || "Ocurrió un error inesperado.";
};