import { io } from "socket.io-client";

export const initSocket = (userId: string) => {
  const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
    auth: { userId:userId },
    transports: ["websocket","polling"],
  });
  return socket;
};
