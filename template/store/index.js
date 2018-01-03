import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'common/layout/store/layout';
import commonExample from './modules/commonExample';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    layout,
    commonExample,
  },
});

export default store;
