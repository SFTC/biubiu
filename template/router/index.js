import Vue from 'vue';
import Router from 'vue-router';

import CommonExample from '../pages/CommonExample';

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/commonexample',
    component: CommonExample,
  }],
});

export default router;
