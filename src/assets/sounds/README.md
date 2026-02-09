# Payment Notification Sounds

## Sound Files Location

Sound files are located in `/public/sounds/` directory:

- `notification.mp3` - Main notification sound (copied from `/src/assets/sounds/notification-sound-effect-372475.mp3`)

## Sound Usage

The notification system will automatically use the `notification.mp3` file for all payment types:

- ✅ Payment Success
- ✅ Payment Approved
- ❌ Payment Failed
- ❌ Payment Rejected
- ⏳ Payment Pending

## Custom Sounds

If you want different sounds for different payment types, add these files:

- `payment-success.mp3` - Success payments
- `payment-failed.mp3` - Failed payments
- `payment-pending.mp3` - Pending payments

## Current Sound

The system currently uses `notification-sound-effect-372475.mp3` as the notification sound.

## Browser Compatibility

The system includes a fallback using Web Audio API if sound files fail to load, ensuring compatibility across all browsers.