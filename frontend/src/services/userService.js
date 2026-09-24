export const publicarNuevoUser = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost/users/admin`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error al publicar el user:", error);
    throw new Error("Error de conexión con el servidor al Publicar");
  }
};

export async function actualizarUser(id, formData) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost/users/admin/${id}`, {
      method: "PUT", // o PATCH según tu backend
      body: formData, // FormData maneja tanto texto como archivos de imagen
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return { exito: false, mensaje: data.mensaje || "Error al actualizar" };
    }
    return { exito: true, data };
  } catch (error) {
    console.error("Error en actualizarUser:", error);
    return { exito: false, mensaje: "Error de conexión con el servidor al Actualizar" };
  }
}

export const obtenerUsersPublicos = async () => {
  try {
    const response = await fetch(`http://localhost/users/publicos`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener users públicos:", error);
    throw new Error("Error de conexión con el servidor al Obtener");
  }
};

export const obtenerUsersSocios = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost/users/socios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener users para socios:", error);
    throw new Error("Error de conexión con el servidor al Obtener");
  }
};

export const obtenerTodosLosUsersAdmin = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost/users/admin`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Devolvemos el JSON crudo del backend directamente
    return await response.json();

  } catch (error) {
    console.error("Error al obtener users de admin:", error);
    return { exito: false, mensaje: "Error de conexión con el servidor al Obtener" };
  }
};

export const eliminarUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost/users/admin/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) return { exito: false, mensaje: data.mensaje || "Error al eliminar" };
    return { exito: true, data };
  } catch (error) {
    return { exito: false, mensaje: "Error de conexión con el servidor al Eliminar" };
  }
};