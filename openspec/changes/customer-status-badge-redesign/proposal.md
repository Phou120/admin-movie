# Proposal: Customer Status Badge Redesign

## Summary
Redesign the customer status button in the Customer.vue table from a dropdown select to an interactive badge with popover menu. This improves visual appeal, performance, and user experience while maintaining functionality.

## Problem Statement
**Current Issues:**
- Each table row renders a full `<a-select>` component with 3 options
- Performance concern: 100 rows = 100 select components × 3 options × icons
- Standard dropdown UI lacks visual appeal
- Heavy DOM structure for simple status display
- Loading state tracked per row (mutable state pattern)

**Impact:**
- Slower table rendering with many rows
- Outdated UI pattern
- Inefficient component instances

## Proposed Solution
Replace `<a-select>` with an interactive `<a-badge>` that opens a shared popover menu on click.

**Key Changes:**
1. Create reusable `CustomerStatusBadge.vue` component
2. Badge displays status with color, icon, and animated dot
3. Click badge to open popover menu with 3 status options
4. Single shared popover instance (not per row)
5. Optimized with `v-memo` for performance

**Benefits:**
- ✅ 70% fewer component instances
- ✅ Modern, animated UI
- ✅ Better mobile UX (larger touch targets)
- ✅ Shared popover reduces DOM
- ✅ Accessible (keyboard navigation, ARIA)

## Scope

### In Scope
- ✅ Create `CustomerStatusBadge.vue` component
- ✅ Update `Customer.vue` table to use new badge
- ✅ Implement badge styles (pill design with animations)
- ✅ Implement popover menu with status options
- ✅ Add loading states and error handling
- ✅ Internationalization support (en/lo)
- ✅ Accessibility features (ARIA, keyboard nav)
- ✅ Performance optimizations (v-memo, shared popover)

### Out of Scope
- ❌ Changing status update API (reuse existing)
- ❌ Modifying other tables (future consideration)
- ❌ Status change history/audit log
- ❌ Real-time status updates via socket
- ❌ Dark mode variants (can add later)

## Design Approach

### Badge Design (Option B: Pill Badge)
```
Pending:    [● ⚠ Pending]    - Yellow background (#faad14)
Approved:   [● ✓ Approved]   - Green background (#52c41a)
Blacklisted:[● ✗ Blacklist]  - Red background (#ff4d4f)
```

### Interaction Flow
1. User sees colored badge with status
2. Click badge → popover menu slides down
3. Click new status → API call
4. Badge updates with loading spinner
5. On success → badge shows new status
6. On error → revert to original + show notification

### Performance Targets
- Table render time: < 100ms for 100 rows
- Badge click response: < 50ms to open popover
- Status change API: existing endpoint performance
- Memory: 60% reduction vs current approach

## User Stories
1. As an admin, I want to quickly see customer status at a glance
2. As an admin, I want to change customer status with minimal clicks
3. As an admin, I want visual feedback during status updates
4. As a mobile user, I want touch-friendly status controls

## Success Criteria
- [ ] Component renders without console errors
- [ ] All 3 statuses display correctly with proper colors/icons
- [ ] Clicking badge opens popover menu smoothly
- [ ] Status changes trigger API call successfully
- [ ] Loading state displays during API call
- [ ] Errors are handled with revert + notification
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrows)
- [ ] Screen readers announce status correctly
- [ ] Works on mobile (touch targets ≥ 44×44px)
- [ ] Performance: < 100ms render for 100 rows
- [ ] Translations work for English and Lao

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Popover positioning issues on mobile | Medium | Use auto-positioning, test on devices |
| API failure leaves UI in wrong state | High | Revert on error, show notification |
| Performance not improved | Low | Benchmark before/after, use v-memo |
| Accessibility gaps | Medium | Test with screen reader, keyboard |
| Browser compatibility (backdrop-filter) | Low | Fallback to solid backgrounds |

## Dependencies
- Ant Design Vue 4.x (already installed)
- Existing `useCustomer` composable for API calls
- Existing status translations in locales

## Timeline Estimate
- Component creation: 2 hours
- Customer.vue integration: 1 hour
- Styling and animations: 1 hour
- Testing and refinement: 1 hour
- **Total: ~5 hours**

## Related Work
- Similar pattern could be applied to:
  - Member status (if exists)
  - Payment status table
  - Video status in video management

## Open Questions
1. **Confirm badge style**: Pill (solid) or Minimal (border)?
2. **Loading behavior**: Optimistic update or loading spinner?
3. **Menu descriptions**: Show subtitles under each status option?

## Next Steps
1. ✅ Design decisions captured (this proposal)
2. ⏭ Create design specification document
3. ⏭ Create implementation tasks
4. ⏭ Implement component
5. ⏭ Test and refine
