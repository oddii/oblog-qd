<template>
  <div class="blog-detail-wrapper">
    <div class="blog-detail-inner">
      <div class="blog-item">
        <!--博客首图-->
        <div class="blog-firstPicture">
          <img :src="firstPicture" alt="">
        </div>

        <!--博客头部-->
        <div class="blog-header">
          <div class="blog-title">{{title}}</div>
          <div class="blog-meta">
            <span class="blog-date"><i class="el-icon-date"/>{{gmtCreate}}</span>
            <span class="blog-flag">
              <router-link :to="{name:'BlogFlagGroup',params:{flag:flag}}">
                {{formatFlag(flag)}}
               </router-link>
            </span>
            <span class="blog-views"><i class="el-icon-view"/>{{views}}</span>
            <span class="blog-likes"><i class="iconfont">&#xe603;</i>{{likes}}</span>
            <span class="blog-shares"><i class="el-icon-position"/>{{shares}}</span>
            <span class="blog-author"><i class="el-icon-user"/>{{author}}</span>
            <span class="blog-type">
               <router-link :to="{name:'BlogTypeGroup',params:{typeName:type}}">
                  <i class="el-icon-folder"/>{{type}}
               </router-link>
            </span>
            <ul class="blog-tags">
              <li v-for="(item,index) in tag.split(' ')" :key="index">
                <router-link :to="{name:'BlogTagGroup',params:{tagName:item}}">
                  {{item}}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!--博客部分内容-->
        <div class="blog-content">
          <mavon-editor v-model="content" :editable="false" defaultOpen="preview" style="border:none"
                        :subfield="false" :toolbarsFlag="false" :boxShadow="false" previewBackground="#fff"/>
        </div>

        <!--博客底部-->
        <div class="blog-footer">
          <div class="blog-author-avatar">
            <!--              <div><i class="el-icon-user-solid"/></div>-->
            <div><img src="../../assets/avatar.jpg"/></div>
          </div>
          <div class="blog-author">{{author}}</div>
          <div class="blog-footer-bottom">
            <div class="blog-copyright" v-if="copyrightAble === 1">
              版权声明：本文由 <span>{{author}}</span> <span style="color:#8c53ff">原创</span> 出品，转载请注明出处！
            </div>
            <div class="blog-copyright" v-if="copyrightAble === 0">
              版权声明：本文由 <span>{{author}}</span> 出品，转载请注明出处！
            </div>
            <div class="blog-source">
              本文链接：<span>{{blogUrl}}</span>
            </div>
          </div>
        </div>

        <div class="blog-options">
          <el-tooltip content="点赞" placement="top" effect="light" :enterable="false" v-if="!isLiked">
            <div class="options-like" @click="handleLikesIncr">
              <i class="iconfont">&#xe603;</i>
            </div>
          </el-tooltip>
          <el-tooltip content="取消点赞" placement="top" effect="light" :enterable="false" v-if="isLiked">
            <div class="options-like" @click="handleLikesReduce">
              <i class="iconfont">&#xe849;</i>
            </div>
          </el-tooltip>
          <el-tooltip content="赞赏" placement="top" effect="light" :enterable="false"
                      v-if="appreciationAble === 1">
            <div class="options-appreciate">
              <i class="iconfont">&#xe611;</i>
            </div>
          </el-tooltip>
          <el-tooltip content="分享" placement="top" effect="light" :enterable="false">
            <div class="options-share" @click="handleSharesIncr">
              <i class="iconfont">&#xe7f2;</i>
            </div>
          </el-tooltip>
          <el-tooltip content="返回" placement="top" effect="light" :enterable="false">
            <div class="options-back" @click="handleGoBack">
              <i class="iconfont">&#xe60d;</i>
            </div>
          </el-tooltip>
        </div>

        <!--猜你喜欢-->
        <div class="blog-youlike">
          <div class="like-title"><i class="iconfont">&#xe62c;</i>猜你喜欢...</div>
          <ul class="like-list">
            <li class="like-item" v-for="item in randBlogList" :key="item.id">
              <router-link :to="{name:'BlogDetail',params:{id:item.id}}">
                <img :src="item.firstPicture" alt=""/>
                <h4>{{item.title}}</h4>
              </router-link>
            </li>
          </ul>
        </div>

        <!--上下篇博客-->
        <ul class="prev-next">
          <li class="prev">
            <router-link :to="{name:'BlogDetail',params:{id:prevBlog.id}}" v-if="prevBlog">
              <i class="iconfont">&#xe64c;</i>
              <div class="prev-inner">
                <span class="prev-title">上一篇</span>
                <span>{{prevBlog.title}}</span>
              </div>
            </router-link>
          </li>
          <li class="next">
            <router-link :to="{name:'BlogDetail',params:{id:nextBlog.id}}" v-if="nextBlog">
              <div class="next-inner">
                <span class="next-title">下一篇</span>
                <span>{{nextBlog.title}}</span>
              </div>
              <i class="iconfont">&#xe8f0;</i>
            </router-link>
          </li>
        </ul>

        <!--博客评论-->
        <div class="blog-comment" :v-if="commentAble === 1">
          <o-comment :data="commentList" :total="commentTotal" type="评论" :blog-id="id"/>
          <o-pagination :current-page="currentPage" :page-size="pageSize"
                        :total="commentTotal" :current-change="handleCurrentChange"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../../api/baseApi'
