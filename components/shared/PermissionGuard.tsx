"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { hasPermission as checkPermission, hasAnyPermission as checkAnyPermission } from "@/lib/rbac";

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    roles: string[];
    permissions: string[];
  } | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("ap_auth_user");
        return cached ? JSON.parse(cached) : null;
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return !localStorage.getItem("ap_auth_user");
      } catch {}
    }
    return true;
  });

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          try {
            localStorage.setItem("ap_auth_user", JSON.stringify(data.user));
          } catch {}
        } else {
          setUser(null);
          try {
            localStorage.removeItem("ap_auth_user");
          } catch {}
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem("ap_auth_user");
        } catch {}
      }
    } catch (e) {
      // On network failure or transient glitch keep cached state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function usePermissions() {
  const { user, loading } = useAuth();
  return {
    user,
    permissions: user?.permissions || [],
    roles: user?.roles || (user?.role ? [user.role] : []),
    loading,
    isLoaded: !loading,
    isSuperAdmin: Boolean(
      user?.role === "super_admin" ||
        user?.roles?.includes("super_admin") ||
        user?.permissions?.includes("*")
    ),
    hasPermission: (perm: string) => checkPermission(user?.permissions, perm),
    hasAnyPermission: (perms: string[]) => checkAnyPermission(user?.permissions, perms),
  };
}

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Reusable frontend permission component for conditional UI rendering.
 * NOTE: For presentation only. Server actions and route handlers independently enforce authorization.
 */
export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <>{fallback}</>;

  // Super Admin wildcard
  if (user.roles?.includes("super_admin") || user.permissions?.includes("*")) {
    return <>{children}</>;
  }

  if (permission) {
    if (!checkPermission(user.permissions, permission)) {
      return <>{fallback}</>;
    }
  }

  if (permissions && permissions.length > 0) {
    const passed = requireAll
      ? permissions.every((p) => checkPermission(user.permissions, p))
      : checkAnyPermission(user.permissions, permissions);

    if (!passed) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  roles: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <>{fallback}</>;

  const userRoles = user.roles || [user.role];
  const isMatch = roles.some((r) => userRoles.includes(r)) || userRoles.includes("super_admin");

  if (!isMatch) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
