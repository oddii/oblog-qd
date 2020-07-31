<template>
    <div class="blog-archive-wrapper">
      <div class="blog-archive-inner">
        <div class="archive-header">{{monthCount}} 个月，{{blogCount}} 篇文章</div>
        <ul class="archive-list">
          <li class="archive-item" v-for="(item,index) in archiveList" :key="index">
            <div class="archive-date">
              <div class="archive-year-month">{{item.year}}-{{item.month}}</div>
              <div class="archive-month" :style="{color: item.color}">{{item.enMonth}}</div>
            </div>
            <ul class="blog-list">
              <li class="blog-item" v-for="blog in item.blogList" :key="blog.id"
                @click="handleItemClick(blog.id)">
                {{blog.title}}
              </li>
            </ul>
            <div class="type-count">{{item.num}}篇</div>
          </li>
        </ul>
      </div>
      <o-pagination :current-page="currentPage" :page-size="pageSize"
                    :total="monthCount" :current-change="handleCurrentChange"/>
    </div>
</template>

<script>
import OPagination from '../Pagination/index'
import api from '../../api/baseApi'
import BLOG_API_URL from '../../api/blogApiUrl'
import formatUtils from '../../utils/formatUtils'

export default {
  name: 'o-blog-archive',
  components: { OPagination },
  created () {
    this.getArchiveList({
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
  },
  data () {
    return {
      archiveList: [],
      currentPage: 1,
      pageSize: 6,
      blogCount: '',
      monthCount: 0
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
      this.getArchiveList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })
    },
    getArchiveList (params = {}) {
      api.getObject(BLOG_API_URL.getArchiveList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.archiveList = data.data.list
          this.monthCount = data.data.monthCount
          this.blogCount = data.data.blogCount
          this.archiveList.forEach(item => {
            item.enMonth = formatUtils.numMonth2EnMonth(parseInt(item.month) - 1)
            item.color = formatUtils.numMonth2Color(parseInt(item.month) - 1)
          })
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleItemClick (id) {
      /**
       * 根据 id 点击跳转去博客详情页
       */
      this.$router.push(`/blog/${id}`)
    }
  }
}
</script>

<style lang="less">
.blog-archive-wrapper{
  .blog-archive-inner{
    .archive-header{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 1em;
      color: #333;
    }
    .archive-list{
      .archive-item{
        display: flex;
        padding: 20px 0;
        border-bottom: 1px solid #eee;

        &:first-child{
          padding-top: 0;
        }

        &:last-child{
          padding-bottom: 0;
          border-bottom: none;
        }

        .archive-date{
          width: 128px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          letter-spacing: 3px;
          margin-right: 4px;

          .archive-year-month{
            position: relative;
            padding-bottom: 14px;
            font-size: 24px;
            color: #333;

            &:after{
              position: absolute;
              bottom: 5px;
              right: 9px;
              width: 91px;
              border-bottom: 1px solid #d9dcd7;
              content: "";
            }
          }

          .archive-month{
            letter-spacing: 2px;
            font-size: 16px;
            margin-top: 10px;
            text-align: right;
            padding-right: 20px;
          }
        }

        .blog-list{
          position: relative;
          padding-left: 25px;
          display: flex;
          flex:1;
          flex-direction: column;
          justify-content: center;
          padding-right: 16px;
          border-right: 1px solid #ddd;
          border-left: 1px solid #d9dcd7;

          .blog-item{
            margin-top: 10px;
            cursor: pointer;

            &:hover{
              color: #32c1fb;
            }

            &:first-child{
              margin-top: 0;

              &:hover{
                color: #8c53ff;
              }
            }

            &:last-child{
              &:hover{
                color: #8c53ff;
              }
            }

          }
        }

        .type-count{
          display: flex;
          align-items: center;
          color: #333;
          font-size: 15px;
          font-weight: 600;
          max-width: 16px;
          padding-left: 24px;
          text-align: center;
          box-sizing: content-box;
        }
      }
    }
  }
}

@media screen and (max-width: 720px){
  .blog-archive-wrapper{
    padding: 0;
    .blog-archive-inner{
      .archive-list{
        .archive-item{
          flex-direction: column;
          align-items: flex-end;
          .archive-date{

            .archive-month{
              font-size: 15px;
            }
          }

          .blog-list{
            margin: 15px 0;
            width: 100%;
          }

          .type-count{
            max-width: 40px;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
