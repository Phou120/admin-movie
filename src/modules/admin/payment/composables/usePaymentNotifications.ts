import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
} from "../../../../common/utils/notification";

export interface PaymentNotification {
  id: string;
  type:
    | "payment_success"
    | "payment_failed"
    | "payment_pending"
    | "payment_approved"
    | "payment_rejected";
  title: string;
  message: string;
  paymentId: number;
  userId: number;
  amount?: number;
  currency?: string;
  packageName?: string;
  timestamp: Date;
  read: boolean;
}

export function usePaymentNotifications() {
  const { t } = useI18n();
  const notifications = ref<PaymentNotification[]>([]);
  const isListening = ref(false);

  // Computed properties
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length,
  );

  const recentNotifications = computed(() => notifications.value.slice(0, 5));

  // WebSocket connection (simplified - using polling for now)
  let pollInterval: number | null = null;
  const POLLING_INTERVAL = 30000; // 30 seconds

  // Start listening for payment notifications
  const startListening = () => {
    if (isListening.value) return;

    isListening.value = true;

    // Start polling for new payments
    pollInterval = window.setInterval(async () => {
      await checkForNewPayments();
    }, POLLING_INTERVAL);

    console.log("Payment notifications listener started");
  };

  // Stop listening
  const stopListening = () => {
    if (!isListening.value) return;

    isListening.value = false;

    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }

    console.log("Payment notifications listener stopped");
  };

  // Check for new payments (this would integrate with your API)
  const checkForNewPayments = async () => {
    try {
      // This would be your API call to check for new payments
      // For now, we'll use the existing payment composible
      const paymentComposible = await import("../composible/index");
      const response = await paymentComposible
        .PaymentComposible()
        .fetchAll(1, 1); // Get latest payment

      if (response.data && response.data.length > 0) {
        const latestPayment = response.data[0];
        const paymentTime = new Date(latestPayment.created_at);
        const oneMinuteAgo = new Date(Date.now() - 60000); // Check within last minute

        if (paymentTime > oneMinuteAgo) {
          // Check if we already notified about this payment
          const existingNotification = notifications.value.find(
            (n) => n.paymentId === latestPayment.id,
          );

          if (!existingNotification) {
            handleNewPayment(latestPayment);
          }
        }
      }
    } catch (error) {
      console.error("Error checking for new payments:", error);
    }
  };

  // Handle new payment and create notification
  const handleNewPayment = (payment: any) => {
    const notification = createPaymentNotification(payment);
    addNotification(notification);
    showNotificationToast(notification);
  };

  // Create payment notification object
  const createPaymentNotification = (payment: any): PaymentNotification => {
    const type = getNotificationType(payment.status);
    const { title, message } = getNotificationContent(type, payment);

    return {
      id: `payment_${payment.id}_${Date.now()}`,
      type,
      title,
      message,
      paymentId: payment.id,
      userId: payment.user_id,
      amount: payment.usePackage?.package?.price,
      currency: payment.currency?.short_name,
      packageName: payment.usePackage?.package?.type,
      timestamp: new Date(),
      read: false,
    };
  };

  // Get notification type based on payment status
  const getNotificationType = (status: string): PaymentNotification["type"] => {
    switch (status?.toLowerCase()) {
      case "success":
        return "payment_success";
      case "failed":
        return "payment_failed";
      case "pending":
        return "payment_pending";
      case "approved":
        return "payment_approved";
      case "rejected":
        return "payment_rejected";
      default:
        return "payment_pending";
    }
  };

  // Get notification title and message
  const getNotificationContent = (
    type: PaymentNotification["type"],
    payment: any,
  ) => {
    const userName = `${payment.user?.name || ""} ${
      payment.user?.surname || ""
    }`.trim();
    const packageName = payment.usePackage?.package?.type || "Package";

    switch (type) {
      case "payment_success":
        return {
          title: t("notifications.paymentSuccess.title", "Payment Successful"),
          message: t(
            "notifications.paymentSuccess.message",
            `New payment received from ${userName} for ${packageName}`,
          ),
        };
      case "payment_failed":
        return {
          title: t("notifications.paymentFailed.title", "Payment Failed"),
          message: t(
            "notifications.paymentFailed.message",
            `Payment from ${userName} for ${packageName} has failed`,
          ),
        };
      case "payment_pending":
        return {
          title: t("notifications.paymentPending.title", "New Payment Pending"),
          message: t(
            "notifications.paymentPending.message",
            `New payment from ${userName} for ${packageName} is pending`,
          ),
        };
      case "payment_approved":
        return {
          title: t("notifications.paymentApproved.title", "Payment Approved"),
          message: t(
            "notifications.paymentApproved.message",
            `Payment from ${userName} for ${packageName} has been approved`,
          ),
        };
      case "payment_rejected":
        return {
          title: t("notifications.paymentRejected.title", "Payment Rejected"),
          message: t(
            "notifications.paymentRejected.message",
            `Payment from ${userName} for ${packageName} has been rejected`,
          ),
        };
      default:
        return {
          title: t("notifications.newPayment.title", "New Payment"),
          message: t(
            "notifications.newPayment.message",
            `New payment received from ${userName}`,
          ),
        };
    }
  };

  // Show notification toast
  const showNotificationToast = (notification: PaymentNotification) => {
    switch (notification.type) {
      case "payment_success":
      case "payment_approved":
        showSuccessNotification(notification.message, notification.title);
        break;
      case "payment_failed":
      case "payment_rejected":
        showErrorNotification(notification.message, notification.title);
        break;
      case "payment_pending":
        showWarningNotification(notification.message, notification.title);
        break;
      default:
        showSuccessNotification(notification.message, notification.title);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: PaymentNotification) => {
    markAsRead(notification.id);

    // Navigate to payment details member/:memberId/payments
    if (notification.paymentId) {
      window.location.href = `/member/${notification.paymentId}/payments`;
    } else {
      window.location.href = "/payment";
    }
  };

  // Add notification
  const addNotification = (notification: PaymentNotification) => {
    notifications.value.unshift(notification);

    // Keep only last 50 notifications
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50);
    }

    // Play notification sound with specific type
    playNotificationSound(notification.type);
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true));
  };

  // Clear all notifications
  const clearAll = () => {
    notifications.value = [];
  };

  // Sound notification settings
  const soundEnabled = ref(true);
  const soundVolume = ref(0.5);
  let audioCache: { [key: string]: HTMLAudioElement | null } = {};

  // Preload notification sounds
  const preloadSounds = () => {
    const soundFiles = {
      success: "/sounds/notification.mp3",
      approved: "/sounds/notification.mp3",
      failed: "/sounds/notification.mp3",
      rejected: "/sounds/notification.mp3",
      pending: "/sounds/notification.mp3",
      default: "/sounds/notification.mp3",
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      try {
        const audio = new Audio();
        audio.preload = "auto";
        audio.volume = soundVolume.value;

        // Try to load the sound file
        audio.src = path;

        // Add error handling for missing sound files
        audio.addEventListener("error", () => {
          console.log(`Could not load sound file: ${path}`);
          audioCache[key] = null;
        });

        // Add success handling
        audio.addEventListener("canplaythrough", () => {
          console.log(`Sound file loaded successfully: ${path}`);
        });

        audio.load();

        audioCache[key] = audio;
      } catch (error) {
        console.log(`Could not preload sound ${key}:`, error);
        audioCache[key] = null;
      }
    });
  };

  // Play notification sound
  const playNotificationSound = async (type?: PaymentNotification["type"]) => {
    if (!soundEnabled.value) return;

    try {
      // Try to use the notification sound file
      const audio = audioCache["success"];

      if (audio) {
        // Use cached audio file
        audio.currentTime = 0;
        audio.volume = soundVolume.value;
        console.log("Playing notification sound:", audio.src);
        await audio.play();
      } else {
        console.log("Audio file not loaded, using fallback beep");
        // Fallback to Web Audio API beep
        await playBeepSound(type);
      }
    } catch (error) {
      console.log("Could not play notification sound:", error);
      console.log("Using fallback beep sound");
      // Final fallback to Web Audio API
      await playBeepSound(type);
    }
  };

  // Fallback beep sound using Web Audio API
  const playBeepSound = async (type?: PaymentNotification["type"]) => {
    try {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different tones for different payment types
      const frequencyMap = {
        payment_success: 1000, // High pitch for success
        payment_approved: 900, // High-mid pitch for approval
        payment_failed: 400, // Low pitch for failure
        payment_rejected: 350, // Very low pitch for rejection
        payment_pending: 600, // Mid pitch for pending
      };

      oscillator.frequency.value =
        frequencyMap[type as keyof typeof frequencyMap] || 800;
      oscillator.type = "sine";
      gainNode.gain.value = soundVolume.value * 0.3; // Reduce volume for beep

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2); // Longer beep
    } catch (error) {
      console.log("Could not play beep sound:", error);
    }
  };

  // Toggle sound on/off
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value;

    // Save user preference
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "payment_notifications_sound",
        soundEnabled.value.toString(),
      );
    }
  };

  // Set sound volume
  const setSoundVolume = (volume: number) => {
    soundVolume.value = Math.max(0, Math.min(1, volume));

    // Update all cached audio volumes
    Object.values(audioCache).forEach((audio) => {
      if (audio) {
        audio.volume = soundVolume.value;
      }
    });

    // Save user preference
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "payment_notifications_volume",
        soundVolume.value.toString(),
      );
    }
  };

  // Load user sound preferences
  const loadSoundPreferences = () => {
    if (typeof window !== "undefined") {
      const savedSoundEnabled = localStorage.getItem(
        "payment_notifications_sound",
      );
      const savedVolume = localStorage.getItem("payment_notifications_volume");

      if (savedSoundEnabled !== null) {
        soundEnabled.value = savedSoundEnabled === "true";
      }

      if (savedVolume !== null) {
        soundVolume.value = parseFloat(savedVolume);
      }
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: PaymentNotification["type"]): string => {
    const iconMap = {
      payment_success: "✅",
      payment_approved: "✅",
      payment_failed: "❌",
      payment_rejected: "❌",
      payment_pending: "⏳",
    };
    return iconMap[type] || "💰";
  };

  // Get notification color class
  const getNotificationColorClass = (
    type: PaymentNotification["type"],
  ): string => {
    const colorMap = {
      payment_success: "success",
      payment_approved: "success",
      payment_failed: "error",
      payment_rejected: "error",
      payment_pending: "warning",
    };
    return colorMap[type] || "default";
  };

  // Lifecycle hooks
  onMounted(() => {
    loadSoundPreferences();
    preloadSounds();
    startListening();
  });

  onUnmounted(() => {
    stopListening();
  });

  return {
    // State
    notifications,
    isListening,
    unreadCount,
    recentNotifications,
    soundEnabled,
    soundVolume,

    // Actions
    startListening,
    stopListening,
    markAsRead,
    markAllAsRead,
    clearAll,
    handleNotificationClick,
    getNotificationIcon,
    getNotificationColorClass,
    checkForNewPayments,

    // Sound controls
    toggleSound,
    setSoundVolume,
    playNotificationSound,
  };
}
