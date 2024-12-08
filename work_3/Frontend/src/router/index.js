
import Login from '../views/login/index.vue'
import {createRouter,createWebHashHistory} from 'vue-router'
import api from '../api'
const routes=[
    {
        path:'/',
        name:"head",
        component:()=>import("../components/HelloWorld.vue")
    },
    {
        path:'/login',
        name:"login",
        component:Login
    },
 
    {
        path:'/home',
        component: () => import('../views/Layout/index.vue'),
        name: '首页',
        children:[
            {
                path: '/user', 
                component: () => import('../views/admin/user/index.vue'), 
                name: '人员管理',
              },
              {
                path: '/course', 
                component: () => import('../views/admin/courses/index.vue'), 
                name: '课程管理',
              },
              {
                path: '/choice', 
                component: () => import('../views/student/choiseCourses/index.vue'), 
                name: '选课',
              },
              {
                path: '/basicInfo', 
                component: () => import('../views/student/history/inex.vue'), 
                name: '选课记录',
              },
        ]
    }
]
const router=createRouter({
    history:createWebHashHistory(),
    routes
})

router.beforeEach(async (to,from,next)=>{
  const token=localStorage.getItem('token')
  if(to.path==='/login'){
    next()
  }
  else{
    if(token){
      try {
        // 发送请求校验 token 是否有效
        const response = await api.postVerify({ token:token })

        if (response.data) {
          next() // token 有效，放行
        } else {
          // token 无效，清除并跳转到登录页面
          localStorage.removeItem('token')
          next('/login')
        }
      } catch (err) {
        console.error('Token 校验失败:', err)
        localStorage.removeItem('token')
        next('/login') // 请求失败时也跳转到登录页
      }
    } else {
      // 没有 token，直接跳转到登录页面
      next('/login')
    }
    
    
  }
})
export default router
