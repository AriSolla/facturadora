import { fetchAPI } from "./api";

export async function ping() {
  try {
    const data = await fetchAPI('ping.php');
    return data;
  } catch (error) {
    console.error('Error en ping:', error);
    throw error;
  }
}