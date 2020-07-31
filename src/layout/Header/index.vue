<template>
  <header class="header-wrapper">
    <!--logo-->
    <h1 class="logo">
      <a href="#"><img src="../../assets/1589094106897305972.png" alt="oblog"></a>
    </h1>

    <!--description-->
    <p class="description">Just another awesome simple and stylish blog theme</p>

    <!--展开折叠按钮-->
    <div class="unfold-wrapper">
      <div class="btn-unfold" @click="handleBtnUnfoldClick">
        <i class="iconfont">&#xe61c;</i>
      </div>
    </div>

    <!--nav-->
    <nav class="nav-wrapper">
      <div class="nav-container">
        <ul class="menu">
          <li class="menu-item" v-for="item in navList" :key="item.href">
            <router-link :to="item.href" :class="isActive(item.href)">{{item.title}}</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!--profile-->
    <div class="profile-wrapper">
      <div class="profile-image">
        <img src="../../assets/avatar.jpg" alt="avatar">
      </div>

      <div class="profile-name">odd</div>

      <div class="profile-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </div>

    <!--第三方链接-->
    <ul class="third-links clearfix">
      <li v-for="(item,index) in thirdLinks" :key="index">
        <el-tooltip effect="dark" :content="item.content" placement="top" :enterable="false">
          <router-link :to="item.href" v-if="item.type !== 'a'"><i class="iconfont">{{item.icon}}</i></router-link>
          <a :href="item.href" v-else><i class="iconfont">{{item.icon}}</i></a>
        </el-tooltip>
      </li>
    </ul>

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
  </header>
</template>

<script>

export default {
  name: 'o-header',
  mounted () {
    this.determineIsLogin()
  },
  data () {
    return {
      navVisible: false, //  导航菜单是否可见
      navList: [
        {
          href: '/index',
          title: '首页'
        },
        {
          href: '/type',
          title: '文章分类'
        },
        {
          href: '/archive',
          title: '文章归档'
        },
        {
          href: '/record',
          title: '个人记录'
        },
        {
          href: '/link',
          title: '友情链接'
        },
        {
          href: '/message',
          title: '留言板'
        }], //  导航菜单
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
        }],
      watchingList: [], //  大家都在看列表
      announceList: [] //  公告列表
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
    handleBtnUnfoldClick () {
      /**
       * 手机环境下导航菜单折叠展开按钮事件
       */
      const nav = document.querySelector('.header-wrapper').querySelector('.nav-container')
      if (!this.navVisible) {
        nav.classList.add('visible')
      } else {
        nav.classList.remove('visible')
      }
      this.navVisible = !this.navVisible
    },
    isActive (path) {
      /**
       * 判断是否激活
       */
      return this.$route.path === path ? 'active' : ''
    }
  }
}
</script>

<style lang="less">
.header-wrapper{
  .logo{
    font-size: 36px;
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1.2em;
    padding: 20px 0;
    position: relative;
    z-index: 2;

    a{
      display: block;
      color: #333;
      max-width: 100%;

      img{
        display: block;
        max-width: 100%;
        max-height: 90px;
        height: auto;
        padding: 0;
        border-radius: 0;
      }
    }
  }

  .description{
    font-size: 16px;
    line-height: 1.6em;
    font-weight: 300;
    color: #888;
    position: relative;
    z-index: 2;
    padding-bottom: 20px;
  }

  .third-links{
    display: none;
  }

  .nav-wrapper{
    .nav-container{
      .menu{
        .menu-item{
          border-right: none;
          margin-right: 24px;
          width: 100%;

          a{
            width: 100%;
            display: inline-block;
            position: relative;
            font-weight: 600;
            padding: 16px 50px;
            margin-bottom: -1px;
            margin: 0 -50px;
            color: #666;
            cursor: pointer;
            box-sizing: content-box;

            &:hover{
              background-color: #f5f5f5;
            }
          }

          .active{
            &:before{
              content: '';
              position: absolute;
              left: 0;
              border-left: 10px solid rgba(220,220,230,.7);
              border-right: 10px solid transparent;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
            }
          }
        }
      }
    }
  }

  .unfold-wrapper{
    display: none;
  }

  .profile-wrapper{
    position: relative;
    padding: 30px 50px 40px;
    margin: 0 -50px 0;
    border-bottom: 1px solid #eee;

    .profile-image{
      border: 10px solid #8c53ff;
      border-top-color: #32c1fb;
      border-bottom-color: #ddd;
      border-left: 0;
      display: block;
      border-radius: 0 150px 150px 0;
      width: 260px;
      height: 270px;
      margin-left: -50px;
      margin-bottom: 10px;

      img{
        border: 10px solid #fff;
        border-left: 0;
        display: block;
        border-radius: 0 240px 240px 0;
        width: 250px;
        height: 250px;
      }
    }

    .profile-name{
      color: #333;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2em;
      padding: 20px 0;
    }

    .profile-description{
      font-size: 16px;
      line-height: 1.6em;
      font-weight: 300;
      color: #888;
      position: relative;
    }
  }

  .recent-post-wrapper{
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

@media screen and (max-width: 960px){
  .header-wrapper{
    .nav-container{
        .menu{
          display: flex;
          padding-bottom: 20px;

          .menu-item{
            width: auto !important;

            a{
              &:hover{
                background-color: transparent !important;
              }
            }

            .active{
              &:before{
                border-left: 10px solid transparent !important;
              }
            }
          }
        }
    }

    .profile-wrapper{
      padding-bottom: 20px;
      border-top: 1px solid #eee;

      .profile-image{
        /*margin-left: -160px;*/
        float: left;
        width: 110px;
        height: 120px;

        img{
          width: 100px;
          height: 100px;
        }
      }

      .profile-name,
      .profile-description{
        padding-left: 110px;
        padding-right: 20px;
      }
    }

    .recent-post-wrapper{
      display: none;
    }
  }
}

@media screen and (max-width: 720px){
  .header-wrapper{
    padding: 20px 0 0!important;

    .logo{
      a{
        img{
          margin: 0 auto;
        }
      }
    }

    .description{
      text-align: center;
    }

    .third-links{
      display: flex;
      justify-content: center;
      margin: 15px 0;

      li{
        padding-right: 20px;
        color: #333;
        font-size: 25px;

        &:last-child{
          padding-right: 0;
        }
      }
    }

    .profile-wrapper{
      .profile-image{
        margin-left: 0;
      }

      .profile-name,
      .profile-description{
        padding-left: 130px;
        padding-right: 10px;
      }
    }

    .unfold-wrapper{
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #eee;

      .btn-unfold{
        padding: 10px 0;
        font-size: 22px;
        width: 50px;
        font-weight: 600;
        text-align: center;
        cursor: pointer;
      }
    }

    .nav-container{
      transition: max-height .5s;
      max-height: 0;
      overflow: hidden;
      border-top: 0;
      .menu{
        display: block;
        padding-bottom: 0;

        .menu-item{
          margin: 0 25px;
          a{
            font-size: 15px;
            padding: 12px 50px !important;
          }
        }
      }
    }

    .visible{
      max-height: 264px !important;
      border-top: 1px solid #eee !important;
    }
  }
}
</style>
