<template>
  <div class="message-board-wrapper">
    <div class="message-board-inner">
      <o-comment :data="messageList" :total="total" type="留言"/>
    </div>
    <o-pagination :current-page="currentPage" :page-size="pageSize"
                  :total="total" :current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import OComment from '../Comment/index'
import OPagination from '../Pagination/index'
import api from '../../api/baseApi'
import MESSAGE_API_URL from '../../api/messageApiUrl'

export default {
  name: 'o-message-board',
  components: {
    OPagination,
    OComment
  },
  created () {
    this.getMessageList({
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })

    this.handleUpdateMessageList()
  },
  data () {
    return {
      messageList: [],
      currentPage: 1,
      pageSize: 6,
      total: 0
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
      this.getMessageList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })
    },
    getMessageList (params = {}) {
      /**
         * 获得留言列表
         */
      api.getObject(MESSAGE_API_URL.getMessageList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.messageList = data.data.records
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
    handleUpdateMessageList () {
      /**
       *  触发评论插入后的列表异步刷新事件
       */
      this.$bus.$on('getMessageList', () => {
        this.currentPage = 1
        this.getMessageList({
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
      })
    }
  }
}
</script>

<style lang="less">
  .message-board-wrapper {

  }

</style>
