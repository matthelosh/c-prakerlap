import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)


function load (component) {
  return () => System.import(`@pages/${component}.vue`)
}
export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Default',
      // component: HelloWorld
      component: load('Default')
    },
    {
      path: '/login',
      name: 'Login',
      component: load('Login')
    },
    {
      path: '/dashboard',
      // name: 'dashboard',
      component: load('Dash'),
      children: [
        {
          path: '/',
          component: load('dash/Home')
        },
        {
          path: '/dashboard/settings',
          component: load('dash/Settings')
        }
      ]
    }
  ]
})