import BLOG_API_URL from '../../api/blogApiUrl'
import formatUtils from '../../utils/formatUtils'
import OComment from '../Comment/index'
import OPagination from '../Pagination/index'
import COMMENT_API_URL from '../../api/commentApiUrl'

export default {
  name: 'o-blog-detail',
  components: {
    OComment,
    OPagination
  },
  created () {
    this.id = this.$route.params.id
    this.handleViewsChange()
    this.getBlogCommentList({
      blogId: this.id,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })

    this.handleUpdateCommentList()
    this.getBlogIsLikedByIp()
  },
  data () {
    return {
      id: '',
      title: '', //  标题
      content: '', //  内容
      author: '', //  作者
      source: '', //  来源
      firstPicture: '', //  首图url地址
      flag: 0, //  专栏默认值
      views: 0, //  博客浏览数
      likes: 0, //  博客点赞数
      shares: 0, // 博客分享数
      type: '', //  分类
      tag: '', //  标签列表，以空格分隔
      appreciationAble: 0, //  赞赏开关
      commentAble: 0, //  评论开关
      copyrightAble: 0, //  版权开关
      gmtCreate: '', //  创建时间
      commentTotal: 0, //  评论总数
      commentList: [],
      currentPage: 1, //  评论列表当前页数
      pageSize: 6, //  评论列表每页大小
      prevBlog: {}, //  上一篇博客
      nextBlog: {}, //  下一篇博客
      randBlogList: [], //  猜你喜欢博客列表
      isLiked: false
    }
  },
  methods: {
    getParamsId () {
      return this.$route.params.id
    },
    getBlogInfo () {
      /**
         * 获得博客详情信息
         */
      api.getObjectById(BLOG_API_URL.getBlogById, this.id)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          const { blog } = data.data
          this.title = blog.title
          this.content = blog.content
          this.author = blog.author
          this.source = blog.source
          this.firstPicture = blog.firstPicture
          this.flag = blog.flag
          this.views = blog.views
          this.likes = blog.likes
          this.shares = blog.shares
          this.type = blog.type
          this.tag = blog.tag
          this.appreciationAble = blog.appreciationAble
          this.commentAble = blog.commentAble
          this.copyrightAble = blog.copyrightAble
          this.gmtCreate = formatUtils.gmt2YYYYmmdd(blog.gmtCreate)

          const { prevAndNext } = data.data
          this.prevBlog = prevAndNext.prevBlog
          this.nextBlog = prevAndNext.nextBlog

          const { randBlogList } = data.data
          this.randBlogList = randBlogList
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    getBlogCommentList (params = {}) {
      /**
         * 获得博客评论列表
         */
      api.getObject(COMMENT_API_URL.getCommentList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.commentList = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.commentTotal = data.data.total
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    getBlogIsLikedByIp () {
      /**
       * 判断用户是否点赞过了该博客
       */
      api.getObject(BLOG_API_URL.getBlogIsLikedByIp, {
        id: this.id,
        ip: this.$store.getters.getUserIp
      })
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)
          this.isLiked = data.data
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleUpdateCommentList () {
      /**
         *  触发评论插入后的列表异步刷新事件
         */
      this.$bus.$on('getCommentList', () => {
        this.currentPage = 1
        this.getBlogCommentList({
          blogId: this.id,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
      })
    },
    handleCurrentChange (newPage) {
      /**
         * 评论列表页码改变事件
         */
      this.currentPage = newPage
      this.getBlogCommentList({
        blogId: this.id,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })
    },
    handleViewsChange () {
      /**
         * 修改博客的访问数
         */

      api.updateObjectById(BLOG_API_URL.updateBlogViewsAndLikesById, this.id, {
        ip: this.$store.getters.getUserIp,
        type: 'views',
        option: 1
      })
        .then(result => {
          this.getBlogInfo()
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleLikesIncr () {
      /**
         * 增加博客的点赞数
         */
      api.updateObjectById(BLOG_API_URL.updateBlogViewsAndLikesById, this.id, {
        ip: this.$store.getters.getUserIp,
        type: 'likes',
        option: 1
      })
        .then(result => {
          const { data } = result
          if (data.code === 203) {
            this.$message.success('点赞成功')
            this.likes++
            this.isLiked = true
          }
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleLikesReduce () {
      /**
         * 减少博客的点赞数
         */
      api.updateObjectById(BLOG_API_URL.updateBlogViewsAndLikesById, this.id, {
        ip: this.$store.getters.getUserIp,
        type: 'likes',
        option: -1
      })
        .then(result => {
          const { data } = result
          if (data.code === 203) {
            this.$message.success('取消点赞成功')
            this.likes--
            this.isLiked = false
          }
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleSharesIncr () {
      /**
         * 修改博客的分享数
         */
      api.updateObjectById(BLOG_API_URL.updateBlogSharesById, this.id, {
        ip: this.$store.getters.getUserIp
      })
        .then(result => {
          const { data } = result
          if (data.code === 203) {
            this.$message.success('分享成功')
            this.shares++
          }
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
    handleGoBack () {
      /**
         * 回到上一页
         */
      this.$router.back()
    }
  },
  computed: {
    blogUrl () {
      /**
         * 本文链接
         * 如果有来源就用来源，否则直接返回路由
         */
      if (this.source === '') {
        return window.location.href
      } else {
        return this.source
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style lang="less">
  .blog-detail-wrapper {
    margin: 0 auto;
    position: relative;
    width: 100%;
    padding: 20px;

    .blog-detail-inner {
      padding: 20px;

      .blog-item {
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        margin: 0 auto 40px;
        max-width: 940px;
        border-radius: 10px;
        width: 100%;
        overflow: hidden;

        &:last-child {
          margin-bottom: 0;
        }

        .blog-firstPicture {
          max-width: 1920px;
          margin-bottom: 40px;
          padding-left: 0;
          padding-right: 0;

          img {
            display: block;
            width: 100%;
            height: auto;
          }
        }

        .blog-header {
          max-width: 640px;
          padding: 0 40px;
          position: relative;

          .blog-title {
            font-size: 38px;
            line-height: 1.3em;
            letter-spacing: -1px;
            margin-bottom: 20px;
            color: #333;
          }

          .blog-date,
          .blog-flag,
          .blog-views,
          .blog-likes,
          .blog-shares,
          .blog-author,
          .blog-type {
            margin-right: 11px;
            color: #777;
            display: inline-block;
            margin-bottom: 5px;

            i {
              margin-right: 6px;
            }
          }

          .blog-flag {
            border: 1px solid #a29bfe;
            border-radius: 3px;
            padding: 0.5px 6px;
            cursor: pointer;
            line-height: 20px;

            &:hover {
              color: #666;
              border: 1px solid #666;
            }
          }

          .blog-type {
            cursor: pointer;

            &:hover {
              color: #333;
            }
          }

          .blog-tags {
            margin-top: 10px;

            li {
              display: inline-block;
              background: #eee;
              color: #999;
              padding: 4px 10px;
              font-size: 15px;
              margin: 0 10px 5px 0;
              border-radius: 10px;
              cursor: pointer;
              transition: all .5s;

              &:hover {
                color: #777;
                background-color: #e5e5e5;
              }
            }
          }

        }

        .blog-content {
          position: relative;
          padding-right: 40px;
          padding-left: 40px;
          padding-bottom: 40px;
          margin-top: 30px;
          font-size: 19px;
          line-height: 1.6em;

          p:first-child {
            color: #888;
            max-width: 640px;
            margin: 0 auto 37px;
          }

          .more-link {
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

            &:hover {
              padding-right: 30px;
            }
          }
        }

        .blog-footer {
          margin: 40px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          background: #f5f5f5;
          border-radius: 10px;
          position: relative;
          color: #777;
          text-align: center;

          .blog-author-avatar {
            width: 64px;
            height: auto;
            position: relative;
            display: inline-block;
            margin-top: -32px;

            div {
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

            img {
              width: 64px;
              height: 64px;
              border-radius: 32px;
            }
          }

          .blog-author {
            color: #333;
            font-size: 19px;
            font-weight: 600;
            margin: 15px 0;
          }

          .blog-footer-bottom {
            text-align: left;
            padding: 0 60px;

            .blog-copyright {
              margin-bottom: 5px;

              span {
                color: #333;
              }
            }

            .blog-source {
              margin-bottom: 25px;

              span {

                &:hover {
                  color: #74b9ff;
                  cursor: pointer;
                }
              }
            }

          }

        }

        .blog-options {
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
          .options-share,
          .options-back {
            font-size: 25px;
            padding: 0 3px;
            cursor: pointer;
          }

          .options-like {
            color: #fd79a8;
          }

          .options-appreciate {
            color: #0984e3;
          }

          .options-share {
            color: #50bdb8;
          }

          .options-back {
            color: #8c53ff;
          }
        }

        .blog-youlike {
          padding: 0 40px 40px;

          .like-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 1em;
            color: #333;

            i {
              margin-right: 10px;
            }
          }

          .like-list {
            display: flex;

            .like-item {
              flex: 1;
              padding-right: 3px;

              &:last-child {
                padding-right: 0;
              }

              img {
                width: 100%;
                border-radius: 3px;
                margin-bottom: 20px;
              }

              h4 {
                display: inline-block;
                margin-bottom: 10px;
                color: #333;
                font-size: 17px;
                font-weight: 300;
                line-height: 1.4em;
                box-shadow: 0 1px 0 #999;
              }

              a {
                display: block;

                &:hover h4 {
                  color: #000;
                  box-shadow: 0 1px 0 #000;
                }
              }
            }
          }
        }

        .prev-next {
          margin: 0 40px 40px;
          display: flex;
          background: #f5f5f5;
          border-radius: 10px;

          .prev,
          .next {
            flex: 1;

            a {
              display: flex;
              align-items: center;
              padding: 10px 10px 10px 15px;
              /*padding-left: 15px;*/

              i {
                height: 44px;
                width: 30px;
                line-height: 44px;
                text-align: left;
                color: #999;
              }

              .prev-inner,
              .next-inner {
                display: flex;
                flex-direction: column;

                .prev-title,
                .next-title {
                  display: block;
                  font-size: 14px;
                  color: #aaa;
                  letter-spacing: 0.5px;
                  font-weight: normal;
                  text-transform: uppercase;
                }

                span {
                  font-size: 15px;
                  font-weight: 600;
                  color: #333;
                  display: block;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                }
              }

              &:hover {
                i {
                  color: #111;
                }
              }
            }
          }

          .next {
            border-left: 1px solid #ddd;

            a {
              justify-content: space-between;
              padding: 10px 15px 10px 10px;

              i {
                text-align: right;
              }
            }
          }
        }

        .blog-comment {
          padding: 0 40px 20px;
        }
      }
    }

  }

  @media screen and (max-width: 720px) {
    .blog-detail-wrapper {
      padding: 0;

      .blog-detail-inner {
        padding: 0;

        .blog-item {
          .blog-youlike {
            .like-list {
              flex-direction: column;
            }
          }

          .prev-next {
            flex-direction: column;

            a {
              i {
                height: auto !important;
                line-height: normal !important;
              }

              .prev-title,
              .next-title {
                display: none !important;
              }
            }
          }
        }

        .blog-footer-bottom {
          padding: 0 25px !important;

          .blog-source {
            word-wrap: break-word;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .blog-detail-wrapper {
      .blog-detail-inner {
        .blog-header {
          .blog-title {
            font-size: 22px !important;
          }
        }

        .blog-content {
          p {
            font-size: 17px;
            line-height: 19px;
          }
        }
      }
    }
  }
</style>
