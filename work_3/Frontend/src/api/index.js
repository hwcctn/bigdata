// index.js
//网络请求方法放在这个文件
import path from "./path"
import axios from "axios"
const api={
    // 学生
    postUser(params){
        return axios.post(path.baseUrl+path.User,params)
    },
    getUser(userid){
        return axios.get(path.baseUrl+path.User+'/'+userid)
    },
    getUsers(){
        return axios.get(path.baseUrl+path.User)
    },
    // 选课
    addCourse(params){
        return axios.post(path.baseUrl+path.addCourse,params)
    },
    getHoistory(userid){
        return axios.get(path.baseUrl+path.getHoistory+'/'+userid)
    },
    // 课程
    postCourse(params){
        return axios.post(path.baseUrl+path.Course,params)
    },
    getCourse(courseid){
        return axios.get(path.baseUrl+path.Course+'/'+courseid)
    },
    getCourses(){
        return axios.get(path.baseUrl+path.Course)
    },
    // 登录
    postLogin(params){
        return axios.post(path.baseUrl+path.Login,params)
    },
    postLogout(params){
        return axios.post(path.baseUrl+path.Logout,params)
    },
    postVerify(params){
        return axios.post(path.baseUrl+path.Verify,params)
    },

    }

export default api
   
