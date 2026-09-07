export type SessionUser = {
  id?: number;
  name?: string;
  username?: string;
  rol?: string;
  isLoggedIn?: boolean;
};

const ADMIN_ROLES = ['ROLE_ADMIN', 'ROLE_MASTER'];

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken() && getSessionUser());
}

export function isAdminRole(rol?: string | null): boolean {
  return Boolean(rol && ADMIN_ROLES.includes(rol));
}

export function saveSession(token: string, user: SessionUser): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ ...user, isLoggedIn: true }));
}

export function clearSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
}
