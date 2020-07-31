<template>
  <div class="blog-group-wrapper">
    <div class="blog-group-inner">

      <div class="blog-group-name">
        <div v-if="$route.name === 'BlogTypeGroup'"><i class="iconfont" >&#xe6e4;</i>{{getTypeName()}}</div>
        <div v-if="$route.name === 'BlogTagGroup'"><i class="iconfont" >&#xe601;</i>{{getTagName()}}</div>
        <div v-if="$route.name === 'BlogFlagGroup'"><i class="iconfont">&#xe601;</i>{{formatFlag(getFlag())}}</div>
      </div>
      <div class="blog-group-description" v-if="$route.name !== 'Index' && $route.name !== 'BlogSearchGroup'">
        共有 {{total}} 篇文章
      </div>
      <!--搜索框过来的描述-->
      <div class="search-blog-description" v-if="$route.name === 'BlogSearchGroup'">
        <div class="desc-title">
          <i class="el-icon-warning" v-if="total === 0"/>
          <i class="iconfont" v-else>&#xe741;</i>
          <span>{{total}} 个搜索结果</span>
        </div>
        <div class="desc-tips">
          对关键词 <span class="desc-keyword">"{{getSearchValue()}}"</span> 而言.
          <span v-if="total === 0">请尝试其他搜索结果.</span>
        </div>
        <div class="desc-search">
          <input v-model="inputValue" @keyup.enter="search" placeholder="再找找啥想要看看的~"/>
        </div>
      </div>

      <div class="blog-item" v-for="item in blogList" :key="item.id">
        <!--博客首图-->
        <div class="blog-firstPicture">
          <img :src="item.firstPicture" alt="">
        </div>

        <!--博客头部-->
        <div class="blog-header">
          <div class="blog-title">{{item.title}}</div>
          <div class="blog-meta">
            <span class="blog-date"><i class="el-icon-date"/>{{formatDate(item.gmtCreate)}}</span>
            <span class="blog-flag">
              <router-link :to="{name:'BlogFlagGroup',params:{flag:item.flag}}">
                {{formatFlag(item.flag)}}
               </router-link>
            </span>
            <span class="blog-views"><i class="el-icon-view"/>{{item.views}}</span>
            <span class="blog-likes"><i class="iconfont">&#xe603;</i>{{item.likes}}</span>
            <span class="blog-shares"><i class="el-icon-position"/>{{item.shares}}</span>
            <span class="blog-author"><i class="el-icon-user"/>{{item.author}}</span>
            <span class="blog-type">
               <router-link :to="{name:'BlogTypeGroup',params:{typeName:item.type}}">
                  <i class="el-icon-folder"/>{{item.type}}
               </router-link>
            </span>
            <ul class="blog-tags">
              <li v-for="(tag,index) in item.tag.split(' ')" :key="index">
                <router-link :to="{name:'BlogTagGroup',params:{tagName:tag}}">
                  {{tag}}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!--博客部分内容-->
        <div class="blog-content">
          <p>{{item.content}}</p>
          <p><router-link :to="{name:'BlogDetail',params:{id:item.id}}" class="more-link">Continue reading…</router-link></p>
        </div>
      </div>

    </div>
    <o-pagination :current-page="currentPage" :page-size="pageSize" v-if="total !== 0"
                  :total="total" :current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import OPagination from '../Pagination/index'
