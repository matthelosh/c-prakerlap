import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLoggedIn: !!localStorage.getItem("token"),
        user: {}
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        }
    },
    getters: {

    },
    actions: {
        setUser(context, user) {
            var token = localStorage.getItem('token')
            var role = localStorage.getItem('role')
            axios.get('http://localhost:3456/protected/profile?id='+user+'&role='+role, {headers: {'X-Access-Token': token}})
                .then( response => {
                    var userData = response.data
                    return userData
                })
                .then(function(userData) {
                    context.commit('setUser', userData)
                })
            
        }
    }
});

export default store