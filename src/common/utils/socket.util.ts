import { io } from "socket.io-client";

// Global socket connection - no userId needed for payment notifications
export const socket = io(import.meta.env.VITE_API_BASE_URL, {
  transports: ["websocket"],
});
