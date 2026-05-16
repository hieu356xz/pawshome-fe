import { User, PermissionKey, Action, Resource } from "@/types/auth";

export const hasPermission = (user: User | null, permission: PermissionKey): boolean => {
  if (!user || !user.roles) return false;

  // Admin has all permissions
  if (user.roles.some(role => role.name === 'admin')) return true;

  const [reqResource, reqAction] = permission.split(':') as [Resource, Action | '*'];

  return user.roles.some(role => 
    role.permissions?.some(p => {
      if (p.key === permission || p.key === '*') return true;

      const [pResource, pAction] = p.key.split(':');

      const isResourceMatch = pResource === reqResource || pResource === '*';
      const isActionMatch = pAction === reqAction || pAction === '*' || reqAction === '*';

      return isResourceMatch && isActionMatch;
    })
  );
};

export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.some(role => roles.includes(role.name));
};
