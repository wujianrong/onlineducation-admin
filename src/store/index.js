import Vue from 'vue'
import Vuex from 'vuex'
import AuthUser from './modules/auth-user'
import Login from './modules/login'
import Menu from './modules/menu'

Vue.use(Vuex);

export default new Vuex.Store({

    modules:{
        AuthUser,
        Login,
        Menu
    }
    ,strict:true
})
