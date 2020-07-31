/**
 * 封装公共操作相关的 API_URL
 * @type {{getUploadToken: string}}
 */
const COMMON_API_URL = {
  getUploadToken: '/common/upload/token',
  uploadImage2AliyunOSS: '/common/upload/image',
  sendEmailCode: '/common/email/code'
}

export default COMMON_API_URL
