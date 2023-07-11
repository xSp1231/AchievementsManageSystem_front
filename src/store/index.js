import {createStore} from 'vuex'
const store = createStore({
    state:{
      isCollapse:false
    },
    mutations: {
        collapseMenu(state) {
            state.isCollapse =!state.isCollapse;//折叠；
            console.log("vuex!!====",state.isCollapse)
        },
    },
})
export default store
