import apiMethods from '../utils/apiMethods'

/**
 * @author odd
 *  这里封装基础的增删改查方法
 */

const api = {
  /**
   * 获取列表
   * @param url
   * @param params
   * @returns {Promise<unknown>}
   */
  getObject (url, params = {}) {
    return apiMethods.sendRequest({
      url: url,
      method: 'get',
      params
    })
  },
  /**
   * 根据 id 获得对象
   * @param url
   * @param id
   * @returns {Promise<unknown>}
   */
  getObjectById (url, id) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'get'
    })
  },
  /**
   * 根据 wrapper 获得对象
   * @param url
   * @param wrapper
   * @param params
   * @returns {Promise | Promise<unknown>}
   */
  getObjectByWrapper (url, wrapper, params) {
    return apiMethods.sendRequest({
      url: url.replace(/wrapper/, wrapper),
      method: 'get',
      params
    })
  },
  /**
   * 新建对象
   * @param url
   * @param data
   * @returns {Promise<unknown>}
   */
  insertObject (url, data = {}) {
    return apiMethods.sendRequest({
      url,
      method: 'post',
      ctxType: 'formdata',
      data
    })
  },
  /**
   * 根据对象 id 更新对象
   * @param url
   * @param id
   * @param data
   * @returns {Promise<unknown>}
   */
  updateObjectById (url, id, data = {}) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'put',
      ctxType: 'formdata',
      data
    })
  },
  /**
   * 更新对象信息
   * @param url
   * @param data
   * @returns {Promise<unknown>}
   */
  updateObject (url, data = {}) {
    return apiMethods.sendRequest({
      url: url,
      method: 'put',
      ctxType: 'formdata',
      data
    })
  },
  /**
   * 根据对象 id 删除对象
   * @param url
   * @param id
   * @returns {Promise<unknown>}
   */
  deleteObjectById (url, id) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'delete'
    })
  }
}

export default api
