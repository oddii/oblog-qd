import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/components/BlogGroup/index'),
        meta: { keepAlive: true }
      },
      {
        path: '/blog/:id',
        name: 'BlogDetail',
        component: () => import('@/components/BlogDetail/index')
      },
      {
        path: '/type/:typeName',
        name: 'BlogTypeGroup',
        component: () => import('@/components/BlogGroup/index'),
        props: true,
        meta: { keepAlive: true }
      },
      {
        path: '/tag/:tagName',
        name: 'BlogTagGroup',
        component: () => import('@/components/BlogGroup/index'),
        props: true,
        meta: { keepAlive: true }
      },
      {
        path: '/flag/:flag',
        name: 'BlogFlagGroup',
        component: () => import('@/components/BlogGroup/index'),
        props: true,
        meta: { keepAlive: true }
      },
      {
        path: '/search/:searchValue',
        name: 'BlogSearchGroup',
        component: () => import('@/components/BlogGroup/index'),
        props: true,
        meta: { keepAlive: true }
      },
      {
        path: '/type',
        name: 'BlogType',
        component: () => import('@/components/BlogType/index')
      },
      {
        path: '/archive',
        name: 'BlogArchive',
        component: () => import('@/components/BlogArchive/index'),
        meta: { keepAlive: true }
      },
      {
        path: '/record',
        name: 'PersonalRecord',
        component: () => import('@/components/PersonalRecord/index')
      },
      {
        path: '/link',
        name: 'FriendLink',
        component: () => import('@/components/FriendLink/index')
      },
      {
        path: '/message',
        name: 'MessageBoard',
        component: () => import('@/components/MessageBoard/index')
      },
      {
        path: '/setting',
        name: 'BlogSetting',
        component: () => import('@/components/BlogSetting/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/layout/Login/index')
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savePosition) {
    /**
     * 保留回退的滚动条滚动距离
     */
    if (savePosition) return savePosition
    else return { x: 0, y: 0 }
  }
})

export default router
