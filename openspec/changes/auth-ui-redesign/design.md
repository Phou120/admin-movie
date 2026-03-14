# Auth UI Redesign - Design Document

## Design Decisions

### Visual Style: Modern Gradient + Glassmorphism

This style provides the most modern and premium feel while remaining performant.

#### Background

```css
.auth-background {
  background: linear-gradient(135deg, #0d334a 0%, #2d6991 50%, #0d334a 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

#### Card Design

```css
.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Typography

```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

- **Headings**: 700 weight, 28px for main title
- **Subheadings**: 500 weight, 16px for subtitles
- **Body**: 400 weight, 14px for labels and text
- **Links**: 500 weight, 14px, primary color

### Spacing Scale

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

## Component Specifications

### 1. Login Page

```
┌─────────────────────────────────────────┐
│         [ Logo / Brand ]              │
│                                       │
│         Welcome Back!                  │
│         Sign in to your account        │
│                                       │
│  Email                                │
│  ┌─────────────────────────────────┐  │
│  │ 📧 user@example.com          [✓]│  │
│  └─────────────────────────────────┘  │
│                                       │
│  Password                             │
│  ┌─────────────────────────────────┐  │
│  │ 🔒 ••••••••              👁  │  │
│  └─────────────────────────────────┘  │
│  Remember me     Forgot password?      │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │        Sign In                  │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Don't have an account? Sign up       │
└─────────────────────────────────────────┘
```

**Components to use:**
- `a-card` for container
- `a-form` with validation
- `a-input` with prefix icon (UserOutlined)
- `a-input-password` with visibility toggle
- `a-checkbox` for "Remember me"
- `a-button` with loading state

**Validation rules:**
- Email: required, email format
- Password: required, min 6 characters

### 2. Forgot Password Page

```
┌─────────────────────────────────────────┐
│         [ Logo / Brand ]              │
│                                       │
│         Forgot Password?               │
│         Enter your email and we'll    │
│         send you an OTP code           │
│                                       │
│  Email Address                        │
│  ┌─────────────────────────────────┐  │
│  │ 📧 user@example.com          [✓]│  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │        Send OTP                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ← Back to Login                      │
└─────────────────────────────────────────┘
```

**Components to use:**
- `a-card` for container
- `a-form` with validation
- `a-input` with MailOutlined icon
- `a-button` with loading state

### 3. Verify OTP Page

```
┌─────────────────────────────────────────┐
│         [ Logo / Brand ]              │
│                                       │
│         Verify OTP                     │
│         Enter the 4-digit code sent   │
│         to your email                 │
│                                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │    │ │    │ │    │ │    │          │
│  └────┘ └────┘ └────┘ └────┘          │
│    1      2      3      4            │
│                                       │
│  Didn't receive code? Resend in 30s   │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │        Verify OTP               │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ← Back to Forgot Password             │
└─────────────────────────────────────────┘
```

**Components to use:**
- Custom OTP input component with 4 individual `a-input` fields
- Auto-focus next input on digit entry
- Backspace goes to previous input
- Countdown timer for "Resend" button

**OTP Input Component:**
```vue
<template>
  <div class="otp-input">
    <a-input
      v-for="(digit, index) in 4"
      :key="index"
      v-model:value="otp[index]"
      :ref="(el) => inputs[index] = el"
      maxlength="1"
      size="large"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
    />
  </div>
</template>
```

### 4. Reset Password Page

```
┌─────────────────────────────────────────┐
│         [ Logo / Brand ]              │
│                                       │
│         Reset Password                 │
│         Create a new password         │
│                                       │
│  New Password                         │
│  ┌─────────────────────────────────┐  │
│  │ 🔒 ••••••••              👁  │  │
│  └─────────────────────────────────┘  │
│  ▓▓▓▓▓▓▓▓▓▓  Medium             │
│                                       │
│  Confirm Password                     │
│  ┌─────────────────────────────────┐  │
│  │ 🔒 ••••••••              👁  │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │        Reset Password            │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ← Back to Login                      │
└─────────────────────────────────────────┘
```

**Components to use:**
- `a-card` for container
- `a-form` with validation
- `a-input-password` with visibility toggle
- `a-progress` for password strength meter
- `a-button` with loading state

**Password Strength Logic:**
```javascript
const strength = computed(() => {
  const score = calculateStrength(password.value);
  if (score < 2) return { label: 'Weak', percent: 33, status: 'error' };
  if (score < 4) return { label: 'Medium', percent: 66, status: 'normal' };
  return { label: 'Strong', percent: 100, status: 'success' };
});
```

## Animations

### Page Transitions

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
```

### Button Hover Effects

```css
.auth-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.3);
}

.auth-button:active {
  transform: translateY(0);
}
```

### Input Focus Animations

```css
.auth-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(13, 51, 74, 0.1);
}
```

## Responsive Design

### Mobile (< 768px)

```css
.auth-card {
  max-width: 90%;
  padding: var(--space-md);
}

.auth-title {
  font-size: 24px;
}
```

### Tablet (768px - 1024px)

```css
.auth-card {
  max-width: 480px;
  padding: var(--space-lg);
}
```

### Desktop (> 1024px)

```css
.auth-card {
  max-width: 520px;
  padding: var(--space-xl);
}
```

## Accessibility

- All form inputs have `aria-label` or `aria-labelledby`
- Error messages have `role="alert"` and `aria-live="polite"`
- Buttons have focus states visible
- Keyboard navigation works for all interactive elements
- Color contrast meets WCAG AA standards (4.5:1 for normal text)
- OTP inputs support pasting full code

## File Structure

```
src/modules/admin/auth/
├── Login.vue                  # Main login page
├── components/
│   ├── forgotPassword.vue    # Forgot password (redesigned)
│   ├── verifyOTP.vue        # OTP verification (redesigned)
│   ├── resetPassword.vue    # Reset password (redesigned)
│   ├── OtpInput.vue        # New: Reusable OTP input component
│   └── PasswordStrength.vue # New: Password strength meter
├── composible/
│   └── auth.ts             # Existing API composable (no changes)
└── styles/
    └── auth.scss           # Shared auth styles
```

## Implementation Notes

### Use Ant Design Components Where Possible

- ✅ `a-card`, `a-form`, `a-input`, `a-input-password`
- ✅ `a-button`, `a-checkbox`, `a-progress`
- ✅ `a-spin` for loading states
- ✅ `a-message` for notifications

### Custom Components

1. **OtpInput.vue** - Digit-by-digit OTP input with auto-focus
2. **PasswordStrength.vue** - Visual password strength indicator

### Form Validation

Use Ant Design's built-in form validation:

```typescript
const rules = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { min: 6, message: 'Password must be at least 6 characters' }
  ]
};
```

### API Integration

Keep existing `auth.ts` composable - no changes needed to API layer.

## Performance Optimizations

1. **Lazy Load Components**: Only load auth components when route is accessed
2. **Tree-shake Ant Design**: Import only used components
3. **CSS-in-JS or Scoped CSS**: Use scoped styles to avoid global CSS conflicts
4. **Debounce Validation**: Don't validate on every keystroke for password strength
5. **GPU Animations**: Use `transform` and `opacity` for animations

## Success Metrics

- Visual consistency across all auth pages (100%)
- Form validation feedback time < 100ms
- Page load time < 2s on 3G
- Accessibility score > 90 (Lighthouse)
- User satisfaction (subjective testing)
