# Auth UI Redesign - Tasks

## Phase 1: Setup & Shared Components

### 1.1 Create Shared Styles
- [x] Create `src/modules/admin/auth/styles/auth.scss`
- [x] Define CSS custom properties (colors, spacing, typography)
- [x] Create gradient background animation
- [x] Create glass-morphism card styles
- [x] Add responsive breakpoints

### 1.2 Create Reusable Components
- [x] Create `src/modules/admin/auth/components/OtpInput.vue`
  - [x] 4 individual input boxes
  - [x] Auto-focus next input on digit entry
  - [x] Backspace goes to previous input
  - [x] Support pasting full OTP code
  - [x] Clear button
- [x] Create `src/modules/admin/auth/components/PasswordStrength.vue`
  - [x] Calculate password strength (0-5 score)
  - [x] Display progress bar with color coding
  - [x] Show strength label (Weak/Medium/Strong)
  - [x] Real-time updates

## Phase 2: Login Page Redesign

### 2.1 Login.vue Component
- [x] Update layout with glass-morphism card
- [x] Add logo/branding section
- [x] Update form fields (Email, Password)
- [x] Add "Remember me" checkbox
- [x] Update forgot password link
- [x] Add loading state to submit button
- [x] Add hover/active button animations
- [x] Add input focus animations
- [x] Update error handling with a-alert

### 2.2 Login Page Features
- [x] Password visibility toggle (built-in to a-input-password)
- [x] Client-side form validation
- [x] Success notification on login
- [x] Error notification with clear messages
- [x] Redirect logic after successful login

## Phase 3: Forgot Password Page Redesign

### 3.1 forgotPassword.vue Component
- [x] Replace custom form with Ant Design components
- [x] Update layout to match Login page
- [x] Use a-card for container
- [x] Use a-form with a-input for email
- [x] Add MailOutlined icon prefix
- [x] Add loading state to submit button
- [x] Add back to login link
- [x] Update error handling

### 3.2 Forgot Password Page Features
- [x] Email validation
- [x] Success notification on OTP sent
- [x] Redirect to OTP verification page
- [x] Error handling for invalid email

## Phase 4: OTP Verification Page Redesign

### 4.1 verifyOTP.vue Component
- [x] Replace custom form with Ant Design components
- [x] Update layout to match other auth pages
- [x] Use OtpInput component (from 1.2)
- [x] Add countdown timer for "Resend OTP"
- [x] Add loading state to submit button
- [x] Add back to forgot password link

### 4.2 OTP Verification Page Features
- [x] OTP validation (4 digits)
- [x] Auto-focus first input on mount
- [x] Auto-focus next/previous inputs
- [x] Support paste full OTP code
- [x] Countdown timer (30-60 seconds)
- [x] Resend OTP button (disabled during countdown)
- [x] Success notification on verification
- [x] Redirect to reset password page

## Phase 5: Reset Password Page Redesign

### 5.1 resetPassword.vue Component
- [x] Replace custom form with Ant Design components
- [x] Update layout to match other auth pages
- [x] Use a-card for container
- [x] Use a-input-password for both password fields
- [x] Add PasswordStrength component
- [x] Add loading state to submit button
- [x] Add back to login link

### 5.2 Reset Password Page Features
- [x] Password validation (min 6 characters)
- [x] Confirm password validation (must match)
- [x] Real-time password strength indicator
- [x] Password visibility toggles
- [x] Success notification on reset
- [x] Redirect to login page after success

## Phase 6: Consistency & Polish

### 6.1 Visual Consistency
- [x] Ensure all pages use same card style
- [x] Ensure all pages use same button styles
- [x] Ensure all pages use same input styles
- [x] Ensure all pages use same error/success styling
- [x] Ensure all pages use same background animation

### 6.2 Animations
- [x] Add page transition animations (fade-in, slide-up)
- [x] Add button hover/active states
- [x] Add input focus states
- [x] Add card hover effect (subtle lift)

### 6.3 Responsive Design
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [x] Adjust spacing and font sizes for each breakpoint

## Phase 7: Accessibility

### 7.1 ARIA Attributes
- [ ] Add aria-label to all form inputs
- [ ] Add aria-labelledby where appropriate
- [ ] Add role="alert" to error messages
- [ ] Add aria-live="polite" to dynamic content

### 7.2 Keyboard Navigation
- [ ] Ensure all interactive elements are keyboard accessible
- [ ] Tab order makes sense
- [ ] Focus indicators are visible
- [ ] Enter/Space triggers buttons

### 7.3 Screen Reader Support
- [ ] Test with screen reader
- [ ] Ensure form labels are announced
- [ ] Ensure errors are announced
- [ ] Ensure success messages are announced

## Phase 8: Testing & Optimization

### 8.1 Functional Testing
- [ ] Test login flow end-to-end
- [ ] Test forgot password flow end-to-end
- [ ] Test OTP verification flow end-to-end
- [ ] Test reset password flow end-to-end
- [ ] Test form validation
- [ ] Test error handling
- [ ] Test success flows

### 8.2 Performance Testing
- [ ] Run Lighthouse audit
- [ ] Optimize bundle size
- [ ] Check animation performance
- [ ] Verify lazy loading works

### 8.3 Cross-browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)

## Phase 9: Documentation

### 9.1 Code Documentation
- [ ] Add JSDoc comments to OtpInput component
- [ ] Add JSDoc comments to PasswordStrength component
- [ ] Document any custom utility functions

### 9.2 Update CLAUDE.md
- [ ] Document new auth component structure
- [ ] Document OtpInput component usage
- [ ] Document PasswordStrength component usage
- [ ] Update auth module documentation

## Dependencies

- Ant Design Vue 4.x components (already installed)
- Vue 3 Composition API
- Vue Router (for navigation)

## Estimated Time

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Setup & Shared Components | 4-6 hours |
| Phase 2: Login Page Redesign | 2-3 hours |
| Phase 3: Forgot Password Page Redesign | 1-2 hours |
| Phase 4: OTP Verification Page Redesign | 3-4 hours |
| Phase 5: Reset Password Page Redesign | 2-3 hours |
| Phase 6: Consistency & Polish | 2-3 hours |
| Phase 7: Accessibility | 1-2 hours |
| Phase 8: Testing & Optimization | 2-3 hours |
| Phase 9: Documentation | 1-2 hours |
| **Total** | **18-28 hours** |

## Notes

- The `auth.ts` composable does NOT need to be modified
- All API calls remain the same
- Focus is on UI/UX improvements using Ant Design Vue
- Backend integration points remain unchanged
