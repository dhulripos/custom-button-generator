import useAxios from "./useAxios";
export default function useSubcategory() {
  const axios = useAxios();
  return () => getSubcategory(axios);
}

async function getSubcategory(axios) {
  try {
    const res = await axios.get("/subcategory");
    return res.data;
  } catch (error) {
    return error;
  }
}
