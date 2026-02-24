import { AvailabilityType, SlotType } from "./types";
import axiosInstance from "./axios";


interface Hospital{
  name:string;
  address:string
}
export interface Slot {
  id?: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string | null;
  endTime: string | null;
  isActive: boolean;
  availabilityType: AvailabilityType;

address:string
  slotType: SlotType;
  createdAt?: string;
  updatedAt?: string;
}

//get availability
export const getAvailability = async (doctorId?: number) => {
    try {
        const url = `/availability?doctorId=${doctorId}` 
        const response = await axiosInstance.get(url);
        return response.data as Slot[];
    } catch (error) {
        console.error("Error fetching availability:", error);
        throw error;
    }
};


//update availability
export const updateAvailability = async (id: number, data: Pick<Slot, 'dayOfWeek' | 'startTime' | 'endTime' | 'doctorId'>) => {
  try {
      const response = await axiosInstance.patch(`/availability/${id}`, data);
      return response.data as Slot;
  } catch (error) {
      console.error("Error updating availability:", error);
      throw error;
  }
};

//create availability
export const createAvailability = async (data: Partial<Slot>[]) => {
  try {
    const response = await axiosInstance.post("/availability", data);
    return response.data as Slot[];
  } catch (error) {
    console.error("Error creating availability:", error);
    throw error;
  }
};

//Patch Availability

export const PatchAvailability = async (data: Partial<Slot>,id:number) => {
  try {
    const response = await axiosInstance.patch(`/availability/${id}`, data);
    return response.data as Slot[];
  } catch (error) {
    console.error("Error creating availability:", error);
    throw error;
  }
};

//delete availability
export const deleteAvailability = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/availability/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting availability:", error);
        throw error;
    }
};

export async function ChangeDayAvailability(dayOfWeek: string, isActive: boolean) {
    try {
        const response = await axiosInstance.patch('/availability/toggle/day', {
            dayOfWeek,
            isActive,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

