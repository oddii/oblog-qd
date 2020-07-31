<template>
  <div class="comment-wrapper">
    <div class="comment-header">{{total}} 条{{type}}</div>
    <div class="comment-inner">
      <ul class="comment-list">
        <!--单条评论-->
        <li class="comment-item" v-for="item in data" :key="item.id">
          <!--评论主体-->
          <div class="comment-body">
            <!--评论用户-->
            <div class="comment-user">
              <img v-if="item.avatar" :src="item.avatar" alt="">
              <el-avatar v-else icon="el-icon-user-solid" class="icon-avatar"/>
              <span class="username">{{item.nickname}}</span>
            </div>
            <!--评论信息-->
            <div class="comment-meta"><i class="el-icon-date"/> {{item.gmtCreate}}</div>
            <!--评论内容-->
            <p class="comment-content">{{item.content}}</p>
            <!--回复按钮-->
            <div class="reply" @click="handleReplyClick(item.id)">回复</div>
            <!--回复框框-->
            <div class="respond-inner" v-if="showRespondInner[item.id]">
              <!--如果没登陆就让用户先登录-->
              <div class="to-login" v-if="!$store.getters.getIsLogin">
                <router-link to="/login">先登个录呗~</router-link>
              </div>

              <div class="comment-reply-form" v-else>
                <div class="comment-reply-content">
                  <label>Content</label>
                  <textarea class="content" v-model="content"/>
                </div>
                <!--        <div class="comment-reply-emoji">😊</div>-->
                <div class="comment-reply-submit">
                  <button @click="handleSubmit(item.id,item.userId)">提交回复</button>
                </div>
                <span class="comment-reply-cancel"  @click="handleReplyCancel(item.id)">取消</span>
              </div>
            </div>
          </div>

          <!--评论回复主体-->
          <ul class="children">
            <li class="comment-item" v-for="children in item.children" :key="children.id">
              <!--回复主体-->
              <div class="comment-body">
                <!--评论用户-->
                <div class="comment-user">
                  <img v-if="children.avatar" :src="children.avatar" alt="" style="width: 36px;height: 36px;">
                  <el-avatar v-else icon="el-icon-user-solid" class="icon-avatar"
                             style="width: 36px;height: 36px;line-height: 34px"/>
                  <span class="username">{{children.nickname}}</span>
                </div>
                <!--评论信息-->
                <div class="comment-meta"><i class="el-icon-date"/> {{children.gmtCreate}}</div>
                <!--评论内容-->
                <p class="comment-content">
                  <span class="comment-cue">@{{children.replyUserNickname}}</span> {{children.content}}</p>
                <!--回复按钮-->
                <div class="reply" @click="handleReplyClick(children.id)">回复</div>
                <!--回复框框-->
                <div class="respond-inner" v-if="showRespondInner[children.id]">
                  <!--如果没登陆就让用户先登录-->
                  <div class="to-login" v-if="!$store.getters.getIsLogin">
                    <router-link to="/index">先登个录呗~</router-link>
                  </div>

                  <div class="comment-reply-form" v-else>
                    <div class="comment-reply-content">
                      <label>Content</label>
                      <textarea class="content" v-model="content"/>
                    </div>
                    <!--        <div class="comment-reply-emoji">😊</div>-->
                    <div class="comment-reply-submit">
                      <button @click="handleSubmit(item.id,children.userId)">提交回复</button>
                    </div>
                    <span class="comment-reply-cancel" @click="handleReplyCancel(children.id)">取消</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="comment-respond" v-if="respondVisible">
      <div class="comment-reply-title">留个言呗~</div>
      <div class="respond-inner">
        <!--如果没登陆就让用户先登录-->
        <div class="to-login" v-if="!this.$store.getters.getIsLogin">
          <router-link to="/login">先登个录呗~</router-link>
        </div>

        <div class="comment-reply-form" v-else>
          <div class="comment-reply-content">
            <label>Content</label>
            <textarea class="content" v-model="content"/>
          </div>
          <!--        <div class="comment-reply-emoji">😊</div>-->
          <div class="comment-reply-submit">
            <button @click="handleSubmit(null,null)">提交回复</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/baseApi'
import MESSAGE_API_URL from '../../api/messageApiUrl'
import COMMENT_API_URL from '../../api/commentApiUrl'

