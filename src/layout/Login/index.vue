<template>
  <div class="login-wrapper">
    <!--登录框-->
    <div class="login-inner" v-if="loginVisible">
      <button class="to-register"  @click="handleRegisterVisible">
        <i class="iconfont">&#xe64c;</i>
      </button>

      <div class="login-container">
        <div class="title login-title">欢迎登录</div>
        <div class="tips login-tips">没有账号？点左上角去注册一个吧~</div>

        <div class="input login-input">
          <input type="email" placeholder="邮箱" v-model="loginForm.email" />
        </div>
        <div class="input login-input">
          <input type="password" placeholder="密码" v-model="loginForm.password"/>
        </div>

        <div class="login-forget" @click="handleForgetVisible">忘记密码？</div>
        <button class="btn login-btn" @click="login">Login</button>
      </div>
    </div>

    <!--注册框-->
    <div class="register-inner" v-if="registerVisible">
      <button class="to-login" @click="handleLoginVisible">
        <i class="iconfont">&#xe64c;</i>
      </button>

      <div class="register-container">
        <div class="title register-title">欢迎注册</div>
        <div class="tips register-tips">已有账号？点左上角赶紧去登录吧~</div>

        <div class="input register-input">
          <input type="email" placeholder="邮箱" v-model="registerForm.email"/>
        </div>
        <div class="input register-input">
          <input type="text" placeholder="昵称" v-model="registerForm.nickname"/>
        </div>
        <div class="input register-input">
          <input type="password" placeholder="密码" v-model="registerForm.password"/>
        </div>

        <button class="btn register-btn" @click="register">Register</button>
      </div>
    </div>

    <!--忘记密码框-->
    <div class="forget-inner" v-if="forgetVisible">
      <button class="forget-to-login" @click="handleLoginVisible">
        <i class="iconfont">&#xe64c;</i>
      </button>

      <div class="forget-container">
        <div class="title forget-title">忘记密码</div>
        <div class="tips forget-tips">想起来了？点左上角赶紧去登录吧~</div>

        <div class="input forget-input">
          <input type="email" placeholder="邮箱" v-model="forgetForm.email"/>
        </div>
        <div class="input forget-input-code">
          <input type="text" placeholder="验证码" v-model="forgetForm.code"/>
          <button @click="handleSendEmailCode" v-if="BtnSendEmailCodeVisible">发送</button>
          <div class="countdown" v-else>{{countdown}}s</div>
        </div>
        <div class="input forget-input">
          <input type="password" placeholder="新密码" v-model="forgetForm.password"/>
        </div>

        <button class="btn forget-btn" @click="updatePassword">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/baseApi'
import USER_API_URL from '../../api/userApiUrl'
import commonUtils from '../../utils/commonUtils'
import COMMON_API_URL from '../../api/commonApiUrl'

