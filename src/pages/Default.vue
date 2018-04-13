<template lang="pug">
    div.landing-page
        .page#default
            <v-parallax src="/public/landing-bg/18-blurred.jpg">
                <v-layout row>

                    
                </v-layout>
                <v-layout row>
                    v-flex(xs6 offset-xs1)
                        v-card(color="purple" dark)
                            <img src="/public/favicon-32x32.svg" type="image/svg" alt="" width="128px" height="128px" style="float:left;z-index:2;">
                            v-card-title 
                                h1 PKL <br>
                            h4 &nbsp;&nbsp;&nbsp; SISTEM INFORMASI PRAKERLAP <br> &nbsp;&nbsp;&nbsp;&nbsp;SMKN 10 MALANG
                            //- v-card-text 
                        
                    v-btn(fab small flat title="Masuk" color="teal accent-2" top right fixed @click.native.stop="openLoginForm")
                        v-icon(dark color="white" ripple) mdi-login-variant
                    v-btn(fab small  flat title="Dashboard" color="blue accent-2" top right absolute @click.native.stop="$router.push('/dashboard')" v-show="isAuth" class="dashBtn")
                        v-icon(color="white") mdi-view-dashboard
                </v-layout>
                
                <v-layout row>
                    <v-flex xs10 offset-xs1>
                        <lobby></lobby>
                    </v-flex>
                </v-layout>
            </v-parallax>
        <v-dialog v-model="dialog" persistent max-width="500">
            <v-card>
                <v-card-title class="headline">Masuk Sistem</v-card-title>
                <v-card-text>
                    <v-alert color="error" icon="fa-warning" :value="alert">
                    | {{alertMsg}}
                    </v-alert>
                    <v-form v-model="valid" ref="form" lazy-validation>
                        <v-select label="Periode" v-model="selPeriode" :items="periodes" :rules="[v => !!v || 'Item is required']" required append-icon="mdi-arrow-down-drop-circle-outline" v-bind:value="login.periode" on:input="onSelectPeriod" item-value="_id" item-text="periode"></v-select>
                        <v-text-field label="Masukkan Username" v-model="login.uname" :rules="nameRules" append-icon="mdi-account-circle" :counter="10" required></v-text-field>
                        <v-text-field name="input-10-2" label="Masukkan Kata Kunci" hint="At least 8 characters" min="8" :append-icon="e2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"      :append-icon-cb="() => (e2 = !e2)"  :type="e2 ? 'password' : 'text'" v-model="login.password" required></v-text-field>
                        //- <v-select label="Peran User" v-model="login._role" :items="roleItems" :rules="[v => !!v || 'Item is required']" required append-icon="mdi-arrow-down-drop-circle-outline"></v-select>
                        <v-btn @click="submit(login)" :disabled="!valid">submit</v-btn>
                        <v-btn @click="clear">clear</v-btn>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn color="red darken-1" flat @click.native="close">Batal</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>    
        .page#so
            <v-parallax src="/public/landing-bg/parralax.jpg">
                <v-layout>
                    #so-content(sm12)
                        <h1 class="white--text">Struktur Organisasi</h1>
                        <h4 class="white--text">Eprakerlap SMKN 10 Malang!</h4>
                        .so-box
                </v-layout>
            </v-parallax>
            
</template>
<script>
import axios from 'axios'
import Lobby from '@pages/comps/Lobby'
export default {
    components: {Lobby},
    data () {
        return {

            dialog: false,
            valid: true,
            name: '',
            nameRules: [
                (v) => !!v || 'Name is required',
                (v) => v && v.length <= 10 || 'Name must be less than 10 characters'],
            periodes: [],
            selPeriode: '',
            e2: true,
            password: 'Password',
            login: {},
            alert: false,
            alertMsg: '',
        }
    },
    created () {
        this.getPeriode()
        this.cekAuth()
        // this.setPeriod();
    },
    methods: {
        openLoginForm(){
            this.dialog = true,
            this.seldPeriode();
        },
        getPeriode(){
            var self = this;
            axios.get('http://localhost:4567/umum/periode')
                 .then((res) => {
                    self.periodes = res.data;
                 });
        },
        seldPeriode(){
            var self = this;
            var items = this.periodes;
            var now = new Date();
            // console.log('halo bos');Date(Date.parse(dateString1));
            for ( var i = 0; i < items.length; i++){
                var mulai = new Date(Date.parse(items[i].mulai).valueOf());
                var selesai = new Date(Date.parse(items[i].selesai).valueOf());
                // console.log(selesai);
                var r = mulai < now && now < selesai;
                // console.log(r);
                if ( mulai < now && now < selesai) {
                    self.selPeriode = items[i]._id;
                    // console.log(items[0]._id);
                    // console.log('true');
                } else {
                    // console.log('salah');
                }
            }
            // console.log('seldPeriode');
        },
      submit (dataLogin) {
        if (this.$refs.form.validate()) {
            // console.log(dataLogin)
            axios.post('http://localhost:4567/user/authenticate', dataLogin)
                .then(response => {
                    // console.log(response.data)
                    var res = response.data
                    if (res.success === false) {
                        this.alert = true
                        this.alertMsg = res.message
                    } else if(res.success === true ) {
                        this.alert = false
                        sessionStorage.setItem('token', res.token)
                        sessionStorage.setItem('periode', this.selPeriode)
                        sessionStorage.setItem('role', res.role)
                        sessionStorage.setItem('user', dataLogin.uname)
                        sessionStorage.setItem('_id', dataLogin.uname)
                        this.$store.dispatch('setUser', dataLogin.uname)
                        this.$router.push('/dashboard')
                        // console.log(res);
                        
                    }
                })
                .catch(error=> {
                    if ( !error.response ) {
                        this.alert = true
                        this.alertMsg = 'Maaf. Sedang tidak terhubung ke Server.'
                        console.log(error);
                    } else {

                    }
                })
            
        }
      },
      close(){
        this.dialog = false;
        this.clear();
      },
      clear () {
        this.$refs.form.reset()
      },
        cekAuth () {
            var auth = this.$store.state.isLoggedIn
        },
        // setPeriod(){
        //     var self = this;
        //     self.login.periode = self.periodItems[1];
        // },
        onSelectPeriod(){
            this.login.periode = 'klk';
        }   
    },
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
      isAuth () {
          return this.$store.state.isLoggedIn
      }
    }
}
</script>
<style lang="sass" scoped>
    .landing-page
        color: #fefefe
        margin: 0!important
        position: absolute
        height: 100vh
        width: 100vw
        min-height: 100vh
        .page
            box-sizing: border-box
            position: relative
            .btn--top.btn--absolute.btn--small
                top: 10px!important
            .btn--right.btn--absolute.btn--small
                right: 20px
            .dashBtn.btn--right.btn--absolute.btn--small
                right: 60px
        #default
        #so
            background:
                color: orange
            #so-content
                //padding: 20px
                width: 100%
                
</style>
