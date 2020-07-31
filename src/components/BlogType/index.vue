<template>
    <div class="blog-type-wrapper">
      <div class="blog-type-inner">
        <div class="type-header">{{total}} 个分类</div>
        <ul class="type-list clearfix">
          <li class="type-item" v-for="item in typeList" :key="item.id" @click="handleShowGroup(item.name)">
            <div class="item-inner">
              <div class="item-logo">
              <img :src="item.logo" alt="">
            </div>
              <div class="type-name">{{item.name}}</div>
              <div class="type-count">共 {{item.num}} 篇</div>
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
import TYPE_API_URL from '../../api/typeApiUrl'
import api from '../../api/baseApi'

export default {
  name: 'o-blog-type',
  components: { OPagination },
  created () {
    this.getTypeList({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      like: ''
    })
  },
  data () {
    return {
      typeList: [],
      currentPage: 1,
      pageSize: 6,
      total: 40
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
      this.getTypeList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: ''
      })
    },
    getTypeList (params = {}) {
      /**
       * 获得分类列表
       */
      api.getObject(TYPE_API_URL.getTypeList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.typeList = data.data.records
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
    handleShowGroup (id) {
      /**
       * 跳转去相应分类包含的博客列表页
       */
      this.$router.push(`/type/${id}`)
    }
  }
}
</script>

<style lang="less">
.blog-type-wrapper{
  .blog-type-inner{

    .type-header{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 1em;
      color: #333;
    }

    .type-list{
      .type-item{
        float: left;
        width: 50%;
        margin-bottom: 20px;
        padding: 0 15px;

        .item-inner{
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 10px;
          cursor: pointer;
          .item-logo{
            width: 100%;
            img{
              width: 100%;
            }
          }

          .type-name{
            font-size: 26px;
            margin: 15px 0 10px;
          }

          .type-count{
            text-align: center;
            padding-bottom: 15px;
          }

          &:hover{
            color: #32c1fb;
          }
        }

        &:nth-child(2n+1){
          /*margin-right: 25px;*/
        }

        &:last-child,
        &:nth-last-child(2){
          margin-bottom: 0;
        }

      }
    }
  }
}

@media screen and (max-width: 720px){
    .blog-type-wrapper{
      padding: 0;
      .blog-type-inner{
        .type-list{
          .type-item{
            width: 100%;
            margin-right: 0;
            margin-bottom: 20px;

            &:nth-last-child(2){
              margin-bottom: 20px;
            }
          }
        }
      }
    }
  }

</style>