export default {
  name: 'o-comment',
  props: {
    total: Number,
    blogId: String, //  博客Id
    type: String, //  区分留言还是评论
    data: Array //  数据列表
  },
  data () {
    return {
      respondVisible: true,
      content: '', //  评论/留言内容
      showRespondInner: {} //  显示评论对象，以评论id为下标
    }
  },
  methods: {
    handleReplyClick (id) {
      /**
       * 点击回复的事件
       */
      this.content = ''
      this.respondVisible = false
      for (const replyId in this.showRespondInner) {
        this.$set(this.showRespondInner, replyId, false)
      }
      this.$set(this.showRespondInner, id, true)
    },
    handleReplyCancel (id) {
      /**
       * 点击取消回复的事件
       */
      this.content = ''
      this.respondVisible = true
      this.$set(this.showRespondInner, id, false)
    },
    handleSubmit (parentId, replyUserId) {
      /**
       * 提交回复
       */
      if (this.blogId) {
        this.insertComment(parentId, replyUserId)
      } else {
        this.insertMessage(parentId, replyUserId)
      }
    },
    insertComment (parentId, replyUserId) {
      /**
       * 插入评论
       */

      const comment = {
        blogId: this.blogId,
        userId: this.$store.getters.getUserId,
        content: this.content
      }

      if (replyUserId) comment.replyUserId = replyUserId
      if (parentId) comment.parentId = parentId

      api.insertObject(COMMENT_API_URL.insertComment, comment)
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)
          this.$message.success(data.msg)
          this.content = ''

          this.$bus.$emit('getCommentList')
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    insertMessage (parentId, replyUserId) {
      /**
       * 插入留言
       * @type {{userId: *, content: string}}
       */
      const message = {
        userId: this.$store.getters.getUserId,
        content: this.content
      }

      if (replyUserId) message.replyUserId = replyUserId
      if (parentId) message.parentId = parentId

      api.insertObject(MESSAGE_API_URL.insertMessage, message)
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)
          this.$message.success(data.msg)
          this.content = ''

          this.$bus.$emit('getMessageList')
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
.comment-wrapper{
  .comment-header{
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 1em;
    color: #333;
  }

  .comment-inner{
    .comment-list{
      margin-bottom: 20px;

      .comment-item{
        padding-left: 60px;
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;

        .comment-body{
          position: relative;
          padding-bottom: 15px;
          clear: both;

          .comment-user{
            margin-right: 6px;

            .icon-avatar,
            img{
              position: absolute;
              left: -60px;
              top: 0;
              width: 48px;
              height: 48px;
              border-radius: 100%;
            }

            .icon-avatar{
              line-height: 46px;
            }

            .username{
              color: #333;
              font-size: 13px;
              font-weight: 600;
            }
          }

          .comment-user,
          .comment-meta{
            font-size: 13px;
            display: block;
            float: left;
            line-height: 20px;
          }

          .comment-meta{
            color: #aaa;
          }

          .comment-content{
            margin-bottom: 8px;
            color: #777;
            clear: both;

            .comment-cue{
              color: #666;
              font-weight: 600;
              font-size: 13px;
            }
          }
        }
      }
    }

    .reply{
      display: inline-block;
      margin-bottom: 10px;
      font-size: 13px;
      line-height: 16px;
      color: #aaa;
      cursor: pointer;
    }
  }

  .comment-respond{
    .comment-reply-title{
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  .respond-inner{
    .to-login{
      a{
        background: #f5f5f5;
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

  .comment-reply-form{
    position: relative;
    background: #f5f5f5;
    padding: 10px 20px 20px;
    margin-bottom: 15px;
    border-radius: 10px;

    .comment-reply-content{
      label{
        padding: 6px 0;
        color: #333;
        font-weight: 600;
        display: block;
      }

      textarea{
        max-width: 100%;
        width: 100%;
        font-size: 15px;
        height: 100px;
        background: #fff;
        border: 2px solid #e5e5e5;
        color: #777;
        display: block;
        outline: none;
        padding: 7px 8px;
        resize: none;
      }
    }

    .comment-reply-submit{
      display: inline-block;
      margin-top: 20px;

      button{
        background: #333;
        color: #fff;
        padding: 8px 14px;
        font-weight: 600;
        border-radius: 3px;
      }
    }

    .comment-reply-cancel{
      color: #777;
      display: block;
      position: absolute;
      bottom: 26px;
      right: 20px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
