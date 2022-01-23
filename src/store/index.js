import { createStore } from 'vuex'
import portfolio from '@/store/modules/portfolio'

const store = createStore({
  modules: {
    portfolio: portfolio
  }
})

export default store