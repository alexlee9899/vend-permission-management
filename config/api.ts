export const API_CONFIG = {
  BASE_URL: 'https://vend88.com',
  ENDPOINTS: {
    LOGIN: "/admin/login",
    LIST_BUSINESS: "/shop/list_business",
    // 可以在这里添加其他端点
  }
} as const;

// 获取完整的 API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 