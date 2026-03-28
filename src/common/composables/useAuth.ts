import { computed, ref } from "vue";

/**
 * Global authentication and permission composable
 * Provides reactive access control based on user roles and permissions
 */
export function useAuth() {
  // Reactive state
  const user = ref<any>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);

  /**
   * Initialize auth state from localStorage
   * Reads token, user_roles, and user_permissions from localStorage
   */
  const initialize = () => {
    // Read roles from localStorage
    const rolesStr = localStorage.getItem("user_roles");
    if (rolesStr) {
      try {
        roles.value = JSON.parse(rolesStr);
      } catch (e) {
        console.error("Error parsing user_roles from localStorage:", e);
        roles.value = [];
      }
    }

    // Read permissions from localStorage
    const permsStr = localStorage.getItem("user_permissions");
    if (permsStr) {
      try {
        permissions.value = JSON.parse(permsStr);
      } catch (e) {
        console.error("Error parsing user_permissions from localStorage:", e);
        permissions.value = [];
      }
    }
  };

  // Computed properties
  const isAuthenticated = computed(() => !!localStorage.getItem("token"));
  const isSuperAdmin = computed(() => roles.value.includes("super-admin"));
  const isAdmin = computed(() => roles.value.includes("admin"));

  /**
   * Check if user has a specific role
   * @param roleName - The role name to check (e.g., "admin", "creator")
   * @returns true if user has the role, false otherwise
   */
  const hasRole = (roleName: string): boolean => {
    return roles.value.includes(roleName);
  };

  /**
   * Check if user has a specific permission
   * Super-admin users bypass ALL permission checks (always return true)
   * All other users (including admin) MUST have the specific permission
   * @param perm - The permission string (e.g., "create-banner", "read-user")
   * @returns true if user is super-admin OR has the permission in their permissions array
   */
  const hasPermission = (perm: string): boolean => {
    // Super-admin bypasses all permission checks
    if (isSuperAdmin.value) return true;

    // All other users must have the permission
    return permissions.value.includes(perm);
  };

  /**
   * Check if user has ANY of the specified permissions
   * Super-admin bypasses all checks
   * All other users must have at least one permission
   * @param perms - Array of permission strings
   * @returns true if user is super-admin OR has at least one permission
   */
  const hasAnyPermission = (perms: string[]): boolean => {
    // Super-admin bypasses all checks
    if (isSuperAdmin.value) return true;

    // All other users must have at least one permission
    return perms.some((p) => permissions.value.includes(p));
  };

  /**
   * Check if user has ALL of the specified permissions
   * Super-admin bypasses all checks
   * All other users must have all permissions
   * @param perms - Array of permission strings
   * @returns true if user is super-admin OR has all permissions
   */
  const hasAllPermissions = (perms: string[]): boolean => {
    // Super-admin bypasses all checks
    if (isSuperAdmin.value) return true;

    // All other users must have all permissions
    return perms.every((p) => permissions.value.includes(p));
  };

  /**
   * Check if user can perform an action on a resource
   * Constructs permission string as "{action}-{resource}"
   * Super-admin can do anything
   * All other users must have the specific permission
   * @param action - The action (e.g., "create", "read", "update", "delete")
   * @param resource - The resource (e.g., "banner", "user", "video")
   * @returns true if user is super-admin OR has the permission
   */
  const can = (action: string, resource: string): boolean => {
    const perm = `${action}-${resource}`;
    return hasPermission(perm);
  };

  // Initialize on creation
  initialize();

  return {
    user,
    roles,
    permissions,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
  };
}
