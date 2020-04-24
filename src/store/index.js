import Vue from "vue";
import Vuex from "vuex";

import componentsModule from './modules/components';
import authenticationModule from './modules/authentication';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    components:componentsModule,
    authentication:authenticationModule,
  }
});
