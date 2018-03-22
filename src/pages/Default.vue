<template lang="pug">
    div.landing-page
        .page#default
            <v-parallax src="/public/landing-bg/18-blurred.jpg">
                <v-layout column align-center justify-center>
                    v-btn(fab, small, flat, title="Masuk", color="teal accent-2", top, right, absolute, @click.native.stop="dialog=!dialog")
                        v-icon(color="white") fa-sign-in
                    v-btn(fab, small, flat, title="Dashboard", color="blue accent-2", top, right, absolute, @click.native.stop="$router.push('/dashboard')", v-show="isAuth", class="dashBtn")
                        v-icon(color="white") fa-tachometer
                    <h1 class="white--text">
                        i.fa.fa-cogs
                    </h1>
                    h1 Eprakerlap SMKN 10 Malang
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
                        <v-select label="Periode" v-model="login.periode" :items="periodItems" :rules="[v => !!v || 'Item is required']" required append-icon="mdi-arrow-down-drop-circle-outline"></v-select>
                        <v-text-field label="Name" v-model="login.uname" :rules="nameRules" append-icon="mdi-account-circle" :counter="10" required></v-text-field>
                        <v-text-field name="input-10-2" label="Enter your password" hint="At least 8 characters" min="8" :append-icon="e2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"      :append-icon-cb="() => (e2 = !e2)" class="input-group--focused" :type="e2 ? 'password' : 'text'" v-model="login.password"></v-text-field>
                        <v-select label="Peran User" v-model="login._role" :items="roleItems" :rules="[v => !!v || 'Item is required']" required append-icon="mdi-arrow-down-drop-circle-outline"></v-select>
                        <v-btn @click="submit(login)" :disabled="!valid">submit</v-btn>
                        <v-btn @click="clear">clear</v-btn>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn color="orange darken-1" flat @click.native="dialog = false">Batal</v-btn>
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
export default {
    data () {
        return {
            dialog: false,
            valid: true,
            name: '',
            nameRules: [
                (v) => !!v || 'Name is required',
                (v) => v && v.length <= 10 || 'Name must be less than 10 characters'
            ],
            roleItems: [
                {value:"1", "text":'Admin'},
                {value:"2", "text":'Pembimbing'},
                {value:"3", "text":'Praktikan'}
            ],
            periodItems: [
                {value: "10-1", "text": "10.1"},
                {value: "10-2", "text": "10.2"}
            ],
            e2: true,
            password: 'Password',
            login: {},
            alert: false,
            alertMsg: ''
        }
    },
    created () {
        this.cekAuth()
    },
    methods: {
      submit (dataLogin) {
        if (this.$refs.form.validate()) {
            console.log(dataLogin)
            axios.post('http://localhost:4567/user/authenticate', dataLogin)
                .then(response => {
                    console.log(response.data)
                    var res = response.data
                    if (res.success === false) {
                        this.alert = true
                        this.alertMsg = res.message
                    } else {
                        this.alert = false
                        sessionStorage.setItem('token', res.token)
                        sessionStorage.setItem('role', dataLogin._role)
                        sessionStorage.setItem('user', dataLogin.uname)
                        // sessionStorage.setItem('_id', dataLogin.uname)
                        this.$store.dispatch('setUser', dataLogin.uname)
                        this.$router.push('/dashboard')
                        
                    }
                })
                .catch(error=> {
                    if ( !error.response ) {
                        this.alert = true
                        this.alertMsg = 'Maaf. Sedang tidak terhubung ke Server.'
                    }
                })
            
        }
      },
      clear () {
        this.$refs.form.reset()
      },
        cekAuth () {
            var auth = this.$store.state.isLoggedIn
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
