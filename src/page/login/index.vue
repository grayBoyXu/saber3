<template>
  <div class="login-container" ref="login" @keyup.enter="handleLogin">
    <div class="login-weaper animated bounceInDown">
      <div class="login-left">
        <div class="login-time">
          {{ time }}
        </div>
        <p class="title">{{ $t('login.info') }}</p>
        <div style="font-size: 15px">
          <span>----------------------------------------------</span>
          <br />
          <span>管理租户编号：000000</span>
          <br />
          <span>超级管理员账号: admin / admin</span>
          <br />
          <span>人事账号: hr / hr</span>
          <br />
          <span>经理账号: manager / manager</span>
          <br />
          <span>老板账号: boss / boss</span>
          <br />
          <span>----------------------------------------------</span>
          <br />
          <span>普通租户编号：详见租户管理模块</span>
          <br />
          <span>租户管理员账号: admin / admin</span>
          <br />
          <span>----------------------------------------------</span>
        </div>
        <!--<img class="img" src="/img/logo.png" alt="">-->
      </div>
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
            {{ $t('login.title') }}{{ website.title }}
            <top-lang></top-lang>
          </h4>
          <userLogin v-if="activeName === 'user'"></userLogin>
          <codeLogin v-else-if="activeName === 'code'"></codeLogin>
          <thirdLogin v-else-if="activeName === 'third'"></thirdLogin>
          <div class="login-menu">
            <a href="#" @click.stop="activeName = 'user'">{{ $t('login.userLogin') }}</a>
            <!--<a href="#" @click.stop="activeName='code'">{{ $t('login.phoneLogin') }}</a>-->
            <a href="#" @click.stop="activeName = 'third'">{{ $t('login.thirdLogin') }}</a>
            <a :href="website.ssoUrl + website.redirectUri">{{ $t('login.ssoLogin') }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import userLogin from './userlogin.vue';
import codeLogin from './codelogin.vue';
import thirdLogin from './thirdlogin.vue';
import { mapGetters } from 'vuex';
import { validatenull } from '@/utils/validate';
import topLang from '@/page/index/top/top-lang.vue';
import { getQueryString, getTopUrl } from '@/utils/util';
import website from '@/config/website';

export default {
  name: 'login',
  components: {
    userLogin,
    codeLogin,
    thirdLogin,
    topLang,
  },
  data() {
    return {
      website: website,
      time: '',
      activeName: 'user',
      socialForm: {
        tenantId: '000000',
        source: '',
        code: '',
        state: '',
      },
    };
  },
  watch: {
    $route() {
      this.handleLogin();
    },
  },
  created() {
    this.handleLogin();
    this.getTime();
  },
  mounted() {},
  computed: {
    ...mapGetters(['tagWel']),
  },
  props: [],
  methods: {
    getTime() {
      setInterval(() => {
        this.time = this.$dayjs().format('YYYY-MM-DD HH:mm:ss');
      }, 1000);
    },
    handleLogin() {
      const topUrl = getTopUrl();
      const redirectUrl = '/oauth/redirect/';
      const ssoCode = '?code=';
      this.socialForm.source = getQueryString('source');
      this.socialForm.code = getQueryString('code');
      this.socialForm.state = getQueryString('state');
      if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
        let source = topUrl.split('?')[0];
        source = source.split(redirectUrl)[1];
        this.socialForm.source = source;
      }
      if (
        topUrl.includes(redirectUrl) &&
        !validatenull(this.socialForm.source) &&
        !validatenull(this.socialForm.code) &&
        !validatenull(this.socialForm.state)
      ) {
        const loading = this.$loading({
          lock: true,
          text: '第三方系统登录中,请稍后',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.$store
          .dispatch('LoginBySocial', this.socialForm)
          .then(() => {
            window.location.href = topUrl.split(redirectUrl)[0];
            this.$router.push(this.tagWel);
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      } else if (
        !topUrl.includes(redirectUrl) &&
        !validatenull(this.socialForm.code) &&
        !validatenull(this.socialForm.state)
      ) {
        const loading = this.$loading({
          lock: true,
          text: '单点系统登录中,请稍后',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.$store
          .dispatch('LoginBySso', this.socialForm)
          .then(() => {
            window.location.href = topUrl.split(ssoCode)[0];
            this.$router.push(this.tagWel);
            loading.close();
          })
          .catch(() => {
            loading.close();
          });
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/login.scss';
</style>
