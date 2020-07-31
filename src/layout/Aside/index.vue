<template>
  <aside class="aside-wrapper">
    <!--search-->
    <div :class="[searchVisible?'active':'','search']" @click="handleSearch">
      <i class="iconfont" v-if="!searchVisible">&#xe741;</i>
      <i class="iconfont" v-else>&#xe62d;</i>
    </div>

    <!--search-expend-->
    <div class="search-expend" v-if="searchVisible">
      <div class="search-expand-inner">
        <input placeholder="找找有啥想要的看看~" v-model="searchValue" @keyup.enter="search"/>
      </div>
    </div>

    <!--第三方链接-->
    <ul class="third-links">
      <li v-for="(item,index) in thirdLinks" :key="index">
        <el-tooltip effect="dark" :content="item.content" placement="right" :enterable="false">
          <router-link :to="item.href" v-if="item.type !== 'a'"><i class="iconfont">{{item.icon}}</i></router-link>
          <a :href="item.href" v-else><i class="iconfont">{{item.icon}}</i></a>
        </el-tooltip>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'o-aside',
  created () {
    this.determineIsLogin()
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
        }],
      searchVisible: false,
      searchValue: ''
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
            href: '/setting',
            icon: '\ue871',
            type: 'link'
          })
        }
      }, 0)
    },
    handleSearch () {
      this.searchVisible = !this.searchVisible
      this.searchValue = ''
    },
    search () {
      this.$router.push({ name: 'BlogSearchGroup', params: { searchValue: this.searchValue } })
      this.handleSearch()
    }
  }
}
</script>

<style lang="less">
  .aside-wrapper {
    position: relative;

    .search {
      background: #fff;
      border: 1px solid #eee;
      color: #333;
      text-align: center;
      font-weight: 600;
      font-size: 25px;
      line-height: 25px;
      cursor: pointer;
      border-radius: 10px;
      padding: 17px 0;
      margin: 10px;
      display: block;
    }

    .active{
      background: #f1f1f1;
      color: #333;
      border-radius: 10px 0 0 10px;
    }

    .search-expend {
      background: #f1f1f1;
      padding: 13px 12px 13px 0;
      position: absolute;
      top: 10px;
      left: 70px;
      width: 310px;
      height: 62px;
      border-radius: 0 10px 10px 0;
      z-index: 10;

      .search-expand-inner {
        position: relative;
        height: 100%;

        &:after{
          position: absolute;
          font-family:'iconfont' !important;
          font-style:normal;
          -webkit-font-smoothing: antialiased;
          -webkit-text-stroke-width: 0.2px;
          -moz-osx-font-smoothing: grayscale;
          content: '\e741';
          left: 10px;
          top: 9px;
          font-size: 17px;
          color: #777;
        }

        input {
          width: 100%;
          height: 100%;
          background: #fff;
          padding-left: 30px;
          line-height: 20px;
          border: 1px solid #ddd;

          &:focus{
            border: 1px solid #bbb;
          }
        }
      }
    }

    .third-links {
      margin-top: 20px;

      li {
        margin: 0 auto;
        padding: 4px 0;
        width: 100%;
        position: relative;

        a {
          display: flex;
          justify-content: center;
          font-size: 23px;
          padding: 15px 0;
          margin: 0 20px;
          color: rgba(0, 0, 0, 0.7);
          transition: all .5s;

          &:hover {
            background-color: #f5f5f5;
            border-radius: 10px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 960px){
    .aside-wrapper{
      .active{
        border-radius: 0 10px 10px 0;
      }

      .search-expend{
        left: auto;
        right: 70px;
        border-radius: 10px 0 0 10px;
        padding-left: 12px;
        padding-right: 0;
      }
    }
  }
</style>
