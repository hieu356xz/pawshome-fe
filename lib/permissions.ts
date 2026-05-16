import { User, PermissionKey, Action, Resource } from "@/types/auth";

export const hasPermission = (user: User | null, permission: PermissionKey): boolean => {
  if (!user || !user.roles) return false;

  // Admin has all permissions
  if (user.roles.some(role => role.name === 'admin')) return true;

  const [resource, action] = permission.split(':') as [Resource, Action | '*'];

  return user.roles.some(role => 
    role.permissions?.some(p => {
      const isResourceMatch = p.subject === resource || p.subject === '*' as any;
      const isActionMatch = p.action === action || action === '*' || p.action === '*' as any;
      return isResourceMatch && isActionMatch;
    })
  );
};

export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some(role => roles.includes(role.name));
};
