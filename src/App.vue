<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import USER_API_URL from './api/userApiUrl'
import api from './api/baseApi'
export default {
  name: 'app',
  created () {
    this.determineLogin()
    this.getUserIp()

    this.$bus.$on('loginFinished', () => {
      this.token = window.localStorage.getItem('oblog-token') || undefined
      this.getUserInfo(this.token)
    })
  },
  data () {
    return {
      token: '',
      userInfo: null
    }
  },
  methods: {
    getUserIp () {
      /**
       * 得到用户的ip
       */
      // eslint-disable-next-line no-undef
      this.$store.commit('setUserIp', returnCitySN.cip)
      console.log(this.$store.getters.getUserIp)
    },
    determineLogin () {
      /**
       * 判断用户是否登录
       */
      this.token = window.localStorage.getItem('oblog-token') || undefined
      if (this.token) {
        //  如果有token且token没有过期，将isLogin返回true
        this.getUserInfo(this.token)
      } else {
        //  否则将isLogin返回false
        this.$store.commit('setIsLogin', false)
        this.$store.commit('setUserId', null)
        this.$store.commit('setUserEmail', null)
        this.$store.commit('setUserNickname', null)
        this.$store.commit('setUserAvatar', '')
      }
    },
    getUserInfo (token) {
      /**
       * 获得用户信息
       */
      api.getObjectById(USER_API_URL.getUserByToken, token)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return
          this.userInfo = data.data

          if (this.userInfo) {
            this.$store.commit('setIsLogin', true)
            this.$store.commit('setUserId', this.userInfo.id)
            this.$store.commit('setUserEmail', this.userInfo.email)
            this.$store.commit('setUserNickname', this.userInfo.nickname)
            this.$store.commit('setUserAvatar', this.userInfo.avatar)
          } else {
            this.$store.commit('setIsLogin', false)
            this.$store.commit('setUserId', null)
            this.$store.commit('setUserEmail', null)
            this.$store.commit('setUserNickname', null)
            this.$store.commit('setUserAvatar', '')
          }
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    }
  }
}
</script>

<style lang="less">
#app{
  margin: 0 auto;
}

@media screen and (min-width: 1024px) {
  #app {
    width: 100%;
    margin-top: 40px;
  }
}

@media screen and (min-width: 1200px){
  #app{
    width: 1200px;
  }
}

</style>