import api from '../../api/baseApi'
import BLOG_API_URL from '../../api/blogApiUrl'
import formatUtils from '../../utils/formatUtils'
export default {
  name: 'o-blog-group',
  props: ['typeName', 'tagName', 'flag', 'searchValue'],
  components: { OPagination },
  created () {
    this.determineRouter()
  },
  data () {
    return {
      blogList: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
      inputValue: ''
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
    },
    determineRouter () {
      /**
       * 判断路由状况
       */
      //  根据路由参数加载相应组件
      if (this.$route.name === 'BlogTypeGroup') {
        this.getGroupByWrapper('type', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          value: this.getTypeName()
        })
      } else if (this.$route.name === 'BlogTagGroup') {
        this.getGroupByWrapper('tag', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          value: this.getTagName()
        })
      } else if (this.$route.name === 'BlogFlagGroup' ||
        this.getSearchValue() === '原创' || this.getSearchValue() === '转载') {
        const params = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }

        if (this.$route.name === 'BlogFlagGroup') {
          params.value = this.getFlag()
        } else {
          params.value = this.formatFlag2Num(this.getSearchValue())
        }
        this.getGroupByWrapper('flag', params)
      } else if (this.$route.name === 'BlogSearchGroup') {
        this.getBlogList({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          like: this.getSearchValue()
        })
      } else if (this.$route.name === 'Index') {
        this.getGroupByWrapper('status', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          value: 1
        })
      }
    },
    getBlogList (params = {}) {
      /**
       * 获得所有博客
       */
      api.getObject(BLOG_API_URL.getBlogList, params)
        .then(result => {
          const { data } = result

          this.blogList = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    getTypeName () {
      /**
       * 获得分类名称
       */
      return this.typeName
    },
    getTagName () {
      /**
       * 获得博客标签名称
       */
      return this.tagName
    },
    getFlag () {
      return this.flag
    },
    getSearchValue () {
      /**
       * 获得模糊搜索的值
       */
      return this.searchValue
    },
    getGroupByWrapper (wrapper, params = {}) {
      /**
       * 根据条件名获得相应的博客分组
       */
      api.getObjectByWrapper(BLOG_API_URL.getBlogByWrapper, wrapper, params)
        .then(result => {
          const { data } = result

          this.blogList = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    formatFlag (flag) {
      return flag === 1 ? '转载' : '原创'
    },
    formatFlag2Num (flag) {
      return flag === '原创' ? 0 : 1
    },
    formatDate (gmt) {
      /**
       * 格式化日期
       */
      return formatUtils.gmt2YYYYmmdd(gmt)
    },
    search () {
      if (this.inputValue !== this.getSearchValue()) {
        this.$router.push({ name: 'BlogSearchGroup', params: { searchValue: this.inputValue } })
      }
    }
  }
}
</script>

<style lang="less">
.blog-group-wrapper{
  margin: 0 auto;
  position: relative;
  width: 100%;
  padding: 20px;

  .blog-group-inner{
    padding: 20px;

    .blog-group-name{
      font-family: 'Roboto Light';
      font-size: 32px;
      line-height: 1.4em;
      font-weight: 300;
      color: #333;
      word-wrap: break-word;
      i{
        font-weight: 400;
        margin-right: 12px;
      }
    }

    .blog-group-description{
      font-size: 18px;
      font-weight: 300;
      position: relative;
      color: #777;
      line-height: 1.6em;
      margin-top: 10px;
      margin-bottom: 35px;
    }

    .search-blog-description{
      margin-bottom: 45px;
      .desc-title{
        display: flex;
        align-items: center;
        font-size: 32px;
        line-height: 1.4em;
        font-weight: 300;
        color: #333;
        margin-bottom: 12px;

        i{
          font-size: 37px;
          margin-right: 15px;
        }
      }

      .desc-tips{
        font-size: 18px;
        font-weight: 300;
        color: #333;
        margin-bottom: 15px;
        .desc-keyword{
          font-weight: 500;
          color: #000;
        }
      }

      .desc-search{
        position: relative;

        &:after{
          position: absolute;
          font-family:'iconfont' !important;
          font-style:normal;
          -webkit-font-smoothing: antialiased;
          -webkit-text-stroke-width: 0.2px;
          -moz-osx-font-smoothing: grayscale;
          content: '\e741';
          left: 11px;
          top: 10px;
          font-size: 17px;
          color: #777;
        }
        input{
          width: 100%;
          border: 2px solid #e5e5e5;
          color: #777;
          display: block;
          max-width: 100%;
          outline: none;
          padding: 7px 8px 7px 30px;
          line-height: 17px;
          font-size: 17px;

          &:focus{
            border: 2px solid #ccc;
          }
        }

      }
    }

    .blog-item{
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      margin: 0 auto 40px;
      max-width: 940px;
      border-radius: 10px;
      width: 100%;
      overflow: hidden;

      &:last-child{
        margin-bottom: 0;
      }

      .blog-firstPicture{
        max-width: 1920px;
        margin-bottom: 40px;
        padding-left: 0;
        padding-right: 0;

        img{
          display: block;
          width: 100%;
          height: auto;
        }
      }

      .blog-header{
        max-width: 640px;
        padding: 0 40px;
        position: relative;

        .blog-title{
          font-size: 38px;
          line-height: 1.3em;
          letter-spacing: -1px;
          margin-bottom: 20px;
          color: #333;
        }

        .blog-comments,
        .blog-flag,
        .blog-date,
        .blog-views,
        .blog-likes,
        .blog-shares,
        .blog-author,
        .blog-type{
          margin-right: 11px;
          color: #777;
          display: inline-block;
          margin-bottom: 5px;

          i{
            margin-right: 6px;
          }
        }

        .blog-flag{
          border: 1px solid #a29bfe;
          border-radius: 3px;
          padding: 0.5px 6px;
          cursor: pointer;
          line-height: 20px;

          &:hover{
            color: #666 ;
            border: 1px solid #666;
          }
        }

        .blog-type{
          cursor: pointer;

          &:hover{
            color: #333;
          }
        }

        .blog-tags{
          margin-top: 10px;

          li{
            display: inline-block;
            background: #eee;
            color: #999;
            padding: 4px 10px;
            font-size: 15px;
            margin: 0 10px 5px 0;
            border-radius: 10px;
            cursor: pointer;
            transition: all .5s;

            &:hover{
              color: #777;
              background-color: #e5e5e5;
            }
          }
        }

      }

      .blog-content{
        position: relative;
        padding-right: 40px;
        padding-left: 40px;
        padding-bottom: 40px;
        margin-top: 30px;
        font-size: 19px;
        line-height: 1.6em;

        p:first-child{
          color: #888;
          max-width: 640px;
          margin: 0 auto 37px;
          max-height: 150px;
          overflow-y: hidden;
          font-size: 17px;
        }

        .more-link{
          font-size: 17px;
          color: #333;
          font-weight: 600;
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 10px 20px;
          border-radius: 30px 0 0 0;
          border-left: 10px solid #32c1fb;
          border-top: 10px solid #8c53ff;
          transition: all .3s;

          &:hover{
            padding-right: 30px;
          }
        }
      }

      .blog-footer{
        margin: 40px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        background: #f5f5f5;
        border-radius: 10px;
        position: relative;
        color: #777;
        text-align: center;

        .blog-author-avatar{
          width: 64px;
          height: auto;
          position: relative;
          display: inline-block;
          margin-top: -32px;

          div{
            width: 64px;
            height: 64px;
            background-color: #c0c4cc;
            border-radius: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 27px;
            color: #eeeeee;
          }

          img{
            width: 64px;
            height: 64px;
            border-radius: 32px;
          }
        }

        .blog-author{
          color: #333;
          font-size: 19px;
          font-weight: 600;
          margin: 15px 0;
        }

        .blog-footer-bottom{
          text-align: left;
          padding: 0 60px;

          .blog-copyright{
            margin-bottom: 5px;
            span{
              color: #333;
            }
          }

          .blog-source{
            margin-bottom: 25px;
            span{

              &:hover{
                color: #74b9ff;
                cursor: pointer;
              }
            }
          }

        }

      }

      .blog-options{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 40px;
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 10px;

        .options-like,
        .options-appreciate,
        .options-share{
          font-size: 25px;
          padding: 0 3px;
          cursor: pointer;
        }

        .options-like{
          color:#fd79a8;
        }

        .options-appreciate{
          color: #0984e3;
        }

        .options-share{
          color: #50bdb8;
        }
      }

      .blog-comment{
        padding: 0 40px 20px;
      }
    }
  }

}

  @media screen and (max-width: 720px){
    .blog-group-wrapper{
      padding: 0;
      .blog-group-inner{
        padding: 0;

        .blog-group-name{
          padding-top: 15px;
          padding-left: 15px;
          font-size: 21px;
        }
        .blog-group-description{
          padding-left: 15px;
          font-size: 16px;
        }

        .search-blog-description{
          padding: 20px;

          .desc-title{
            font-size: 20px;
            i{
              font-size: 23px;
            }
          }

          .desc-tips{
            font-size: 17px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1024px){
    .blog-group-wrapper{
      .blog-group-inner{
        .blog-header{
          .blog-title{
            font-size: 22px !important;
          }
        }

        .blog-content{
          p{
            font-size: 17px;
            line-height: 19px;
          }
        }
      }
    }
  }
</style>
