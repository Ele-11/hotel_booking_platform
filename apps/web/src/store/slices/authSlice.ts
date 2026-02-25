export type UserRole = 'admin' | 'merchant';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

export function setAuth(token: string, role: UserRole) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): UserRole | null {
  return (localStorage.getItem(ROLE_KEY) as UserRole | null) ?? null;
}

export function isAuthed() {
  return Boolean(getToken());
}
