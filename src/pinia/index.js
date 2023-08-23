import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
export const useCounterStore = defineStore('PiniaStore', {
    state:()=>{
        return {
            count:0
        }
    },
    getters:{
        isAdult: (state) => {
            return state.age >= 18 ? '成年人' : '未成年'
        }

    },
    actions:{
        increment(){
           this.count++
        },
    }
})
