import axios, { AxiosError } from 'axios';
import { getToken, isTokenExpired, clearToken } from './token-manager';

const apiClient = axios.create({
  baseURL: 'https://todo-api-s0hq.onrender.com',
  timeout: 30000,
});

// 白名单路径
const AUTH_WHITELIST = ['/auth/register', '/auth/login'];

/**
 * 请求拦截器
 */
apiClient.interceptors.request.use(
  (config: any) => {
    const url = config.url || '';

    // 白名单路径直接放行（精确匹配）
    if (AUTH_WHITELIST.some(path => url === path || url.endsWith(path))) {
      return config;
    }

    // 检查 token 是否过期
    if (isTokenExpired()) {
      clearToken();
      window.location.href = '/login';
      return Promise.reject(new Error('Token expired'));
    }

    // 注入 Authorization header
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 未授权，清除 token 并跳转登录
    if (error.response?.status === 401) {
      // 登录和注册接口的 401 不拦截，让页面自己处理
      const url = error.config?.url || '';
      if (url.endsWith('/auth/login') || url.endsWith('/auth/register')) {
        return Promise.reject(error);
      }
      clearToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
