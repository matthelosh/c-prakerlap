import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

import store from './store/index'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'vuetify/dist/vuetify.css'
import 'mdi/css/materialdesignicons.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(Vuetify)
Vue.use(Vuex)
new Vue({
  el: '#app',
  store,
  router,
  // store,
  render: h => h(App)
})
