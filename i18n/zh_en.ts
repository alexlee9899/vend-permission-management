export const dict = {
  // 系统通用
  system: {
    title: { zh: "权限管理系统", en: "Permission Management System" },
    welcome: { zh: "欢迎使用", en: "Welcome To" },
    loading: { zh: "加载中...", en: "Loading..." },
    noData: { zh: "暂无数据", en: "No Data" },
  },
  
  // 导航与按钮
  nav: {
    return: { zh: "返回", en: "Return" },
    logout: { zh: "退出登录", en: "Logout" },
    login: { zh: "登录", en: "Login" },
    adminLogin: { zh: "管理员登录", en: "Admin Login" },
    loggingIn: { zh: "登录中...", en: "Logging in..." },
    home: { zh: "首页", en: "Home" },
    save: { zh: "保存", en: "Save" },
    cancel: { zh: "取消", en: "Cancel" },
    edit: { zh: "编辑", en: "Edit" },
    delete: { zh: "删除", en: "Delete" },
    add: { zh: "添加", en: "Add" },
  },
  
  // 登录页
  login: {
    account: { zh: "账号", en: "Account" },
    adminAccount: { zh: "管理员账号", en: "Admin Account" },
    email: { zh: "邮箱", en: "Email" },
    password: { zh: "密码", en: "Password" },
    enterAccount: { zh: "请输入账号", en: "Please enter your account" },
    enterPassword: { zh: "请输入密码", en: "Please enter your password" },
    enterValidAccount: { zh: "请输入有效账号", en: "Please enter a valid account" },
    loginFailed: { zh: "登录失败", en: "Login failed" },
    tryAgain: { zh: "请稍后重试", en: "Please try again later" },
    switchAdmin: { zh: "切换至管理员登录", en: "Switch to Admin Login" },
    switchUser: { zh: "切换至用户登录", en: "Switch to User Login" },
  },
  
  // 业务列表与卡片
  business: {
    management: { zh: "权限管理", en: "Permission Management" },
    list: { zh: "业务列表", en: "Business List" },
    detail: { zh: "业务详情", en: "Business Detail" },
    search: { zh: "按业务名称搜索...", en: "Search by business name..." },
    noMatch: { zh: "没有匹配的业务", en: "No businesses match your search criteria" },
    businessId: { zh: "业务ID", en: "Business ID" },
    ownerId: { zh: "所有者ID", en: "Owner ID" },
    permissions: { zh: "权限", en: "Permissions" },
    noPermissions: { zh: "暂无权限信息", en: "No permissions found" },
    permissionLevel: { zh: "权限级别", en: "Permission Level" },
    expireTime: { zh: "过期时间", en: "Expiration Time" },
    status: { zh: "状态", en: "Status" },
    active: { zh: "激活", en: "Active" },
    inactive: { zh: "未激活", en: "Inactive" },
  },
  
  // 详情页
  detail: {
    basicInfo: { zh: "基本信息", en: "Basic Information" },
    permissionInfo: { zh: "权限信息", en: "Permission Information" },
    agentManagement: { zh: "代理管理", en: "Agent Management" },
    addAgent: { zh: "添加代理", en: "Add Agent" },
    agentEmail: { zh: "代理邮箱", en: "Agent Email" },
    addSuccess: { zh: "添加成功", en: "Added successfully" },
    addFailed: { zh: "添加失败", en: "Add failed" },
    editPermission: { zh: "编辑权限", en: "Edit Permission" },
    deletePermission: { zh: "删除权限", en: "Delete Permission" },
    addPermission: { zh: "添加权限", en: "Add Permission" },
  },
  
  // 错误和提示
  message: {
    success: { zh: "成功", en: "Success" },
    error: { zh: "错误", en: "Error" },
    warning: { zh: "警告", en: "Warning" },
    info: { zh: "提示", en: "Info" },
    networkError: { zh: "网络错误", en: "Network Error" },
    serverError: { zh: "服务器错误", en: "Server Error" },
    confirmDelete: { zh: "确认删除？", en: "Confirm deletion?" },
  },
}; 