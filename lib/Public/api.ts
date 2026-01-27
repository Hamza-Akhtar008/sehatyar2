import axiosInstance from "../axios"

export async function SearchFunction(specialization: string, city: string) {
  try {
    const response = await axiosInstance.get("doctor-profile/specialization", {
      params: {
        specialization,
        city,
      },
    })
    return response.data
  } catch (error: any) {
    throw error
  }
}
