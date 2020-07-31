import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userIp: '', //  用户 ip
    isLogin: false,
    userId: null,
    userEmail: null,
    userNickname: null,
    userAvatar: '',
    announceList: [], //  大家都在看列表
    watchingList: [] //  公告列表
  },
  mutations: {
    setUserIp: (state, value) => { state.userIp = value },
    setIsLogin: (state, value) => { state.isLogin = value },
    setUserId: (state, value) => { state.userId = value },
    setUserEmail: (state, value) => { state.userEmail = value },
    setUserNickname: (state, value) => { state.userNickname = value },
    setUserAvatar: (state, value) => { state.userAvatar = value },
    setAnnounceList: (state, value) => { state.announceList = value },
    setWatchingList: (state, value) => { state.watchingList = value }
  },
  actions: {
  },
  getters: {
    getUserIp: state => state.userIp,
    getIsLogin: state => state.isLogin,
    getUserId: state => state.userId,
    getUserEmail: state => state.userEmail,
    getUserNickname: state => state.userNickname,
    getUserAvatar: state => state.userAvatar,
    getAnnounceList: state => state.announceList,
    getWatchingList: state => state.watchingList
  }
})
