import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import VueSocketIO from 'vue-socket.io';

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
extend('required', {
  ...required,
  message: 'Feld wird benötigt'
});

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: VueSocketIO('https://spiralingdown.de'), //options object is Optional
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  })
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
