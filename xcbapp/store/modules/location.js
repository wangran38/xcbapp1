const state = {
	selectStatus:false // 菜市场是否更新
}


const mutations = {
	setStatus:()=>{
		state.selectStatus = !state.selectStatus
	}
}

export default {
	namespaced: true,
	state,
	mutations
};