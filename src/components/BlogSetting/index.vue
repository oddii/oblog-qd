<template>
  <div class="blog-setting-wrapper">
    <div class="blog-setting-inner" v-if="$store.getters.getIsLogin">
      <div class="setting-header">
        个人设置
        <div class="btn-logout" @click="logout">退出登录</div>
      </div>
      <div class="setting-avatar">
        <el-upload class="avatar-uploader" :action="uploadAction"
          :show-file-list="false" :on-success="handleUploadSuccess" :before-upload="beforeUploadUpload">
            <img v-if="$store.getters.getUserAvatar" :src="$store.getters.getUserAvatar" class="avatar">
            <div v-else class="icon-avatar"><i class="el-icon-user-solid"/></div>
        </el-upload>
      </div>
      <div class="info-wrapper">
        <div class="info-item info-nickname">
          <span v-if="!editInfo.nickname" @click="handleNicknameEdit">{{$store.getters.getUserNickname}}</span>
          <div class="edit-item" v-else>
            <input type="text" v-model="nickname"/>
            <button class="btn btn-submit" @click="handleNicknameSubmit"><i class="el-icon-check"/></button>
            <button class="btn btn-cancel" @click="handleNicknameEditCancel"><i class="el-icon-close"/></button>
          </div>
        </div>
        <div class="info-item info-email" >
          <span v-if="!editInfo.email" @click="handleEmailEdit">{{$store.getters.getUserEmail}}</span>
          <div class="edit-item" v-else>
            <input type="email" v-model="email"/>
            <button class="btn btn-submit" @click="handleEmailSubmit"><i class="el-icon-check"/></button>
            <button class="btn btn-cancel" @click="handleEmailEditCancel"><i class="el-icon-close"/></button>
          </div>
        </div>
        <div class="info-item info-password" @click="handlePasswordEdit">
          <span>修改密码</span>
        </div>
      </div>
    </div>
    <div class="to-login" v-else>
      <router-link to="/login">先登个录呗~</router-link>
    </div>

    <el-dialog title="修改密码" :visible.sync="editInfo.password" width="325px"
               :before-close="handlePasswordEditCancel">
      <el-form :model="passwordForm" :rules="passwordRules" ref="editPasswordFormRef">
        <el-form-item label="旧密码：" prop="oldPassword" label-width="95px">
          <el-input type="password" v-model="passwordForm.oldPassword"/>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword" label-width="95px">
          <el-input type="password" v-model="passwordForm.newPassword"/>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword" label-width="95px">
          <el-input type="password" v-model="passwordForm.confirmPassword"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePasswordEditCancel">取 消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api/baseApi'
import USER_API_URL from '../../api/userApiUrl'
import config from '../../utils/config'
import COMMON_API_URL from '../../api/commonApiUrl'

