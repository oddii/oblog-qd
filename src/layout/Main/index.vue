<template>
  <main class="main-wrapper">
    <!--content-->
    <div class="content">
      <keep-alive>
        <router-view :key="$route.fullPath"/>
      </keep-alive>
    </div>

    <div class="bottom">
      <div class="bottom-inner">
        <!--大家都在看-->
        <div class="recent-post-wrapper">
          <h3 class="title">大家都在看</h3>
          <ul>
            <li v-for="item in $store.getters.getWatchingList" :key="item.id">
              <router-link :to="{name:'BlogDetail',params:{id:item.id}}">{{item.title}}</router-link>
            </li>
          </ul>
        </div>

        <!--最新公告-->
        <div class="recent-post-wrapper">
          <h3 class="title">最新公告</h3>
          <ul>
            <li v-for="item in $store.getters.getAnnounceList" :key="item.id">
              <i class="el-icon-chat-dot-round"/>
              {{item.title}}</li>
          </ul>
        </div>
      </div>
    </div>

    <!--footer-->
    <div class="footer">
      <!--回到顶部-->
      <div class="back-top" @click="handleBackTop">
        <i class="iconfont">&#xe6f0;</i>
      </div>

      <!--底部信息-->
      <div class="footer-info">
        <div class="info-item">
          <div class="logo">
            <img src="../../assets/indite-logo.png" alt="">
          </div>

          <div class="copyright">
            odd © 2020. All Rights Reserved.
          </div>

          <div class="audit">
            粤网备xxxx
          </div>
        </div>

        <div class="info-item ">
          <ul class="third-links clearfix">
            <li v-for="(item,index) in thirdLinks" :key="index">
              <el-tooltip effect="dark" :content="item.content" placement="top" :enterable="false">
                <router-link :to="item.href" v-if="item.type !== 'a'"><i class="iconfont">{{item.icon}}</i></router-link>
                <a :href="item.href" v-else><i class="iconfont">{{item.icon}}</i></a>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import api from '../../api/baseApi'
import BLOG_API_URL from '../../api/blogApiUrl'
import SETTING_API_URL from '../../api/setttingApiUrl'

export default {
  name: 'o-main',
  created () {
    this.determineIsLogin()
    this.getWatchingList()
    this.getAnnounceList()
  },
  data () {
    return {
      thirdLinks: [
        {
          content: 'wechat',
          href: '',
          icon: '\ue883',
          type: 'link'
        },
        {
          content: 'qq',
          href: '',
          icon: '\ue882',
          type: 'link'
        }, {
          content: 'csdn',
          href: '',
          icon: '\ue661',
          type: 'a'
        }, {
          content: 'github',
          href: '',
          icon: '\ue885',
          type: 'a'
        }]
    }
  },
  methods: {
    determineIsLogin () {
      /**
       * 判断是否登录
       */
      setTimeout(() => {
        if (this.$store.getters.getIsLogin) {
          this.thirdLinks.push({
            content: 'settings',
            href: 'setting',
            icon: '\ue871',
            type: 'link'
          })
        }
      }, 0)
    },
    handleBackTop () {
      /**
      * 回到顶部
      */
      let top = document.documentElement.scrollTop || document.body.scrollTop
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    },
    getWatchingList (params = {}) {
      api.getObject(BLOG_API_URL.getTop5BlogList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.$store.commit('setWatchingList', data.data)
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    getAnnounceList (params = {}) {
      api.getObject(SETTING_API_URL.getLatestAnnoList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.$store.commit('setAnnounceList', data.data)
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
.main-wrapper{
  min-height: 600px;
  background-color: #f5f5f5;
  .content{
    max-width: 800px;
  }

  .bottom{
    display: none;
    border-top: 1px solid #ccc;
    .bottom-inner{
      display: flex;
      padding: 40px;

      .recent-post-wrapper{
        flex: 1;
        margin: 30px 0;
        .title{
          font-size: 16px;
          margin: 0 -50px 10px;
          padding: 0 50px;
          color: #333;
        }

        ul{
          color: #999;
          li{
            padding: 7px 0;
            cursor: pointer;
            a{
              font-size: 15px;
              &:before{
                font-family: "iconfont";
                content: '\e77e';
                font-size: 15px;
                margin-right: 6px;
                color: #999;
                width: 1em;
                text-align: center;
              }
            }
            &:hover{
              color: #333;
            }
          }
        }
      }
    }
  }

  .footer{
    color: #777;
    position: relative;
    padding-bottom: 30px;
    border-top: 1px solid #ccc;
    text-align: center;

    .back-top{
      border: 1px solid #ccc;
      border-top: 0;
      color: #333;
      width: 60px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      border-radius: 0 0 10px 10px;
      cursor: pointer;

      i{
        font-size: 27px;
        font-weight: bold;
      }
    }

    .footer-info{
      padding: 30px 50px;

      .info-item{
        .logo{
            img{
             max-height: 60px;
             margin-bottom: 20px;
           }
        }

        .copyright,
        .audit{
          font-size: 15px;
          color: #666;
          font-weight: 300;
          line-height: 1.6em;
        }

        .third-links{
          padding-top: 30px;
          display: flex;
          justify-content: center;

          li{
            padding-right: 8px;
            color: #333;
            font-size: 21px;

            &:last-child{
              padding-right: 0;
            }
          }
        }
      }

    }
  }
}

</style>