export default {
  name: 'Login',
  created () {
    if (this.countdown !== 60) {
      this.handleCountDown()
    }
  },
  data () {
    return {
      loginVisible: true,
      registerVisible: false,
      forgetVisible: false,
      BtnSendEmailCodeVisible: true,
      countdown: commonUtils.getCookie('countdown') || 60,
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //  邮箱正则表达式
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        email: '',
        nickname: '',
        password: ''
      },
      forgetForm: {
        email: '',
        password: '',
        code: ''
      }
    }
  },
  methods: {
    handleLoginVisible () {
      this.loginVisible = true
      this.registerVisible = false
      this.forgetVisible = false
      this.clearAllForm()
    },
    handleRegisterVisible () {
      this.loginVisible = false
      this.registerVisible = true
      this.forgetVisible = false
      this.clearAllForm()
    },
    handleForgetVisible () {
      this.loginVisible = false
      this.registerVisible = false
      this.forgetVisible = true
      this.clearAllForm()
    },
    login () {
      if (!this.loginForm.email) return this.$message.error('登录邮箱不能为空哦~')
      if (!this.pattern.test(this.loginForm.email)) return this.$message.error('登录邮箱格式不合法哦~')
      if (!this.loginForm.password) return this.$message.error('登录密码不能为空哦~')

      if (this.loginForm.password.length < 6) return this.$message.error('登录密码要控制在 6 位或以上哦~')

      const user = {
        email: this.loginForm.email,
        password: this.loginForm.password
      }

      api.insertObject(USER_API_URL.login, user)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          window.localStorage.setItem('oblog-token', data.data)
          //  vuex 修改状态
          this.$store.commit('setIsLogin', true)
          this.$message.success(data.msg)
          this.clearLoginForm()
          this.$bus.$emit('loginFinished')
          this.$router.push('/index')
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    register () {
      if (!this.registerForm.email) return this.$message.error('注册邮箱不能为空哦~')
      if (!this.pattern.test(this.registerForm.email)) return this.$message.error('注册邮箱格式不合法哦~')
      if (!this.registerForm.nickname) return this.$message.error('注册昵称不能为空哦~')
      if (!this.registerForm.password) return this.$message.error('注册密码不能为空哦~')

      if (this.registerForm.nickname.length < 3 ||
          this.registerForm.nickname.length > 20) return this.$message.error('注册昵称要控制在 3 ~ 20 位哦~')
      if (this.registerForm.password.length < 6) return this.$message.error('注册密码要控制在 6 位或以上哦~')

      const user = {
        nickname: this.registerForm.nickname,
        email: this.registerForm.email,
        password: this.registerForm.password
      }
      api.insertObject(USER_API_URL.insertUser, user)
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)

          this.$message.success(data.msg)
          this.clearRegisterForm()
          this.handleLoginVisible()
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    updatePassword () {
      /**
       * 更新密码
       */
      if (!this.forgetForm.email) return this.$message.error('绑定邮箱不能为空哦~')
      if (!this.pattern.test(this.forgetForm.email)) return this.$message.error('绑定邮箱格式不合法哦~')
      if (!this.forgetForm.code) return this.$message.error('验证码不能为空哦~')
      if (!this.forgetForm.password) return this.$message.error('新密码不能为空哦~')

      if (this.forgetForm.password.length < 6) return this.$message.error('新密码要控制在 6 位或以上哦~')

      const user = {
        email: this.forgetForm.email,
        password: this.forgetForm.password,
        code: this.forgetForm.code
      }

      api.updateObject(USER_API_URL.forgetPassword, user)
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          this.$message.success(data.msg)
          this.clearForgetForm()
          this.handleLoginVisible()
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleSendEmailCode () {
      /**
       * 发送验证码至邮箱
       */
      if (!this.forgetForm.email) return this.$message.error('收取验证码的邮箱不能为空哦~')
      if (!this.pattern.test(this.forgetForm.email)) return this.$message.error('收取验证码的邮箱格式不合法哦~')

      commonUtils.setCookie('countdown', this.countdown, this.countdown)
      this.handleCountDown()

      api.insertObject(COMMON_API_URL.sendEmailCode, { email: this.forgetForm.email })
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleCountDown () {
      /**
       * 倒计时
       */
      this.BtnSendEmailCodeVisible = false
      const countdownTimer = setInterval(() => {
        this.countdown--
        commonUtils.setCookie('countdown', this.countdown, this.countdown)
        if (this.countdown < 0) {
          clearInterval(countdownTimer)
          this.BtnSendEmailCodeVisible = true
          this.countdown = 60
        }
      }, 1000)
    },
    clearAllForm () {
      /**
       * 清理全部框
       */
      this.clearLoginForm()
      this.clearRegisterForm()
      this.clearForgetForm()
    },
    clearLoginForm () {
      /**
       * 清理登录框
       */
      this.loginForm.email = ''
      this.loginForm.password = ''
    },
    clearRegisterForm () {
      /**
       * 清理注册框
       */
      this.registerForm.email = ''
      this.registerForm.nickname = ''
      this.registerForm.password = ''
    },
    clearForgetForm () {
      /**
       * 清理注册框
       */
      this.forgetForm.email = ''
      this.forgetForm.code = ''
      this.forgetForm.password = ''
    }
  }
}
</script>

<style lang="less">
.login-wrapper{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .login-inner,
  .register-inner,
  .forget-inner{
    width: 450px;
    background-color: #fff;
    height: 500px;
    border-radius: 10px;
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    transition: all .5s;
  }

  .login-inner{
    .login-container{
      display: flex;
      flex-direction: column;
      align-items: center;

      .login-title{
        color: #a29bfe;
      }

      .login-forget{
        font-size: 16px;
        color: #8c53ff;
        margin: 50px 0 20px;
        cursor: pointer;
      }
    }
  }
  .register-inner{
    .register-container{
      display: flex;
      flex-direction: column;
      align-items: center;

      .register-title{
          color: #74b9ff;
      }

      .register-input{
        input{
          border: 1px solid #74b9ff;
        }
      }

      .register-btn{
        margin-top: 45px;
        background-color: #74b9ff;

        &:hover{
          background-color: #fff;
          color: #32c1fb;
          border: 1px solid #32c1fb;
        }
      }
    }
  }
  .forget-inner{
    .forget-container{
      display: flex;
      flex-direction: column;
      align-items: center;

      .forget-title{
        color: #fd79a8;
      }

      .forget-input{
        input{
          border: 1px solid #fd79a8;
        }
      }

      .forget-input-code{
        display: flex;
        justify-content: space-between;
        input{
          width: 67%;
          border: 1px solid #fd79a8;
        }

        button{
          width: 30%;
          background-color: #fd79a8;
          border-radius: 5px;
          color: #fff;
          font-size: 15px;
          font-weight: bold;
          transition: all .3s;

          &:hover{
            background-color: #fff;
            border: 1px solid #fd79a8;
            color: #fd79a8;
          }
        }

        .countdown{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30%;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          background-color: #fff;
          border: 1px solid #fd79a8;
          color: #fd79a8;
          cursor: not-allowed;
        }
      }

      .forget-btn{
        margin-top: 45px;
        background-color: #fd79a8;

        &:hover{
          background-color: #fff;
          color: #fd79a8;
          border: 1px solid #fd79a8;
        }
      }
    }
  }

  .to-login,
  .to-register,
  .forget-to-login{
    color: #fff;
    background-color: #a29bfe;
    height: 50px;
    width: 50px;
    font-size: 18px;
    transition: all .5s;

    &:hover{
      color: #a29bfe;
      background-color: #fff;
    }
  }

  .to-login{
    background-color: #74b9ff;

    &:hover{
      color: #74b9ff;
    }
  }
  .forget-to-login{
    background-color: #fd79a8;

    &:hover{
      color: #fd79a8;
    }
  }

  .title{
    margin-top: 35px;
    padding: 15px 0;
    font-size: 30px;
    font-weight: bold;
  }

  .tips{
    padding-bottom: 15px;
    font-size: 15px;
    color: #777;
    margin-bottom: 30px;
  }

  .input{
    width: 230px;
    margin-bottom: 8px;
    input{
      display: block;
      width: 100%;
      padding: .375rem .75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #a29bfe;
      border-radius: .25rem;
      transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;

      &:focus{
        box-shadow: 0 0 1rem rgba(0,0,0,.1)!important;
      }
    }
  }

  .btn{
    width: 200px;
    height: 47px;
    font-size: 20px;
    font-weight: 600;
    background-color: #a29bfe;
    color: #fff;
    border-radius: 20px;
    transition: background-color .5s;

    &:hover{
      color: #a29bfe;
      background-color: #fff;
      border: 1px solid #a29bfe;
    }
  }
}

  @media screen and (min-width: 1023px){
    .login-wrapper{
      .login-inner,
      .register-inner,
      .forget-inner{
        padding: 0;
        width: 500px;
        height: 550px;
      }
    }
  }
</style>
