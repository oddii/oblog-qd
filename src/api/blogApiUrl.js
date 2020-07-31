/**
 * 封装 blog 相关的 API_URL
 * @type {{getBlogList: string, deleteBlogById: string, insertBlog: string, getBlogById: string, updateBlogById: string}}
 */
const BLOG_API_URL = {
  getBlogList: '/blog/list/',
  getBlogById: '/blog/id',
  insertBlog: '/blog/insert',
  updateBlogById: '/blog/id',
  updateBlogTagById: '/blog/updateTag/id',
  updateBlogViewsAndLikesById: '/blog/views&likes/id',
  updateBlogSharesById: '/blog/shares/',
  getBlogIsLikedByIp: '/blog/isLike',
  deleteBlogById: '/blog/id',
  getViewsAndLikesAndNum: '/blog/views&likes&num',
  getTop5BlogList: '/blog/top5',
  getBlogByWrapper: '/blog/list/wrapper', //  根据条件获得博客列表
  getArchiveList: '/blog/archive' //  获得博客归档列表
}

export default BLOG_API_URL
