import Vue from 'vue'
import App from './App'
import store from 'vuex/store.js'
import '@/common/iconfont.css'
import * as filters from "./utils/filter.js"
Vue.config.productionTip = false

App.mpType = 'app'

Object.keys(filters).forEach((key)=>{
	Vue.filter(key,filters[key])
})

const app = new Vue({
    ...App,
	store
})
app.$mount()
