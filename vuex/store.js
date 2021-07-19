import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex)

export default new vuex.Store({
	state: {
		songListId: [],
		nextId: ''
	},
	mutations: {
		getsongListId(state, payload) {
			state.songListId = payload
		},
		getNextListId(state, payload) {
			// payload当前id
			for (let i = 0; i < state.songListId.length - 1; i++) {
				if(state.songListId[i].id == payload){
					state.nextId = state.songListId[i+1].id
				}
			}
		}
	},
	action: {}
})
