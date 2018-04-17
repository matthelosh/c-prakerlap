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
          v-for="(item, i) in menus"
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
      <v-toolbar-title>
        <v-avatar tile>
          <img src="/public/favicon-32x32.svg" alt="" height="24px">
        </v-avatar>  
        {{title}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <strong v-html="username"/>
      <v-btn icon>
        <v-avatar size="32px">
          <img :src="userFoto" alt="Profil">
        </v-avatar>
      </v-btn> 
      <v-btn icon @click.stop="logout" color="red" flat title="Keluar">
        <v-icon>fa-sign-out</v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>fa-bars</v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout column>
          
          <router-view></router-view>

        </v-layout>
      </v-container>
    </v-content>
    
  </div>
</template>

<script>
  import tokenService from './../lib/authServices.js'
  import axios from 'axios'
  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: true,
        menus: [],
        miniVariant: true,
        // items: [
        //   { icon: 'mdi-home', title: 'Beranda', role: '1', linkTo: '/dashboard' },
        //   { icon: 'mdi-settings', title: 'Pengaturan', role: '1', linkTo: '/dashboard/settings' },
        //   { icon: 'mdi-factory', title: 'DU/DI', role: '1', linkTo: '/dashboard/dudi' },
        //   { icon: 'mdi-teach', title: 'Pembimbing', role: '1', linkTo: '/dashboard/guru' },
        //   { icon: 'mdi-worker', title: 'Praktikan', role: '1', linkTo: '/dashboard/praktikan' },
        //   { icon: 'mdi-folder-outline', title: 'Prakerlap', role: '1', linkTo: '/dashboard/prakerlap' },
        //   { icon: 'mdi-file-document', title: 'Dokumen Penting', role: '1', linkTo: '/dashboard/dokumen' },
        //   { icon: 'mdi-calendar-text', title: 'Jurnal Praktikam', role: '1', linkTo: '/dashboard/jurnals' },
        //   { icon: 'mdi-lead-pencil', title: 'Tulis Info', role: '1', linkTo: '/dashboard/info' },
        //   { icon: 'fa-id-card-o', title: 'Profil', role: '2', linkTo: '/guru/profil' },
        //   { icon: 'fa-calendar', title: 'Jadwal', role: '2', linkTo: '/guru/jadwal' },
        //   { icon: 'fa-tv', title: 'Monitoring', role: '2', linkTo: '/guru/monitoring' },
        //   { icon: 'fa-file', title: 'Berkas Penting', role: '2', linkTo: '/guru/file' },
        //   { icon: 'mdi-lead-pencil', title: 'Tulis Info', role: '2', linkTo: '/guru/info' },
        //   { icon: 'mdi-account-card-details', title: 'Profil', role: '3', linkTo: '/praktikan/profil' },
        //   { icon: 'mdi-developer-board', title: 'Jurnal Praktikan', role: '3', linkTo: '/praktikan/jurnal' },
        //   { icon: 'mdi-message', title: 'Pengaduan', role: '3', linkTo: '/praktikan/jurnal' },
          
        // ],
        
        right: false,
        rightDrawer: false,
        title: 'Prakerlap SMKN 10 Malang',
        role: sessionStorage.getItem('role'),
        links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us']
      }
    },
    beforeCreate() {
      // var token = sessionStorage.getItem('token')
      var isAuth = this.$store.state.isLoggedIn;
      if ( !isAuth ) {
        alert('Anda tidak berhak masuk. Silahkan login dulu!')
        this.$router.push('/')
      }
    },
    mounted () {
      if(this.$router.path == '/'){
        return false;
      } else {
        var self = this;
        setInterval(function(){
            self.cekToken();
          }, 5000);
      }
    },
    created(){
      this.menuitems();
    },
    methods: {
      logout() {
        var out = confirm('Anda yakin mau keluar?')
        if(!out) {
          return false
        } else {
          
          this.$store.dispatch('Unsetuser');
          this.$router.push('/');
        }
      },
      cekToken(){
        // console.log(this.$router.history.current.path);
        var self = this;
        var token = sessionStorage.getItem("token");
        if(token == null){
          if(this.$router.history.current.path == '/') {
            return false;
          } else {
            this.$router.push('/');
            sessionStorage.removeItem("isLoggedIn");
          }
        } else {
          self.parseJwt = function(token){
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
          }
          var expTime = self.parseJwt(token);
          var timeStamp = Math.floor(Date.now()/1000);

          var timeCheck = expTime.exp - timeStamp;
          // console.log(timeCheck);
          if(timeCheck <= 0) {
            alert('Maaf! Token Anda habis. Silahkan Login kembali');
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("token");
            this.$router.push('/');


          }
        }
      },
      menuitems() {
        var self = this;
        var role = sessionStorage.getItem('role');
        var token = sessionStorage.getItem("token");
        axios.get('http://localhost:4567/api/menu/'+role, {headers: {'X-Access-Token' : token}})
              .then(function(res){
                self.menus = res.data;
              });
      }
    },
    computed: {
      userFoto() {
        var file = sessionStorage.getItem('_id'),
            foto = '/public/user-profiles/'+file+'.jpg'
        return foto

      },
      username(){
        return this.$store.state.user.nama;
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
