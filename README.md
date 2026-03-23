## Tecnologías utilizadas

* **Core:** eact (Vite)
* **Estilos:** Tailwind CSS
* **Enrutado:** React Router DOM
* **Iconografía:** Lucide React
* **Comunicación:** Fetch API
* **Estado y Lógica:** Hooks personalizados

---

## Instalación y ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd proyecto
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crear un archivo `.env` en la raíz del proyecto:
    ```env
    VITE_API_URL=http://localhost:8000
    ```

4.  **Ejecutar el proyecto:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en: `http://localhost:5173`

---

## Autenticación y Seguridad

El sistema utiliza autenticación basada en **JWT (JSON Web Tokens)**.

### Almacenamiento (localStorage):
* `access`: Token de acceso.
* `refresh`: Token de refresco.
* `user`: Información del usuario autenticado.

### Flujo de acceso:
1.  El usuario inicia sesión.
2.  Se reciben y almacenan los tokens y la info del usuario.
3.  Redirección automática a `/app`.
4.  **Rutas protegidas:**
    * `PrivateRoute`: Solo usuarios autenticados.
    * `AdminRoute`: Solo usuarios con rol de administrador.

---

## Funcionalidades principales

### Usuarios
* **Gestión Completa:** Listado, búsqueda, filtros por rol/estatus y paginación.
* **Operaciones:** Crear, editar, ver detalles y activar/desactivar usuarios.
* **Perfil:** Edición de datos personales y cambio de contraseña.

### Roles y permisos
* **Control Granular:** Crear y editar roles con permisos específicos por módulo.
* **Matriz de Permisos:** Configuración de acciones (*Ver, Crear, Editar, Eliminar*).
* **Protección:** Roles críticos (como el Administrador) están protegidos contra eliminación.

---

## Arquitectura

La aplicación sigue un patrón de separación de responsabilidades para facilitar el mantenimiento:

### Hooks personalizados (Lógica de negocio)
* `useUsersData`: Manejo de datos, filtros y paginación.
* `useUsersUI`: Control de modales y acciones de interfaz.
* `useRoles`: Gestión del CRUD de roles y permisos.
* `usePerfilForm`: Lógica para el manejo del perfil de usuario.

### Servicios y Utilidades
* **Servicios:** Centralizan las llamadas a la API mediante `fetch`, manejando headers y tokens de forma automática.
* **Utilidades:** Funciones para `normalizeStatus`, `formatError` y transformadores de datos para la matriz de permisos.

---

## Estructura del proyecto

```text
src/
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizables (UI, tablas, modales)
│   ├── usuarios/
│   ├── roles/
│   ├── shared/
│   └── ui/
├── hooks/            # Lógica de negocio encapsulada
├── layouts/          # Estructuras de página (Main Layout)
├── pages/            # Vistas principales
├── routes/           # Definición de rutas y guardas
├── services/         # Consumo de API
└── utils/            # Funciones auxiliares y formateadores