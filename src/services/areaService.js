import api from "./api";
import { createServiceError, getFirstValue, sanitizeText, unwrapItem, unwrapList } from "./apiResponse";

export function normalizeArea(area = {}) {
  return {
    id: String(getFirstValue(area, ["id", "_id", "uuid"])),
    name: sanitizeText(getFirstValue(area, ["name", "title"])),
    coordinates: getFirstValue(area, ["coordinates", "coords", "polygon"], null),
    raw: area,
  };
}

export async function getAreas(params = {}) {
  try {
    const response = await api.get("/areas", { params });
    return unwrapList(response.data, ["areas"]).map(normalizeArea).filter((area) => area.id);
  } catch (error) {
    throw createServiceError(error, "تعذر تحميل المناطق.");
  }
}

export async function createArea({ name, coordinates } = {}) {
  try {
    const response = await api.post("/areas", {
      name: sanitizeText(name),
      coordinates,
    });
    return normalizeArea(unwrapItem(response.data, ["area"]));
  } catch (error) {
    throw createServiceError(error, "تعذر إنشاء المنطقة.");
  }
}

export async function joinArea(areaId) {
  try {
    const response = await api.post(`/areas/${areaId}/join`);
    return response.data;
  } catch (error) {
    throw createServiceError(error, "تعذر الانضمام إلى المنطقة.");
  }
}

export default {
  createArea,
  getAreas,
  joinArea,
};
