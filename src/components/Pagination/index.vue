<template>
  <div class="pagination-wrapper">
    <div class="pagination-inner">
      <div class="pages">
        <i class="el-icon-document"/>
        <span> Pages {{currentPage}} of {{pageCount}}</span>
      </div>
<!--      <router-link to="/index" class="page pre-link" v-if="currentPage > 1">«</router-link>-->
<!--      <span v-if="pageCount < 6 ">-->
<!--        <a href="#" :class="['page',page === currentPage ? 'current':'']" v-for="page in pageCount" :key="page">{{page}}</a>-->
<!--      </span>-->
<!--      <span v-else>-->
<!--        <a href="#" :class="['page',page === currentPage ? 'current':'']" v-for="page in 4" :key="page">{{page}}</a>-->
<!--        <span>...</span>-->
<!--        <a href="#" class="page">{{pageCount}}</a>-->
<!--      </span>-->
<!--      <router-link to="/index" class="page next-link" v-if="currentPage < pageCount">»</router-link>-->

      <nav>
        <ul class="pagination">
          <!--上一页-->
          <li @click="handlePreClick" v-if="currentPage > 1">
            <div class="page pre-link">«</div>
          </li>

          <li v-for="(page,index) in pageList" :key="index" @click="handleCurrentChange(page)">
            <div v-if="page" :class="['page',page === currentPage ? 'current':'']" >{{page}}</div>
            <span v-else>...</span>
          </li>

          <!--下一页-->
          <li @click="handleNextClick" v-if="currentPage < pageCount">
            <div class="page next-link">»</div>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'o-pagination',
  props: {
    currentPage: Number,
    pageSize: Number,
    total: Number,
    currentChange: Function
  },
  data () {
    return {}
  },
  methods: {
    handleCurrentChange (page) {
      /**
       * 切换页面的回调事件
       */
      if (this.currentPage === page) return
      this.currentChange && this.currentChange(page)
    },
    handlePreClick () {
      /**
       * 上一页点击事件
       */

      if (this.currentPage > 1) {
        let page = this.currentPage
        page--
        this.handleCurrentChange(page)
      }
    },
    handleNextClick () {
      /**
       * 下一页点击事件
       */
      if (this.currentPage < this.pageCount) {
        let page = this.currentPage
        page++
        this.handleCurrentChange(page)
      }
    }
  },
  computed: {
    pageCount () {
      return Math.ceil(this.total / this.pageSize) || 1
    },
    pageList () {
      const pageNum = this.pageCount
      const index = this.currentPage
      if (pageNum <= 5) return [...new Array(pageNum)].map((v, i) => i + 1)
      if (index <= 2) return [1, 2, 3, 0, pageNum]
      if (index >= pageNum - 1) return [1, 0, pageNum - 2, pageNum - 1, pageNum]
      if (index === 3) return [1, 2, 3, 4, 0, pageNum]
      if (index === pageNum - 2) return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
      return [1, 0, index - 1, index, index + 1, 0, pageNum]
    }
  }
}
</script>

<style lang="less">
.pagination-wrapper{
  margin: 30px 20px;
  .pagination-inner{
    font-weight: 600;
    line-height: 20px;
    text-align: center;
    font-size: 16px;

    .pages{
      font-weight: 400;
      color: #aaa;
      padding: 9px 14px;
      margin: 0 1px 10px;
      margin-bottom: 1em!important;
    }

    .pagination{
      display: flex;
      justify-content: center;
      span{
        line-height: 40px;
      }
      .page{
         background: #e5e5e5;
         border-radius: 20px;
         color: #333;
         padding: 9px 14px;
         display: inline-block;
         margin: 0 1px 10px;
         box-shadow: inset 0 1px 0 rgba(0,0,0,0.05);
        cursor: pointer;

         &:hover{
           background-color: #fff;
         }
       }

      .current{
        background-color: #fff;
      }
    }

  }
}
</style>
