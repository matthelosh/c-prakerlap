import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLoggedIn: !!sessionStorage.getItem('token'),
        user: {},
        versi: 'v0.0.1a'
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            // state.isLoggedIn = true
        },
    	setAuth(state) {
    	    state.isLoggedIn = !!sessionStorage.getItem('token');
    	}
    },
    getters: {

    },
    actions: {
        setUser(context, user) {
            var token = sessionStorage.getItem('token')
            var role = sessionStorage.getItem('role')
            axios.get('http://localhost:4567/api/profile?id='+user+'&role='+role, {headers: {'X-Access-Token': token}})
                .then( response => {
                    var userData = response.data
                    sessionStorage.setItem('_id', userData[0]._id)
                    return userData[0];
                })
                .then(function(userData) {
                    context.commit('setUser', userData);
        		    context.commit('setAuth');
                })
            
        },
        Unsetuser(context){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('_id');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('periode');
            context.commit('setAuth');
        }
    }
});

export default store