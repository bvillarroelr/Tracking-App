// ESTE ARCHIVO TIENE ESTRUCTURA BASE PARA CUALQUIER FETCH A LA API BACKEND

const BASE_URL_APP = "http://localhost:8000/api/"; // -> ajustar según donde corra django (url app)
const BASE_URL_PROJECT = "http://localhost:8000/"; // -> ajustar según donde corra django (url proyecto django global)

export const fetchData = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if(token)
    {
        console.log("token enviado: ", token);
        headers["Authorization"] = `token ${token}`;
    }

    const response = await fetch(`${BASE_URL_APP}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if(!response.ok)
    {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la petición");
    }

    return await response.json();

};

export const fetchDataProject = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if(token)
    {
        console.log("token enviado: ", token);
        headers["Authorization"] = `token ${token}`;
    }

    const response = await fetch(`${BASE_URL_PROJECT}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if(!response.ok)
    {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la petición");
    }

    return await response.json();

};



