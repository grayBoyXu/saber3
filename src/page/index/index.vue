<template>
  <div class="avue-contail" :class="{ 'avue--collapse': isCollapse }">
    <div class="avue-layout" :class="{ 'avue-layout--horizontal': isHorizontal }">
      <div class="avue-sidebar" v-show="validSidebar">
        <!-- 左侧导航栏 -->
        <logo />
        <sidebar />
      </div>
      <div class="avue-main">
        <!-- 顶部导航栏 -->
        <top ref="top" />
        <!-- 顶部标签卡 -->
        <tags />
        <search class="avue-view" v-show="isSearch"></search>
        <!-- 主体视图层 -->
        <div id="avue-view" v-show="!isSearch" v-if="isRefresh">
          <router-view #="{ Component }">
            <keep-alive :include="$store.getters.tagsKeep">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </div>
    </div>
    <!-- <wechat></wechat> -->
  </div>
</template>

<script>
import index from '@/mixins/index';
import wechat from './wechat.vue';
//import { validatenull } from 'utils/validate';
import { mapGetters } from 'vuex';
import tags from './tags.vue';
import search from './search.vue';
import logo from './logo.vue';
import top from './top/index.vue';
import sidebar from './sidebar/index.vue';

export default {
  mixins: [index],
  components: {
    top,
    logo,
    tags,
    search,
    sidebar,
    wechat,
  },
  name: 'index',
  provide() {
    return {
      index: this,
    };
  },
  computed: {
    ...mapGetters([
      'isHorizontal',
      'isRefresh',
      'isLock',
      'isCollapse',
      'isSearch',
      'menu',
      'setting',
    ]),
    validSidebar() {
      return !(
        (this.$route.meta || {}).menu === false || (this.$route.query || {}).menu === 'false'
      );
    },
  },
  props: [],
  methods: {
    //打开菜单
    openMenu(item = {}) {
      this.$store.dispatch('GetMenu', item.id).then(data => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true);
        }
        //当点击顶部菜单后默认打开第一个菜单
        /*if (!this.validatenull(item)) {
          let itemActive = {},
            childItemActive = 0;
          if (item.path) {
            itemActive = item;
          } else {
            if (this.menu[childItemActive].length === 0) {
              itemActive = this.menu[childItemActive];
            } else {
              itemActive = this.menu[childItemActive].children[childItemActive];
            }
          }
          this.$store.commit('SET_MENU_ID', item);
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: (itemActive.label || itemActive.name),
              src: itemActive.path
            }, itemActive.meta)
          });
        }*/
      });
    },
  },
};
</script>
