import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)


function load (component) {
  return () => System.import(`@pages/${component}.vue`)
}
var router = new Router({
  // mode: 'history',
  // base: '/',
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
        },
        {
          path: '/dashboard/dudi',
          component: load('dash/Dudi')
        },
        {
          path: '/dashboard/guru',
          component: load('dash/Pembimbing')
        },
        {
          path: '/dashboard/praktikan',
          component: load('dash/Praktikan')
        },
        {
          path: '/dashboard/prakerlap',
          component: load('dash/Prakerlap')
        },
        {
          path: '/dashboard/info',
          component: load('dash/Info')
        },
        {
          path: '/guru/profil',
          component: load('guru/Profile')
        },
        {
          path: '/guru/jadwal',
          component: load('guru/Jadwal')
        },
        {
          path: '/guru/monitoring',
          component: load('guru/Monitoring')
        },
        {
          path: '/guru/file',
          component: load('guru/Berkas')
        },
        {
          path: '/guru/jurnal',
          component: load('guru/Jurnal')
        },
        {
          path: '/praktikan/profil',
          component: load('praktikan/Profil')
        },
        {
          path: '/praktikan/jurnal',
          component: load('praktikan/Jurnal')
        },
        {
          path: '/praktikan/pengaduan',
          component: load('praktikan/Pengaduan')
        }

      ]
    },
    {
      path: '*',
      component: load('404')
    }
  ]
})
export default router;

// { icon: 'fa-user', title: 'Profil', role: '2', linkTo: '/guru/profil' },
//           { icon: 'fa-calendar', title: 'Jadwal', role: '2', linkTo: '/guru/jadwal' },
//           { icon: 'fa-tv', title: 'Monitoring', role: '2', linkTo: '/guru/monitoring' },
//           { icon: 'fa-file', title: 'Berkas Penting', role: '2', linkTo: '/guru/file' },
//           { icon: 'fa-table', title: 'Jurnal Praktikan', role: '2', linkTo: '/guru/jurnal' }