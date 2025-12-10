import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const accessToken = localStorage.getItem("access_token");

export const createClinic = async (payload: {
  name: string;
  email: string;
  phone: string;
  isDoctorClinic: boolean;
  address: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}clinic`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
};


export const getClinics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}clinic`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinics:", error);
    throw error;
  }
};


export const getDoctors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}doctor-profile?role=doctor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getIndividualDoctors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}doctor-profile/individual/doctor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
}

export const createIndividualDoctorProfile = async (payload: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}doctor-profile/individual/doctor`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw error;
  }
};


export const getReceptionist = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users?role=receptionist`);
    return response.data;
  } catch (error) {
    console.error("Error fetching receptionist:", error);
    throw error;
  }
}


export const getPatients = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users?role=patient`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}

export const createPatient = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}users`, { ...payload, role: "patient" });
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};


export const getAppointments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}appointments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}


export const deleteClinic = async (id:number)=>{
  try {
    const response = await axios.delete(`${BASE_URL}clinic/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting clinic:", error);
    throw error;
  }
}

export const deleteDoctor = async (id:number)=>{
  try {
    const response = await axios.delete(`${BASE_URL}doctor-profile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
}


export const deleteReceptionist = async (id:number)=>{
  try {
    const response = await axios.delete(`${BASE_URL}users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting receptionist:", error);
    throw error;
  }
}


export const deletePatient = async (id:number)=>{
  try {
    const response = await axios.delete(`${BASE_URL}users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
}


export const deleteAppointment = async (id:number)=>{
  try {
    const response = await axios.delete(`${BASE_URL}appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
}


export const loginUser = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}auth/login`, payload);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};



export const getClinicDashboardOverview = async () => {
  try {
    const response = await axios.get(`${BASE_URL}clinic/stats/overview`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching clinic dashboard overview:", error);
    throw error;
  }
};


export const getDoctorsByClinic = async () => {
  try {
    const response = await axios.get(`${BASE_URL}doctor-profile/by/clinic`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors by clinic:", error);
    throw error;
  }
};


export const createDoctorProfileForClinic = async (payload: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}doctor-profile/by/clinic`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating doctor profile for clinic:", error);
    throw error;
  }
};

export const getPatientsByClinic = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users/by/clinic?role=patient`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patients by clinic:", error);
    throw error;
  }
};

export const createPatientForClinic = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}users/by/clinic`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating patient for clinic:", error);
    throw error;
  }
};


export const getReceptionistsByClinic = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users/by/clinic?role=clinic_receptionist`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching receptionists by clinic:", error);
    throw error;
  }
};
