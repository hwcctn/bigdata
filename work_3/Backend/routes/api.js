const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const courseController = require('../controllers/courseController');
const selectionController = require('../controllers/selectionController');
const Login=require('../controllers/auth')

// 学生相关接口
router.post('/students', studentController.addStudent);
router.get('/students/:StudentID', studentController.getStudent);
router.get('/students', studentController.getStudents);

// 课程相关接口
router.post('/courses', courseController.addCourse);
router.get('/courses/:CourseID', courseController.getCourse);
router.get('/courses', courseController.getAllCourses);
// 选课相关接口
router.post('/select', selectionController.selectCourse);
router.get('/selection/:StudentID', selectionController.getSelection);
// 登录
router.post('/login',Login.Login)
router.post('/logout',Login.Logout)
// 校验token
router.post('/verify',Login.authenticate)
module.exports = router;
