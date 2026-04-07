export const formatError = (err) => {
    if (!err) return "Ocurrió un error inesperado.";

    // Caso 1: El error es un objeto de validación (ej. { correo: ["ya existe"], ... })
    if (typeof err === 'object' && !err.message && !Array.isArray(err)) {
        const etiquetas = {
            'nom_usuario': 'El nombre de usuario',
            'password': 'La contraseña',
            'correo': 'El correo electrónico',
            'telefono': 'El teléfono',
            'nombre': 'El nombre',
            'apellido_p': 'El apellido paterno'
        };

        const mensajes = Object.keys(err).map(campo => {
            let mensaje = Array.isArray(err[campo]) ? err[campo].join(" ") : String(err[campo]);
            const etiqueta = etiquetas[campo] || campo.replace(/_/g, ' ');

            // Normalización de mensajes comunes del backend
            mensaje = mensaje.replace(/ya existe un\/a usuario con este\/a/i, "ya está registrado");
            mensaje = mensaje.replace(/este campo es requerido/i, "es obligatorio");

            // Si el mensaje ya trae el nombre del campo, solo lo formateamos
            if (mensaje.toLowerCase().includes(etiqueta.toLowerCase())) {
                return mensaje.charAt(0).toUpperCase() + mensaje.slice(1).trim();
            }
            return `${etiqueta} ${mensaje.toLowerCase()}`.trim();
        });

        return mensajes.join(". ") + ".";
    }

    // Caso 2: Manejo de strings o errores con propiedad .message
    const mensaje = typeof err === 'string' ? err : err.message || "";

    // Errores de Red / Axios
    if (mensaje.includes("Network Error") || mensaje.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Revisa tu conexión.";
    }
    
    // Errores de Credenciales
    if (mensaje.includes("No active account") || mensaje.includes("401") || mensaje.toLowerCase().includes("detail")) {
        return "El usuario o la contraseña no son correctos. Verifica tus datos.";
    }

    return mensaje || "Ocurrió un error inesperado.";
};
export const formatErrorAnidado = (err) => {
    if (!err) return "Ocurrió un error inesperado.";

    const etiquetas = {
        'apellido_m': 'El apellido materno',
        'apellido_p': 'El apellido paterno',
        'correo': 'El correo electrónico',
        'telefono': 'El teléfono',
        'nombre': 'El nombre',
        'municipio': 'El municipio',
        'calle': 'El calle',
        'colonia': 'El colonia',
        'numero': 'El numero',
        'cp': 'El cp',
    };

    const procesarErrores = (obj, parentKey = "") => {
        let mensajes = [];

        Object.keys(obj).forEach(key => {
            const valor = obj[key];
            const campoCompleto = parentKey ? `${parentKey} ${key}` : key;

            if (Array.isArray(valor)) {
                // Caso: array de errores
                let mensaje = valor.join(" ");

                const etiqueta = etiquetas[key] || key.replace(/_/g, ' ');

                mensaje = mensaje.replace(/ya existe un\/a usuario con este\/a/i, "ya está registrado");
                mensaje = mensaje.replace(/este campo es requerido/i, "es obligatorio");

                if (mensaje.toLowerCase().includes(etiqueta.toLowerCase())) {
                    mensajes.push(mensaje.charAt(0).toUpperCase() + mensaje.slice(1).trim());
                } else {
                    mensajes.push(`${etiqueta} ${mensaje.toLowerCase()}`.trim());
                }

            } else if (typeof valor === "object" && valor !== null) {
                // 🔥 CLAVE: recursion para objetos anidados
                mensajes = mensajes.concat(procesarErrores(valor, campoCompleto));
            } else {
                mensajes.push(String(valor));
            }
        });

        return mensajes;
    };

    // Caso objeto (validaciones backend)
    if (typeof err === 'object' && !err.message) {
        const mensajes = procesarErrores(err);
        return mensajes.join(". ") + ".";
    }

    // Caso string o error normal
    const mensaje = typeof err === 'string' ? err : err.message || "";

    if (mensaje.includes("Network Error") || mensaje.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Revisa tu conexión.";
    }

    if (mensaje.includes("No active account") || mensaje.includes("401") || mensaje.toLowerCase().includes("detail")) {
        return "El usuario o la contraseña no son correctos. Verifica tus datos.";
    }

    return mensaje || "Ocurrió un error inesperado.";
};