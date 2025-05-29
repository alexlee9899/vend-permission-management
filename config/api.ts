export const API_CONFIG = {
  BASE_URL: 'https://dev.vend88.com',
  ENDPOINTS: {
    LOGIN: "/admin/login",
    LIST_BUSINESS: "/shop/list_business",
    GET_PERMISSION: "/shop/get_business_permission",
    SEARCH_BUSINESS: "/search/business_search",
    UPDATE_PERMISSION: "/shop/update_business_permission",
    DELETE_PERMISSION: "/shop/delete_business_permission",
    ADD_PERMISSION: "/shop/add_business_permission",
    AGENT_BUSINESS_LIST: "/shop/get_agent_admin",
    // 可以在这里添加其他端点
  }
} as const;

// 获取完整的 API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 