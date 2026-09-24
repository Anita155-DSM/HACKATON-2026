// ==========================================
// OBTENER TODOS LOS USERS
// ==========================================
export const obtenerTodosLosUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    // Acá cambiamos a la nueva ruta /users
    const response = await fetch(`http://localhost/users`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo users:", error);
    throw new Error("Error de conexión con el servidor al Obtener");
  }
};

// ==========================================
// GESTIONAR ESTADO DEL SOLICITUD
// ==========================================
export const gestionarEstadoSolicitud = async (id, nuevoEstado) => {
  try {
    const token = localStorage.getItem("token");

    // Apuntamos a la ruta exacta de tu adminRoutes: /solicitudes/:id
    const response = await fetch(`http://localhost/admin/solicitudes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nuevoEstado }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al gestionar la solicitud:", error);
    throw new Error("Error de conexión con el servidor");
  }
};

// ==========================================
// ACTUALIZAR DATOS DEL USER
// ==========================================
export const actualizarDatosUser = async (id, datosActualizados) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosActualizados),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar user:", error);
    return {
      exito: false,
      mensaje: "Error de conexión con el servidor al actualizar",
    };
  }
};

// ==========================================
// CREAR EVENTOS (CALENDARIO ADMIN)
// ==========================================
export const crearNuevoEvento = async formData => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost/eventos/admin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // 1. Leemos la respuesta como texto bruto primero
    const textResponse = await response.text();

    try {
      // 2. Intentamos parsearlo a JSON
      return JSON.parse(textResponse);
    } catch (parseError) {
      // 3. Si falla, es porque el backend devolvió HTML o texto (Error del servidor)
      console.error("Error por parte del servidor.");
      return { exito: false, mensaje: "Error del servidor" };
    }
  } catch (error) {
    console.error("Error de conexión al crear evento:", error);
    return { exito: false, mensaje: "Error de conexión con el servidor" };
  }
};

// ==========================================
// OBTENER TODOS LOS EVENTOS (CALENDARIO ADMIN)
// ==========================================
export const obtenerTodosLosEventos = async () => {
  try {
    const token = localStorage.getItem("token");

    // Cambiamos /admin por /users
    const response = await fetch(`http://localhost/eventos/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return { exito: false, data: [] };
  }
};

// ==========================================
// ACTUALIZAR EVENTO (ADMIN)
// ==========================================
export const actualizarEvento = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost/eventos/admin/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    return { exito: false, mensaje: "Error de conexión con el servidor" };
  }
};

// ==========================================
// ELIMINAR EVENTO (ADMIN)
// ==========================================
export const eliminarEvento = async id => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost/eventos/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return { exito: false, mensaje: "Error de conexión con el servidor" };
  }
};
