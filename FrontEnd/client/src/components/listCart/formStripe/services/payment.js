import api from "./api"

export const getConfig = async () => {
  try {
    const url = "Order/config";
    const rs = await api.get(url);
    return rs.data;
} catch (error) {
    return [];
}
}