import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from 'firebase';
import firebaseConfig from './firebase.config';
import VueClipboard from 'vue-clipboard2'


firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

