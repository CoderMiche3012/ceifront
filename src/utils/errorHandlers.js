export const formatError = (err) => {
    if (!err) return "Ocurrió un error inesperado.";
    //error de validacion
    if (typeof err === 'object' && !err.message && !Array.isArray(err)) {
        const etiquetas = {
            'nom_usuario': 'El nombre de usuario',
            'password': 'La contraseña',
            'correo': 'Correo electrónico: ',
            'telefono': 'El teléfono debe tener',
            'nombre': 'El nombre',
            'apellido_p': 'El apellido paterno solo debe tener',
            'apellido_m': 'El apellido materno solo debe tener'
        };
        const mensajes = Object.keys(err).map(campo => {
            let mensaje = Array.isArray(err[campo]) ? err[campo].join(" ") : String(err[campo]);
            const etiqueta = etiquetas[campo] || campo.replace(/_/g, ' ');
            //mensajes comunes del backend
            mensaje = mensaje.replace(/ya existe un\/a usuario con este\/a/i, "ya está registrado");
            mensaje = mensaje.replace(/este campo es requerido/i, "es obligatorio");
            if (mensaje.toLowerCase().includes(etiqueta.toLowerCase())) {
                return mensaje.charAt(0).toUpperCase() + mensaje.slice(1).trim();
            }
            return `${etiqueta} ${mensaje.toLowerCase()}`.trim();
        });
        return mensajes.join(". ") + ".";
    }
    //manejo de strings o errores con propiedad .message
    const mensaje = typeof err === 'string' ? err : err.message || "";
    //errores de Red 
    if (mensaje.includes("Network Error") || mensaje.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Revisa tu conexión.";
    }
    //errores de Credenciales
    if (mensaje.includes("No active account") || mensaje.includes("401") || mensaje.toLowerCase().includes("detail")) {
        return "El usuario o la contraseña no son correctos. Verifica tus datos.";
    }
    return mensaje || "Ocurrió un error inesperado.";
};
// errores para datos anidados
export const formatErrorAnidado = (err) => {
    if (!err) return "Ocurrió un error inesperado.";

    const etiquetas = {
        'apellido_m': 'el apellido materno',
        'apellido_p': 'el apellido paterno',
        'correo': 'el correo electrónico',
        'telefono': 'el teléfono',
        'nombre': 'el nombre',
        'municipio': 'el municipio',
        'calle': 'la calle',
        'colonia': 'la colonia',
        'numero': 'el número',
        'cp': 'el código postal',
        'familia': 'en los datos de la familia',
        'id_expediente': 'en el expediente'
    };

    const procesarErrores = (obj) => {
        let mensajes = [];

        if (Array.isArray(obj)) {
            // Si es un array de strings (mensajes directos)
            if (typeof obj[0] === 'string') {
                return [obj.join(" ")];
            }
            // Si es un array de objetos (como familia: [{}])
            obj.forEach((item) => {
                if (typeof item === 'object') {
                    mensajes = mensajes.concat(procesarErrores(item));
                }
            });
            return mensajes;
        }

        Object.keys(obj).forEach(key => {
            const valor = obj[key];
            const etiqueta = etiquetas[key] || key.replace(/_/g, ' ');

            if (Array.isArray(valor)) {
                if (typeof valor[0] === 'string') {
                    let msg = valor.join(" ");
                    msg = msg.replace(/este campo es requerido/i, "es obligatorio");
                    msg = msg.replace(/ya existe un\/a usuario con este\/a/i, "ya está registrado");
                    
                    // Evitar repetir la etiqueta si el mensaje ya la incluye
                    if (msg.toLowerCase().includes(etiqueta.toLowerCase())) {
                        mensajes.push(msg.charAt(0).toUpperCase() + msg.slice(1).trim());
                    } else {
                        mensajes.push(`${etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1)} ${msg.toLowerCase()}`.trim());
                    }
                } else {
                    mensajes = mensajes.concat(procesarErrores(valor));
                }
            } else if (typeof valor === "object" && valor !== null) {
                mensajes = mensajes.concat(procesarErrores(valor));
            } else {
                mensajes.push(String(valor));
            }
        });
        return mensajes;
    };

    if (typeof err === 'object' && !err.message) {
        const mensajes = procesarErrores(err);
        // Eliminar mensajes duplicados y unir
        const mensajesUnicos = [...new Set(mensajes)];
        return mensajesUnicos.join(". ") + (mensajesUnicos.length > 0 ? "." : "");
    }

    const mensaje = typeof err === 'string' ? err : err.message || "";
    if (mensaje.includes("Network Error") || mensaje.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Revisa tu conexión.";
    }
    if (mensaje.includes("401") || mensaje.toLowerCase().includes("detail")) {
        return "No tienes permisos o tus credenciales expiraron.";
    }

    return mensaje || "Ocurrió un error inesperado.";
};