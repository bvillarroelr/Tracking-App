import { fetchData } from "./index";

export const loginUser = (credentials) => fetchData("login/", "POST", credentials)
export const registerUser = (data) => fetchData("register/", "POST", data)
