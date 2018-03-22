import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLoggedIn: false,
        user: {}
    },
    mutations: {
        setUser(state, user) {
            state.user = user
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
                    return userData
                })
                .then(function(userData) {
                    context.commit('setUser', userData);
		    context.commit('setAuth');
                })
            
        }
    }
});

export default store