import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import VueAxiosInit from 'common/plugins/vue-axios-init';
import VueAuthControl from 'common/plugins/vue-auth-control';

import router from './router';
import store from './store';
import App from './{{moduleNameUpper}}';

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.use(VueAxiosInit, axios);
Vue.use(VueAuthControl);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
