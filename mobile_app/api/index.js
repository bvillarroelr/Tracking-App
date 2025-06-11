// ESTE ARCHIVO TIENE ESTRUCTURA BASE PARA CUALQUIER FETCH A LA API


// NOTE: Esta ip debe ser la del pc donde se está corriendo el back, no la de Django
const BASE_URL = "http://192.168.1.16:8000/api/"; // -> ajustar según ip local host

export const fetchData = async (endpoint, method = "GET", body = null, token = null) => {

    const headers = {
        "Content-Type": "application/json",
    };
    
    if(token)
    {
        console.log("token enviado:", token);
        headers["Authorization"] = `token ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if(!response.ok)
    {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la petición")
    }

    return await response.json();

};

// -> testear conexión con el backend

export const pingBackend = () => fetchData("ping/");
