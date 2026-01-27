import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getDoctorProfileByDoctorId = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}doctor-profile/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor profile for id ${id}:`, error);
    throw error;
  }
};
