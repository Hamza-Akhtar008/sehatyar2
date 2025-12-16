import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Using the URL from Messages.tsx component

export const UploadFile = async (formData: FormData) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    // Assuming /messages/upload endpoint, adjust if known otherwise
    const response = await axios.post(`${BASE_URL}/messages/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("UploadFile error", error);
    throw error;
  }
};
