# Tasks: Customer Status Badge Redesign

## Implementation Tasks

### Phase 1: Component Creation
- [x] **Task 1.1**: Create `CustomerStatusBadge.vue` component file
  - Location: `src/components/CustomerStatusBadge.vue`
  - Set up basic script setup template
  - Define props interface (status, customerId, loading, disabled)
  - Define emits interface (change event)

- [x] **Task 1.2**: Implement badge display
  - Add `<a-badge>` component to template
  - Bind status color classes dynamically
  - Add status icon (WarningOutlined, CheckCircleOutlined, CloseCircleOutlined)
  - Add animated status dot
  - Implement status label using i18n (`t('status.pending')`)

- [x] **Task 1.3**: Implement popover menu
  - Add `<a-popover>` component wrapping badge
  - Create 3 menu options (pending, approved, blacklisted)
  - Add icons and labels to each option
  - Add descriptions under each status label
  - Implement click handlers for each option

- [x] **Task 1.4**: Add component state and logic
  - Add `popoverVisible` ref state
  - Add `isUpdating` ref state
  - Implement `handleStatusSelect` function
  - Implement `togglePopover` function
  - Add loading state computation
  - Emit change event with customerId and newStatus

- [x] **Task 1.5**: Add badge styling (SCSS)
  - Create base badge styles (pill shape, padding, transition)
  - Add status-specific color classes (pending, approved, blacklisted)
  - Add gradient backgrounds
  - Implement hover effects (scale, shadow)
  - Implement active/click effect
  - Add disabled state styles

- [x] **Task 1.6**: Add status dot animation
  - Create `@keyframes` for pulse animation
  - Apply different pulse timing for each status
  - Ensure smooth 60fps animation (use transform/opacity)

- [x] **Task 1.7**: Style popover menu
  - Add menu container styles
  - Style individual status options
  - Add hover effects for options
  - Add "selected" indicator (checkmark) for current status
  - Add smooth slide-down animation for popover

### Phase 2: Integration
- [x] **Task 2.1**: Update Customer.vue imports
  - Import CustomerStatusBadge component
  - Remove old select imports if no longer needed

- [x] **Task 2.2**: Replace status column template
  - Locate current `<a-select>` in status column template
  - Replace with `<CustomerStatusBadge>`
  - Bind required props (status, customerId, loading)
  - Bind change event handler

- [x] **Task 2.3**: Update handleStatusChange function
  - Ensure it accepts (customerId, newStatus) parameters
  - Keep existing API call logic (updateStatus from useCustomer)
  - Keep error handling and notifications

- [x] **Task 2.4**: Add v-memo optimization
  - Add `v-memo="[record.status, record.statusLoading]"` to badge
  - Verify re-rendering only when status changes

- [x] **Task 2.5**: Remove old status code
  - Comment out old `<a-select>` and `<a-select-option>` code
  - Keep for rollback safety initially
  - Remove old status-select CSS classes

### Phase 3: Polish & Optimization
- [x] **Task 3.1**: Implement loading state
  - Show loading spinner on badge during API call
  - Disable badge interaction while loading
  - Add visual feedback (opacity or spinner)

- [x] **Task 3.2**: Add error handling
  - Revert status on API failure
  - Show error notification (use existing showErrorNotification)
  - Add shake animation on error

- [ ] **Task 3.3**: Implement optimistic updates (optional)
  - Update badge immediately on click
  - Revert if API fails
  - Decide: optimistic or loading spinner?

- [x] **Task 3.4**: Add keyboard navigation
  - Add `@keydown` handler to badge
  - Implement Enter/Space to open popover
  - Implement Escape to close popover
  - Implement Arrow keys to navigate options
  - Ensure proper focus management

- [x] **Task 3.5**: Add ARIA attributes
  - Add `aria-label` to badge
  - Add `aria-haspopup="true"`
  - Add `aria-expanded` bound to popoverVisible
  - Add `role="button"`
  - Add proper `tabindex`

### Phase 4: Responsive Design
- [x] **Task 4.1**: Test mobile layout
  - Check badge appearance on mobile viewport
  - Ensure touch target ≥ 44×44px
  - Test popover positioning on small screens

