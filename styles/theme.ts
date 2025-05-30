/**
 * 应用程序的颜色主题
 */
export const colors = {
  // 主要颜色（深蓝+青色渐变科技感）
  primary: {
    main: '#1a237e',      // 深蓝
    light: '#00eaff',     // 青色
    dark: '#0d1333',      // 更深蓝
    gradient: 'linear-gradient(90deg, #1a237e 0%, #00eaff 100%)',
  },
  
  // 次要颜色（紫色+青色渐变）
  secondary: {
    main: '#7c3aed',      // 紫色
    light: '#00eaff',     // 青色
    dark: '#4c1d95',      // 深紫
    gradient: 'linear-gradient(90deg, #7c3aed 0%, #00eaff 100%)',
  },
  
  // 危险颜色
  danger: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
  },
  
  // 文本颜色
  text: {
    primary: '#222831',
    secondary: '#5c6b7a',
    light: '#b0bec5',
    inverse: '#ffffff',
  },
  
  // 背景颜色
  background: {
    main: '#f7faff',
    light: 'rgba(255,255,255,0.7)', // 用于玻璃拟态
    dark: '#232946',
    glass: 'rgba(255,255,255,0.25)', // 玻璃拟态
    gradient: 'linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%)',
  },
  
  // 边框颜色
  border: {
    main: '#e0e7ef',
    light: '#f1f5f9',
    dark: '#b0bec5',
    gradient: 'linear-gradient(90deg, #1a237e 0%, #00eaff 100%)',
  },
  
  // 成功状态
  success: {
    main: '#10b981',
    light: '#d1fae5',
    dark: '#047857',
  },
  
  // 错误状态
  error: {
    main: '#991b1b',
    light: '#fee2e2',
    dark: '#7f1d1d',
  },

  // 按钮颜色
  button: {
    primary: 'linear-gradient(90deg, #1a237e 0%, #00eaff 100%)',
    secondary: '#e0e7ef',
    disabled: '#b0bec5',
    glass: 'rgba(255,255,255,0.15)',
  },
};

/**
 * 间距主题
 */
export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  xxl: '4rem',
};

/**
 * 圆角主题
 */
export const radius = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  round: '9999px',
};

/**
 * 阴影主题
 */
export const shadows = {
  sm: '0 2px 8px rgba(30, 64, 175, 0.08)',
  md: '0 4px 16px rgba(30, 64, 175, 0.12)',
  lg: '0 8px 32px rgba(30, 64, 175, 0.16)',
  xl: '0 16px 48px rgba(30, 64, 175, 0.18)',
  glass: '0 8px 32px rgba(30, 64, 175, 0.10)',
};

// 字体建议
export const font = {
  family: `'Inter', 'Roboto', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif`,
  weight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  size: {
    base: '1rem',
    lg: '1.25rem',
    xl: '2rem',
    title: '2.5rem',
  },
};

// 导出完整主题
const theme = {
  colors,
  spacing,
  radius,
  shadows,
  font,
};

export default theme; 