/**
 * 应用程序的颜色主题
 */
export const colors = {
  // 主要颜色
  primary: {
    main: '#0070f3',
    light: '#3291ff',
    dark: '#0051b3',
  },
  
  // 次要颜色
  secondary: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  
  // 危险颜色
  danger: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
  },
  
  // 文本颜色
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  
  // 背景颜色
  background: {
    main: '#ffffff',
    light: '#f5f5f5',
    dark: '#eeeeee',
  },
  
  // 边框颜色
  border: {
    main: '#dddddd',
    light: '#eeeeee',
    dark: '#cccccc',
  },
  
  // 成功状态
  success: {
    main: '#166534',
    light: '#dcfce7',
    dark: '#14532d',
  },
  
  // 错误状态
  error: {
    main: '#991b1b',
    light: '#fee2e2',
    dark: '#7f1d1d',
  },

  // 按钮颜色
  button: {
    primary: '#000000',    // 黑色 - 用于登录、添加、确认等主要操作
    secondary: '#666666',  // 灰色 - 用于返回、取消等次要操作
    disabled: '#cccccc',   // 禁用状态
  },
};

/**
 * 间距主题
 */
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

/**
 * 圆角主题
 */
export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  round: '9999px',
};

/**
 * 阴影主题
 */
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 4px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.15)',
};

// 导出完整主题
const theme = {
  colors,
  spacing,
  radius,
  shadows,
};

export default theme; 