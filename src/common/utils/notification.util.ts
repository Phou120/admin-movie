import notificationSound from "../../assets/sounds/notification-sound-effect-372475.mp3";

// Pre-load audio for payment notifications
const paymentAudio = new Audio(notificationSound);
paymentAudio.preload = "auto";

// Flag to track if audio has been "unlocked" by user interaction
let audioUnlocked = false;
let unlockAttempted = false;

/**
 * Unlock audio by playing a silent sound.
 * This should be called on first user interaction (click, keypress, etc.)
 * Browsers block autoplay until user interacts with the page.
 */
export async function unlockAudio(): Promise<boolean> {
  if (audioUnlocked) return true;

  try {
    // Play and immediately pause to unlock audio
    await paymentAudio.play();
    paymentAudio.pause();
    paymentAudio.currentTime = 0;
    audioUnlocked = true;
    console.log("Audio unlocked successfully");
    return true;
  } catch (error) {
    console.log("Audio unlock attempt:", (error as Error).message);
    return false;
  }
}

/**
 * Play notification sound for payment alerts
 * Automatically tries to unlock audio if needed
 */
export async function playPaymentSound(): Promise<void> {
  // Reset to beginning
  paymentAudio.currentTime = 0;

  // If already unlocked, play directly
  if (audioUnlocked) {
    try {
      await paymentAudio.play();
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
    return;
  }

  // Try to play (will fail if not unlocked)
  try {
    await paymentAudio.play();
    // If successful, pause and reset for next time
    paymentAudio.pause();
    paymentAudio.currentTime = 0;
    audioUnlocked = true;
  } catch (error: any) {
    // If autoplay is blocked, the sound will play on next user interaction
    if (error.name === "NotAllowedError") {
      console.log("Sound queued - will play after user interaction");
    } else {
      console.warn("Could not play notification sound:", error);
    }
  }
}

/**
 * Initialize audio unlock on user interactions
 * Keeps trying until successfully unlocked
 */
function initAudioUnlock(): void {
  if (unlockAttempted) return;
  unlockAttempted = true;

  const unlockHandler = async () => {
    if (audioUnlocked) {
      // Remove all listeners once unlocked
      window.removeEventListener("click", unlockHandler);
      window.removeEventListener("keydown", unlockHandler);
      window.removeEventListener("touchstart", unlockHandler);
      window.removeEventListener("mousedown", unlockHandler);
      return;
    }

    const success = await unlockAudio();
    if (success) {
      // Remove all listeners once unlocked
      window.removeEventListener("click", unlockHandler);
      window.removeEventListener("keydown", unlockHandler);
      window.removeEventListener("touchstart", unlockHandler);
      window.removeEventListener("mousedown", unlockHandler);
    }
  };

  // Add multiple event listeners to catch first interaction
  window.addEventListener("click", unlockHandler);
  window.addEventListener("keydown", unlockHandler);
  window.addEventListener("touchstart", unlockHandler);
  window.addEventListener("mousedown", unlockHandler);
}

// Auto-initialize audio unlock when this module loads
if (typeof window !== "undefined") {
  initAudioUnlock();
}
