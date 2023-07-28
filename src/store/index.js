import { createStore } from 'vuex';
import user from './modules/user';
import common from './modules/common';
import tags from './modules/tags';
import logs from './modules/logs';
import dict from './modules/dict';
import getters from './getters';

const store = createStore({
  modules: {
    user,
    common,
    logs,
    tags,
    dict,
  },
  getters,
});

export default store;
