const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_token_expires_at';

/**
 * 保存 token 和过期时间（30分钟后）
 */
export function saveToken(token: string): void {
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, expiresAt.toString());
}

/**
 * 获取 token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 检查 token 是否过期
 */
export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!expiresAt) return true;

  const expiresAtNum = parseInt(expiresAt, 10);
  if (isNaN(expiresAtNum)) return true;

  return Date.now() >= expiresAtNum;
}

/**
 * 清除 token 和过期时间
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

/**
 * 检查是否已认证（token 存在且未过期）
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null && !isTokenExpired();
}
