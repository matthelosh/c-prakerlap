<template>
  <div>
          <v-navigation-drawer
      fixed
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile 
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.linkTo"
          v-if="item.role == role"
          :title="item.title"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-btn @click.stop="drawer = !drawer" icon flat><v-icon>fa-bars</v-icon></v-btn>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'fa-chevron-right' : 'fa-chevron-left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>fa-globe</v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-avatar size="32px">
          <img :src="userFoto" alt="Profil">
        </v-avatar>
      </v-btn> 
      <v-btn icon @click.stop="logout">
        <v-icon>fa-sign-out</v-icon>
      </v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>fa-bars</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout column align-center>
          
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import tokenService from './../lib/authServices.js'
  export default {
    data () {
      return {
        clipped: true,
        drawer: false,
        fixed: true,
        items: [
          { icon: 'mdi-home', title: 'Beranda', role: '1', linkTo: '/dashboard' },
          { icon: 'mdi-settings', title: 'Pengaturan', role: '1', linkTo: '/dashboard/settings' },
          { icon: 'mdi-factory', title: 'DU/DI', role: '1', linkTo: '/dashboard/dudi' },
          { icon: 'mdi-account-multiple', title: 'Pembimbing', role: '1', linkTo: '/dashboard/guru' },
          { icon: 'mdi-account-multiple-outline', title: 'Praktikan', role: '1', linkTo: '/dashboard/praktikan' },
          { icon: 'mdi-chart-areaspline', title: 'Statistik', role: '1', linkTo: '/dashboard/statistik' },
          { icon: 'mdi-file-document', title: 'Dokumen Penting', role: '1', linkTo: '/dashboard/dokumen' },
          { icon: 'mdi-calendar-text', title: 'Jurnal Praktikam', role: '1', linkTo: '/dashboard/jurnals' },
          { icon: 'mdi-lead-pencil', title: 'Tulis Artikel', role: '1', linkTo: '/dashboard/artikel' },
          { icon: 'fa-cogs', title: 'Pengaturan', role: '2', linkTo: '/about' },
          { icon: 'fa-cogs', title: 'Pengaturan', role: '2', linkTo: '/about' },
          { icon: 'fa-cogs', title: 'Pengaturan', role: '2', linkTo: '/about' },
          { icon: 'fa-cogs', title: 'Pengaturan', role: '2', linkTo: '/about' },
          { icon: 'fa-cogs', title: 'Pengaturan', role: '2', linkTo: '/about' },
          { icon: 'fa-cogs', title: 'Pengaturan', role: '2', linkTo: '/about' },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Prakerlap SMKN 10 Malang',
        role: localStorage.getItem('role')
      }
    },
    beforeCreate() {
      var token = localStorage.getItem('token')
      if ( !token ) {
        alert('Anda tidak berhak masuk. Silahkan login dulu!')
        this.$router.push('/')
      }
    },
    mounted () {
      setInterval(function(){
          tokenService.cekToken();
        }, 5000);
    },
    methods: {
      logout() {
        var out = confirm('Anda yakin mau keluar?')
        if(!out) {
          return false
        } else {
          localStorage.removeItem('token')
        this.$router.push('/')
        }
      }
    },
    computed: {
      userFoto() {
        var file = this.$store.state.user[0]._id,
            foto = '/public/user-profiles/'+file+'.jpg'
        return foto

      }
    }
  }
</script>

<style scoped>
  .dashContent-enter-active, .dashContent-leave-active {
    transition: opacity 1s ;
  }
  .dashContent-enter, .dashContent-leave-to {
    opacity: 0;
    transform: translateX(-20%);
  }
</style>
