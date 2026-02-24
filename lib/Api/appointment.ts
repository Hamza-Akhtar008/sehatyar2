import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const postAppointment = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}appointments`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getUpcomingAppointments = async (doctorId: number | string) => {
    try {
        const response = await axios.get(`${BASE_URL}appointments/for/doctors?doctorId=${doctorId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments for logged-in doctor:', error);
        throw error;
    }
};
