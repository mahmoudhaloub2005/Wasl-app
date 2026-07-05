import api from "./api";

export async function getGenerators(params = {}) {
  const response = await api.get("/generators", { params });
  return response.data;
}

export async function searchGenerators(query) {
  const response = await api.get("/generators/search", {
    params: { q: query },
  });

  return response.data;
}

export async function getGeneratorDetails(id) {
  const response = await api.get(`/generators/${id}`);
  return response.data;
}

export async function compareGenerators(ids) {
  const response = await api.get("/generators/compare", {
    params: { ids },
  });

  return response.data;
}
