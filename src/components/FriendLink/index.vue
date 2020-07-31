<template>
  <div class="friend-link-wrapper">
    <div class="friend-link-inner">
      <div class="link-header">{{total}} 条友链</div>
      <ul class="link-list">
        <li class="link-item" v-for="item in linkList" :key="item.id">
          <div class="item-logo">
            <img :src="item.logo" alt="">
          </div>

          <div class="item-content">
            <div class="item-title">{{item.description}}</div>
            <div class="item-link">
              <a href="https://element.eleme.cn/#/zh-CN/">{{item.url}}</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <o-pagination :current-page="currentPage" :page-size="pageSize"
                  :total="total" :current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import OPagination from '../Pagination/index'
import api from '../../api/baseApi'
import LINK_API_URL from '../../api/linkApiUrl'

export default {
  name: 'o-friend-link',
  components: { OPagination },
  created () {
    this.getLinkList({
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
  },
  data () {
    return {
      linkList: [],
      currentPage: 1,
      pageSize: 6,
      total: 40
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
      this.getLinkList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })
    },
    getLinkList (params = {}) {
      /**
       * 获得友链列表
       */
      api.getObject(LINK_API_URL.getLinkList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.linkList = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total
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
  .friend-link-wrapper {
    .friend-link-inner {

      .link-header{
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 1em;
        color: #333;
      }
      .link-list {
        .link-item {
          display: flex;
          padding: 20px 0;
          align-items: center;
          border-bottom: 1px solid #eee;

          &:first-child {
            padding-top: 0;
          }

          &:last-child {
            padding-bottom: 0;
            border-bottom: none;
          }

          .item-logo {
            display: flex;
            align-items: center;
            width: 90px;
            height: 90px;

            img {
              width: 100%;
              border-radius: 10px;
            }
          }

          .item-content {
            margin-left: 15px;

            .item-title {
              margin-bottom: 10px;
              color: #333;
              font-size: 18px;
            }

            .item-link {
              a {
                color: #aaa;

                &:hover {
                  color: #32c1fb;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
