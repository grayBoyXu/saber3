/**
 * 全局配置文件
 */
export default {
  title: 'saber',
  logo: 'S',
  key: 'saber', //配置主键,目前用于存储
  indexTitle: 'Saber Admin',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  tenantId: '000000', // 管理组租户编号
  captchaMode: true, // 是否开启验证码模式
  switchMode: false, // 是否开启部门切换模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  setting: {
    sidebar: 'vertical',
    tag: true,
    debug: true,
    collapse: true,
    search: true,
    lock: true,
    screenshot: true,
    fullscren: true,
    theme: true,
    menu: true,
  },
  fistPage: {
    name: '首页',
    path: '/wel/index',
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'icon-caidan',
    label: 'name',
    path: 'path',
    icon: 'source',
    children: 'children',
    query: 'query',
    href: 'path',
    meta: 'meta',
  },
  // 流程设计器类型(true->nutflow,false->flowable)
  designMode: true,
  // 流程设计器地址(flowable模式)
  designUrl: 'http://localhost:9999',
  // 第三方系统授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://localhost:8108/ureport',
  // 单点登录系统认证(blade-auth服务的地)
  ssoUrl: 'http://localhost:8100/oauth/authorize?client_id=saber&response_type=code&redirect_uri=',
  // 单点登录回调地址(Saber服务的地址)
  redirectUri: 'http://localhost:1888',
};