export default {
  name: 'o-blog-setting',
  data () {
    return {
      uploadAction: config.baseUrl + COMMON_API_URL.uploadImage2AliyunOSS,
      editInfo: {
        nickname: false,
        email: false,
        password: false
      },
      nickname: '',
      email: '',
      passwordForm: {
        oldPassword: '', //  旧密码
        newPassword: '', //  新密码
        confirmPassword: '' //  确认密码
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空哦~', trigger: 'blur' },
          { min: 6, message: '长度在 6 位以上哦~', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空哦~', trigger: 'blur' },
          { min: 6, message: '长度在 6 位以上哦~', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空哦~', trigger: 'blur' },
          { min: 6, message: '长度在 6 位以上哦~', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleNicknameEdit () {
      this.$set(this.editInfo, 'nickname', true)
      this.$set(this.editInfo, 'email', false)
      this.$set(this.editInfo, 'password', false)
    },
    handleNicknameEditCancel () {
      this.$set(this.editInfo, 'nickname', false)
      this.nickname = this.$store.getters.getUserNickname
    },
    handleNicknameSubmit () {
      const user = {
        id: this.$store.getters.getUserId,
        nickname: this.nickname
      }
      api.updateObjectById(USER_API_URL.updateUserById, user.id, user)
        .then(result => {
          const { data } = result
          if (data.code !== 203) {
            this.nickname = this.$store.getters.getUserNickname
            return this.$message.error(data.msg)
          }

          this.$set(this.editInfo, 'nickname', false)
          this.$store.commit('setUserNickname', this.nickname)
          return this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) {
            this.nickname = this.$store.getters.getUserNickname
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleEmailEdit () {
      this.$set(this.editInfo, 'nickname', false)
      this.$set(this.editInfo, 'email', true)
      this.$set(this.editInfo, 'password', false)
    },
    handleEmailEditCancel () {
      this.$set(this.editInfo, 'email', false)
      this.email = this.$store.getters.getUserEmail
    },
    handleEmailSubmit () {
      const user = {
        id: this.$store.getters.getUserId,
        email: this.email
      }
      api.updateObjectById(USER_API_URL.updateUserById, user.id, user)
        .then(result => {
          const { data } = result
          if (data.code !== 203) {
            this.email = this.$store.getters.getUserEmail
            return this.$message.error(data.msg)
          }

          this.$set(this.editInfo, 'email', false)
          this.$store.commit('setUserEmail', this.email)
          return this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) {
            this.email = this.$store.getters.getUserEmail
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handlePasswordEdit () {
      this.$set(this.editInfo, 'nickname', false)
      this.$set(this.editInfo, 'email', false)
      this.$set(this.editInfo, 'password', true)
    },
    handlePasswordEditCancel () {
      this.$set(this.editInfo, 'password', false)
      this.passwordForm = {
        oldPassword: '', //  旧密码
        newPassword: '', //  新密码
        confirmPassword: '' //  确认密码
      }
    },
    handlePasswordSubmit () {
      this.$refs.editPasswordFormRef.validate((valid) => {
        if (valid) {
          if (this.passwordForm.newPassword !==
              this.passwordForm.confirmPassword) {
            return this.$message.error('确认密码输入不一致哦~')
          }

          const id = this.$store.getters.getUserId

          api.updateObjectById(USER_API_URL.updatePassword, id, {
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          })
            .then(result => {
              const { data } = result
              if (data.code !== 203) return this.$message.error(data.msg)

              this.handlePasswordEditCancel()
              return this.$message.success(data.msg)
            })
            .catch(error => {
              if (error.response) {
                return this.$message.error('服务器出现错误，请稍后再试')
              }
            })
        } else {
          return this.$message.error('请填写相关信息哦~')
        }
      })
    },
    handleUploadSuccess (result, file) {
      /**
       * 确认上传图片成功
       */
      const avatar = result.data
      const id = this.$store.getters.getUserId
      api.updateObjectById(USER_API_URL.updateUserById, id, {
        avatar
      })
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)
          this.$message.success(data.msg)
          this.$store.commit('setUserAvatar', avatar)
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    beforeUploadUpload (file) {
      /**
       * 检查图片类型与获得上传的 key 与 token
       */
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt500Kb = file.size / 1024 / 1024 < 0.5

      if (!isValid) return this.$message.error('上传图片只能是 jpg 或 png 格式！')
      if (!isLt500Kb) return this.$message.error('上传图片大小不能超过 500kb！')
    },
    logout () {
      /**
       * 退出登录
       */

      window.localStorage.removeItem('oblog-token')
      this.$store.commit('setIsLogin', false)
      this.$store.commit('setUserId', null)
      this.$store.commit('setUserEmail', null)
      this.$store.commit('setUserNickname', null)
      this.$store.commit('setUserAvatar', '')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
.blog-setting-wrapper{
  .blog-setting-inner{
    min-height: 800px;
    margin-bottom: 0;

    .setting-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 1em;
      color: #333;

      .btn-logout{
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        &:hover{
          color: #8c53ff;
        }
      }
    }

    .setting-avatar{
      width: 100%;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 50px 0 75px;
      .avatar-uploader .el-upload {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar,
      .icon-avatar{
        height: 270px;
        width: 270px;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 1px 0 rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      .icon-avatar{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #c0c4cc;
        i{
          font-size: 70px;
          color: #fff;
        }
      }
      /*img{*/
      /*  height: 270px;*/
      /*  width: 270px;*/
      /*  border-radius: 50%;*/
      /*  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 1px 0 rgba(0, 0, 0, 0.05);*/
      /*  cursor: pointer;*/
      /*}*/
    }

    .info-wrapper{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .info-item{
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 260px;
        padding: 7px 8px;
        margin-bottom: 15px;
        cursor: pointer;
        border: 1px solid #999;
        border-radius: 28px;

        .edit-item{
          display: flex;

          input{
            max-width: 150px;
            font-size: 17px;
            padding-left: 8px;
          }

          .btn{
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            width: 40px;
            height: 30px;
            line-height: 30px;
            border-radius: 25px;
            color: #fff;
            font-size: 18px;
            transition: all .5s;
            i{
              font-weight: bold;
            }
          }

          .btn-submit{
            background-color: #55efc4;
            margin-right: 5px;
            border: 1px solid #55efc4;

            &:hover{
              background-color: #fff;
              color: #55efc4;
              border: 1px solid #55efc4;
            }
          }

          .btn-cancel{
            background-color: #ff7675;
            border: 1px solid #ff7675;

            &:hover{
              background-color: #fff;
              color: #ff7675;
              border: 1px solid #ff7675;
            }
          }
        }

        span{
          display: inline-block;
          height: 30px;
          line-height: 30px;
          color: #555;
          font-size: 18px;
          font-weight: 600;
          &:hover{
            color: black;
          }
        }

      }
    }
  }

  .to-login{
    a{
      background: #fff;
      border-radius: 10px;
      font-weight: 600;
      padding: 10px 14px;
      margin-bottom: 4px;
      display: block;
      color: #333;
      font-size: 15px;
      width: 115px;
      text-align: center;
    }
  }
}
</style>
