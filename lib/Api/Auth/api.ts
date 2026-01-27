import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export async function login(email: string, password: string) {
	try {
		const response = await axiosInstance.post('/auth/login', {
			email,
			password,
		});
		return response.data;
	} catch (error: any) {
		throw error;
	}
}


export async function registerDoctor(payload: any) {
    try {
        const response = await axiosInstance.post('/doctor-profile', payload,
            {
                headers: {
                   "Content-Type": "multipart/form-data"
                },
            }
        );
        return response.data;

    } catch (error: any) {
        throw error;
    }   
}


export async function registerDoctor0(payload: FormData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = localStorage.getItem("authToken");
    try {

        const response = await axiosInstance.post('/doctor-profile/by/clinic', payload,
            
        );
        return response.data;

    } catch (error: any) {
        throw error;
    }   
}

export async function registerDoctorIndividual(payload: FormData) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = localStorage.getItem("authToken");
    try {

        const response = await axiosInstance.post('doctor-profile/individual/doctor', payload,
            
        );
        return response.data;

    } catch (error: any) {
        throw error;
    }   
}
