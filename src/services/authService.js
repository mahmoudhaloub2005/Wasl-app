import api from "./api";

export async function loginUser(email, password) {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/user");
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/logout");
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post("/forgot-password", {
    email,
  });

  return response.data;
}

export async function resetPassword(data) {
  const response = await api.post("/reset-password", data);
  return response.data;
}