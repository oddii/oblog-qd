const formatUtils = {
  gmt2YYYYmmdd (gmt) {
    const date = new Date(gmt)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().length < 2
      ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${(date.getDate()).toString().length < 2
      ? '0' + (date.getDate()) : (date.getDate())}`
  },
  numMonth2Color (month) {
    /**
     * 数字月份转为颜色
     */
    const colorList = ['#f4555a', '#f9895b', '#fdc570', '#abd372',
      '#47b97b', '#50bdb8', '#5cbcea', '#4d99cd',
      '#9474b7', '#b8578d', '#d872b4', '#f440ab']
    return colorList[month]
  },
  numMonth2CnMonth (month) {
    /**
     * 数字月份变为中文月份
     */
    const cnMonthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']
    return cnMonthList[month]
  },
  numMonth2EnMonth (month) {
    /**
     * 数字月份转为英文月份
     */
    const enMonthList = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    return enMonthList[month]
  }
}

export default formatUtils
