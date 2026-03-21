# Design: Customer Status Badge Component

## Component Architecture

### New Component: CustomerStatusBadge.vue
```
src/components/CustomerStatusBadge.vue
├── Props
│   ├── status: string (pending | approved | blacklisted)
│   ├── customerId: number
│   ├── loading: boolean (optional)
│   └── disabled: boolean (optional)
├── Emits
│   └── change: (customerId: number, newStatus: string) => void
├── State
│   ├── popoverVisible: boolean
│   └── isUpdating: boolean
└── Template Structure
    ├── a-badge (status display)
    │   ├── Status dot (animated)
    │   ├── Status icon
    │   └── Status label
    └── a-popover (menu)
        └── Status options (3)
```

### Integration in Customer.vue
```vue
<!-- Before -->
<a-select
  :value="record.status"
  @change="handleStatusChange(record.id, $event)"
  :loading="record.statusLoading"
>
  <!-- options -->
</a-select>

<!-- After -->
<CustomerStatusBadge
  :status="record.status"
  :customerId="record.id"
  :loading="record.statusLoading"
  @change="handleStatusChange"
/>
```

## Visual Design Specifications

### Badge Appearance
```scss
// Common styles
.status-badge {
  min-width: 120px;
  padding: 4px 12px;
  border-radius: 16px; // Pill shape
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Hover effect
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  // Click effect
  &:active {
    transform: scale(0.98);
  }
}

// Status-specific colors
.status-pending {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  color: #ffffff;
  border: none;

  .status-dot {
    background: #ffffff;
    animation: pulse-warning 1.5s infinite;
  }
}

.status-approved {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: #ffffff;
  border: none;

  .status-dot {
    background: #ffffff;
    animation: pulse-success 2s infinite;
  }
}

.status-blacklisted {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: #ffffff;
  border: none;

  .status-dot {
    background: #ffffff;
    animation: pulse-error 1.5s infinite;
  }
}
```

### Status Dot Animation
```scss
@keyframes pulse-warning {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

@keyframes pulse-success {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes pulse-error {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.15); }
}
```

### Popover Menu Design
```scss
.status-popover {
  .ant-popover-inner {
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }

  .status-menu {
    min-width: 200px;
    padding: 8px 0;

    .status-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.2s ease;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;

      &:hover {
        background: #f5f5f5;
      }

      &.is-selected {
        background: #e6f7ff;
        position: relative;

        &::after {
          content: '✓';
          position: absolute;
          right: 16px;
          color: #1890ff;
          font-weight: bold;
        }
      }

      .status-icon {
        font-size: 18px;
        width: 24px;
      }

      .status-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .status-label {
          font-weight: 500;
          font-size: 14px;
        }

        .status-description {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }
  }
}
```

## State Management

### Loading States
```typescript
// Component internal state
const isUpdating = ref(false)

// Prop from parent (API in progress)
const props = defineProps<{
  loading?: boolean
}>()

// Combined loading state
const isLoading = computed(() =>
  props.loading || isUpdating.value
)
```

### Optimistic Update Pattern
```typescript
const handleStatusSelect = async (newStatus: string) => {
  const previousStatus = props.status

  // Optimistic update
  emit('change', props.customerId, newStatus)

  try {
    // API call happens in parent
    await parentUpdateStatus(props.customerId, newStatus)
  } catch (error) {
    // Revert on error
    emit('change', props.customerId, previousStatus)
    showErrorNotification(t('message.statusUpdateFailed'))
  }
}
```

## Performance Optimizations

### 1. v-memo in Table
```vue
<CustomerStatusBadge
  v-memo="[record.status, record.statusLoading]"
  :status="record.status"
  :customerId="record.id"
  :loading="record.statusLoading"
  @change="handleStatusChange"
/>
```

### 2. Lazy Popover Rendering
```vue
<a-popover
  v-model:open="popoverVisible"
  trigger="click"
  placement="bottomLeft"
  :overlay-style="{ minWidth: '220px' }"
>
  <template #content>
    <div v-if="popoverVisible" class="status-menu">
      <!-- Menu options -->
    </div>
  </template>
  <!-- Badge -->
</a-popover>
```

