import axiosInstance from "../axios";

interface User {
  fullName: string;
  gender: "male" | "female" | "other";
  country: string;
  city: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export const getUserById = async (userId: string | number) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};


//post a user 
export const postUserByDoctor = async (data:  FormData) => {
  try {
  

    const response = await axiosInstance.post("/users/created/By", data, {
      headers:
      { "Content-Type": "multipart/form-data" }
      
    });

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};