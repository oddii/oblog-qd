const commonUtils = {
  /**
   * 设置 cookie
   * @param key 键
   * @param value 值
   * @param expire 持续时间，单位 /s
   */
  setCookie (key, value, expire) {
    const date = new Date()
    date.setTime(date.getTime() + (expire * 1000))
    const expireStr = `expires=${date.toUTCString()}`
    document.cookie = `${key}=${value};${expireStr}`
  },
  /**
   * 获得 cookie
   * @param key 键
   */
  getCookie (key) {
    const keyStr = `${key}=`
    const cookies = document.cookie.split(';')
    let value = ''
    cookies.forEach(item => {
      const cookie = item.trim()
      if (cookie.indexOf(keyStr) === 0) {
        value = cookie.substring(keyStr.length, cookie.length)
      }
    })
    return value
  }
}

export default commonUtils
