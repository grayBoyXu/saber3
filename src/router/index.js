import { createRouter, createWebHistory } from 'vue-router';
import PageRouter from './page/';
import ViewsRouter from './views/';
import AvueRouter from './avue-router';
import i18n from '@/lang';
import Store from '@/store/';
//创建路由
const Router = createRouter({
  base: import.meta.env.VITE_APP_BASE,
  history: createWebHistory(),
  routes: [...PageRouter, ...ViewsRouter],
});
AvueRouter.install({
  store: Store,
  router: Router,
  i18n: i18n,
});

Router.$avueRouter.formatRoutes(Store.getters.menuAll, true);

export function resetRouter() {
  // 重置路由 比如用于身份验证失败，需要重新登录时 先清空当前的路有权限
  const newRouter = createRouter();
  Router.matcher = newRouter.matcher; // reset router
  AvueRouter.install(Vue, {
    router: Router,
    store: Store,
    i18n: i18n,
  });
}

export default Router;
