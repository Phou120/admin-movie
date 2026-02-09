import { io, Socket } from "socket.io-client";
import { ref, computed } from "vue";
import { playPaymentSound } from "../utils/notification.util";

/**
 * Payment notification payload from backend
 */
export interface PaymentNotificationPayload {
  title: string;
  paymentId: number;
}

/**
 * Socket notification state (shared across all instances)
 */
const socket = ref<Socket | null>(null);
const notifications = ref<PaymentNotificationPayload[]>([]);
const isConnected = ref(false);

/**
 * Flag to prevent duplicate event listeners
 */
let listenersSetup = false;

/**
 * Composable for WebSocket payment notifications
 * Listens to `payment_notification` events from backend
 * All admin clients join the global payment channel
 */
export const useSocketNotification = () => {
  /**
   * Connect to WebSocket server
   * @param serverUrl - The WebSocket server URL (defaults to VITE_API_BASE_URL without /api/)
   */
  const connect = (serverUrl?: string) => {
    // Only connect once
    if (socket.value?.connected) {
      console.log("Socket already connected");
      return;
    }

    // Remove /api/ from URL for Socket.IO connection
    const apiUrl = serverUrl || import.meta.env.VITE_API_BASE_URL;
    const url = apiUrl.replace(/\/api\/?$/, "");

    socket.value = io(url, {
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
      reconnection: true, // Auto-reconnect
      reconnectionAttempts: 10, // Number of reconnection attempts
      reconnectionDelay: 1000, // Initial reconnection delay
      reconnectionDelayMax: 5000, // Max reconnection delay
      timeout: 10000, // Connection timeout
    });

    setupEventListeners();
  };

  /**
   * Setup all socket event listeners (only once)
   */
  const setupEventListeners = () => {
    if (!socket.value || listenersSetup) return;

    listenersSetup = true;

    socket.value.on("connect", () => {
      isConnected.value = true;
      console.log("WebSocket connected:", socket.value?.id);
    });

    socket.value.on("disconnect", (reason) => {
      isConnected.value = false;
      console.log("WebSocket disconnected:", reason);
    });

    socket.value.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.value.on("reconnect", (attemptNumber) => {
      console.log("WebSocket reconnected after", attemptNumber, "attempts");
    });

    // Payment notification event from backend (use 'once' to prevent duplicates)
    socket.value.on(
      "payment_notification",
      (payload: PaymentNotificationPayload) => {
        handlePaymentNotification(payload);
      }
    );
  };

  /**
   * Handle payment notification from backend
   * Prevents duplicate notifications by checking if paymentId already exists
   * @param payload - The notification payload
   */
  const handlePaymentNotification = (payload: PaymentNotificationPayload) => {
    console.log("Payment notification received:", payload);

    // Check if notification with this paymentId already exists
    const existingIndex = notifications.value.findIndex(
      (n) => n.paymentId === payload.paymentId
    );

    // Only add if it doesn't already exist
    if (existingIndex === -1) {
      notifications.value.unshift(payload);

      // Keep only last 50 notifications
      if (notifications.value.length > 50) {
        notifications.value = notifications.value.slice(0, 50);
      }

      // Play notification sound
      playPaymentSound();
    } else {
      console.log("Duplicate notification ignored:", payload.paymentId);
    }

    // Emit custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("payment_notification", {
        detail: payload,
      })
    );
  };

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = () => {
    socket.value?.disconnect();
    socket.value = null;
    isConnected.value = false;
    listenersSetup = false;
  };

  /**
   * Mark notification as read by removing it from the list
   * @param paymentId - The payment ID to mark as read
   */
  const markAsRead = (paymentId: number) => {
    const index = notifications.value.findIndex(
      (n) => n.paymentId === paymentId
    );
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    notifications.value = [];
  };

  /**
   * Listen to payment notifications in components
   * @param callback - Callback function to handle notification
   * @returns Cleanup function to remove listener
   */
  const onPaymentNotification = (
    callback: (payload: PaymentNotificationPayload) => void
  ) => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<PaymentNotificationPayload>;
      callback(customEvent.detail);
    };

    window.addEventListener("payment_notification", handler);

    // Return cleanup function
    return () => {
      window.removeEventListener("payment_notification", handler);
    };
  };

  // Computed properties
  const unreadCount = computed(() => notifications.value.length);
  const recentNotifications = computed(() => notifications.value.slice(0, 5));

  return {
    // State
    socket,
    notifications,
    isConnected,
    unreadCount,
    recentNotifications,

    // Actions
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    onPaymentNotification,
  };
};

/**
 * Auto-connect on first import
 * Socket connects immediately when the app loads for real-time notifications
 */
const autoConnect = () => {
  const { connect } = useSocketNotification();
  connect();
};

autoConnect();