### 3. Shared Popover (Advanced Optimization)
If performance is critical, use single global popover:
```typescript
// composible/useStatusPopover.ts
const globalPopover = reactive({
  visible: false,
  position: { x: 0, y: 0 },
  customerId: null
})

export function useStatusPopover() {
  return { globalPopover }
}
```

## Accessibility Implementation

### ARIA Attributes
```vue
<a-badge
  :aria-label="`${t('status.customer')}: ${getStatusLabel(status)}`"
  aria-haspopup="true"
  :aria-expanded="popoverVisible"
  role="button"
  :tabindex="disabled ? -1 : 0"
  @keydown.enter="togglePopover"
  @keydown.space.prevent="togglePopover"
>
  <!-- Badge content -->
</a-badge>
```

### Keyboard Navigation
```typescript
const handleKeydown = (e: KeyboardEvent) => {
  switch(e.key) {
    case 'Enter':
    case ' ':
      togglePopover()
      break
    case 'Escape':
      if (popoverVisible.value) {
        closePopover()
      }
      break
    case 'ArrowDown':
      if (popoverVisible.value) {
        focusNextOption()
        e.preventDefault()
      }
      break
    case 'ArrowUp':
      if (popoverVisible.value) {
        focusPreviousOption()
        e.preventDefault()
      }
      break
  }
}
```

## Component Props API

```typescript
interface Props {
  /** Current customer status */
  status: 'pending' | 'approved' | 'blacklisted'

  /** Customer ID for API calls */
  customerId: number

  /** Loading state from parent API call */
  loading?: boolean

  /** Disable interaction (e.g., during batch operations) */
  disabled?: boolean

  /** Optional: Custom status labels (overrides i18n) */
  customLabels?: Record<string, string>
}

interface Emits {
  /** Emitted when user selects new status */
  (event: 'change', customerId: number, newStatus: string): void

  /** Emitted when popover opens/closes */
  (event: 'toggle', isOpen: boolean): void
}
```

## Responsive Behavior

```scss
// Mobile adjustments
@media (max-width: 768px) {
  .status-badge {
    min-width: 100px;
    font-size: 12px;
    padding: 6px 10px;

    // Larger touch target
    &::before {
      content: '';
      position: absolute;
      inset: -8px;
    }
  }

  .status-popover {
    .ant-popover {
      // Full width on small screens
      max-width: calc(100vw - 32px);
    }
  }
}
```

## Testing Considerations

### Unit Tests
- [ ] Component renders with each status
- [ ] Clicking badge opens popover
- [ ] Clicking option emits change event
- [ ] Loading state displays correctly
- [ ] Disabled state prevents interaction
- [ ] Keyboard navigation works

### Integration Tests
- [ ] Status change triggers API call
- [ ] API success updates badge
- [ ] API failure reverts to original status
- [ ] Multiple badges can be open simultaneously
- [ ] Table re-renders correctly after status change

### Accessibility Tests
- [ ] Tab key focuses badge
- [ ] Enter/Space opens popover
- [ ] Escape closes popover
- [ ] Arrow keys navigate options
- [ ] Screen reader announces status
- [ ] Focus returns to badge after close

## File Structure
```
src/
├── components/
│   └── CustomerStatusBadge.vue          (NEW)
├── modules/
│   └── admin/
│       └── customer/
│           ├── Customer.vue             (UPDATE)
│           └── components/
│               └── CustomerStatusBadge.vue (ALTERNATIVE LOCATION)
└── assets/
    └── styles/
        └── status-badge.scss             (OPTIONAL: Extract styles)
```

## Migration Plan
1. Create CustomerStatusBadge.vue component
2. Add component to Customer.vue imports
3. Replace a-select template with CustomerStatusBadge
4. Test with local development server
5. Verify all statuses work correctly
6. Check mobile responsiveness
7. Test with screen reader
8. Remove old a-select code (if confident)
9. Commit changes

## Rollback Strategy
If issues arise:
1. Keep old a-select code commented out for 1 release
2. Use feature flag to toggle between old/new
3. Monitor for errors/feedback
4. Revert if critical issues found