- [x] **Task 4.2**: Add mobile-specific styles
  - Adjust badge size for mobile
  - Make popover full-width on very small screens
  - Add tap highlight color

- [ ] **Task 4.3**: Test on actual devices (MANUAL)
  - Test on iOS Safari
  - Test on Android Chrome
  - Verify popover doesn't get clipped

### Phase 5: Internationalization
- [x] **Task 5.1**: Verify status translations exist
  - Check `src/locales/en.json` for status.pending, status.approved, status.blacklisted
  - Check `src/locales/lo.json` for Lao translations
  - Add any missing translations

- [x] **Task 5.2**: Add status descriptions (optional)
  - Add description keys to locales:
    - status.pendingDescription: "Awaiting approval"
    - status.approvedDescription: "Account active"
    - status.blacklistedDescription: "Account blocked"

- [x] **Task 5.3**: Test language switching
  - Test badge in English
  - Test badge in Lao
  - Verify language switcher works correctly

### Phase 6: Testing & Quality Assurance (MANUAL)
- [ ] **Task 6.1**: Manual testing - all statuses
  - Test pending → approved
  - Test approved → blacklisted
  - Test blacklisted → pending
  - Verify all transitions work

- [ ] **Task 6.2**: Manual testing - edge cases
  - Rapid clicking (test debounce/disabled)
  - API error simulation
  - Network timeout handling
  - Multiple badges open simultaneously

- [ ] **Task 6.3**: Accessibility testing
  - Test with keyboard only (no mouse)
  - Test with screen reader (VoiceOver/NVDA)
  - Check color contrast (use DevTools)
  - Verify focus indicators visible

- [ ] **Task 6.4**: Performance testing
  - Open Customer page with 100+ rows
  - Measure table render time (DevTools Performance)
  - Check memory usage before/after
  - Verify popover opens quickly (< 50ms)

- [ ] **Task 6.5**: Cross-browser testing
  - Test in Chrome
  - Test in Firefox
  - Test in Safari
  - Test in Edge

### Phase 7: Documentation & Cleanup
- [x] **Task 7.1**: Add component documentation
  - Add JSDoc comments to props
  - Add usage example in comments
  - Document emit events

- [x] **Task 7.2**: Clean up old code
  - Remove commented-out a-select code (if confident)
  - Remove unused CSS classes from Customer.vue
  - Remove unused icon imports

- [x] **Task 7.3**: Commit changes
  - Review all changes with git diff
  - Create meaningful commit message
  - Test one more time after commit

## Definition of Done

A task is complete when:
- ✅ Code is written and follows project conventions
- ✅ Component renders without errors
- ✅ Functionality works as expected
- ✅ Manual testing passes
- ✅ No console errors or warnings

The entire change is complete when:
- ✅ All implementation tasks are done
- ✅ All testing tasks pass
- ✅ Code has been committed
- ✅ No regressions in other parts of the app

## Notes

### Priority Order
1. Phase 1 (Component) - MUST HAVE
2. Phase 2 (Integration) - MUST HAVE
3. Phase 3 (Polish) - SHOULD HAVE
4. Phase 4 (Responsive) - SHOULD HAVE
5. Phase 5 (i18n) - MUST HAVE
6. Phase 6 (Testing) - MUST HAVE
7. Phase 7 (Cleanup) - NICE TO HAVE

### Estimated Time per Phase
- Phase 1: ~2 hours
- Phase 2: ~1 hour
- Phase 3: ~1 hour
- Phase 4: ~0.5 hours
- Phase 5: ~0.5 hours
- Phase 6: ~1 hour
- Phase 7: ~0.5 hours

**Total Estimated Time: 6.5 hours**

### Blockers/Risks
- If Ant Design popover doesn't support needed features, may need custom dropdown
- If performance is still poor, need to implement shared popover pattern
- If mobile testing reveals issues, may need layout adjustments

### Dependencies
- Requires Ant Design Vue 4.x (already installed)
- Requires existing status translations (confirmed present)
- Requires existing updateStatus API (confirmed exists)
