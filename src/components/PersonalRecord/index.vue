<template>
  <div class="personal-record-wrapper">
    <div class="personal-record-inner">
      <div class="record-header">{{total}} 条记录</div>
      <ul class="record-list">
        <li class="record-item" v-for="item in recordList" :key="item.id">

          <div class="item-date">
            <div class="date-day" :style="{background: item.color}" >{{item.day}}</div>
            <div class="date-month">{{item.month}}</div>
            <div class="date-year">{{item.year}}</div>
          </div>

          <div class="item-content">{{item.content}}</div>
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
import RECORD_API_URL from '../../api/recordApiUrl'
import formatUtils from '../../utils/formatUtils'

export default {
  name: 'o-personal-record',
  components: { OPagination },
  created () {
    this.getRecordList({
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
  },
  data () {
    return {
      recordList: [],
      currentPage: 1,
      pageSize: 6,
      total: 40
    }
  },
  methods: {
    handleCurrentChange (newPage) {
      this.currentPage = newPage
      this.getRecordList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })
    },
    getRecordList (params = {}) {
      /**
       * 获得个人记录
       */
      api.getObject(RECORD_API_URL.getRecordList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.recordList = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total

          /**
           * 获取一下年月日
           */
          this.recordList.forEach(item => {
            const date = new Date(item.gmtModified)
            item.day = date.getDate()
            item.month = formatUtils.numMonth2CnMonth(date.getMonth())
            item.year = date.getFullYear()
            item.color = formatUtils.numMonth2Color(date.getMonth())
          })
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
.personal-record-wrapper{
  .personal-record-inner{

    .record-header{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 1em;
      color: #333;
    }
    .record-list{
      .record-item{
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
        .item-date{
          margin-right: 15px;
          text-align: center;
          .date-day{
            width: 40px;
            height: 45px;
            line-height: 45px;
            background-color: #32c1fb;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }

          .date-month{
            height: 23px;
            line-height: 23px;
            background: #eee;
            border-top: 1px solid #e5e5e5;
            color: #999;
            font-size: 12px;
          }

          .date-year{
            height: 23px;
            line-height: 23px;
            background: #fff;
            border: 1px solid #eee;
            color: #ccc;
            font-size: 12px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }

        .item-content{
          display: flex;
          align-items: center;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
