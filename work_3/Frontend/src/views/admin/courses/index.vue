<template>
    <div class="main-container">
        <div class="state" v-if="!$route.meta.hideList">
            <div
                style="background-color: #fff; height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; margin-top: 20px;">
                <div style="flex-grow: 1; display: flex; justify-content: left;">
                    <el-input v-model="input2" style="width: 240px;margin-right: 20px;" placeholder="课号"
                        :prefix-icon="Search" />
                    <el-button type="primary" @click="getCourse">搜索</el-button>
                </div>
                <el-button type="primary" @click="openAddCourseDialog">添加课程</el-button>
                <el-button type="primary" @click="getCourses">展示全部课程信息</el-button>
            </div>

            <div class="checkForm">
                <el-table :data="tableData" style="width: 1400px; margin: 0 auto; padding:50px 100px;">
                    <el-table-column prop="CourseID" label="课程ID" width="230px" />
                    <el-table-column prop="CName" label="课程名称" width="180px" />
                   
                    <el-table-column prop="Time" label="上课时间" width="180px" />
                    <el-table-column prop="Teacher" label="教师" width="150px" />

                    <el-table-column prop="Title" label="课程类型" width="230px" />
                    <el-table-column prop="Credit" label="学分" width="230px" />
                </el-table>

            </div>
        </div>

        <el-dialog title="添加课程" v-model="addCourseDialogVisible" width="500px">
            <!-- 使用 formRef 引用表单 -->
            <el-form :model="newCourse" ref="formRef" label-width="100px">
                <el-form-item label="课程名" prop="CName"
                    :rules="[{ required: true, message: '请输入课程名', trigger: 'blur' }]">
                    <el-input v-model="newCourse.CName" placeholder="请输入课程名"></el-input>
                </el-form-item>
                <el-form-item label="课程ID" prop="CourseID"
                    :rules="[{ required: true, message: '请输入课程ID', trigger: 'blur' }]">
                    <el-input v-model="newCourse.CourseID" placeholder="请输入课程ID"></el-input>
                </el-form-item>
                <el-form-item label="学分" prop="Credit" :rules="[{ required: true, message: '请输入学分', trigger: 'blur' }]">
                    <el-input v-model="newCourse.Credit" placeholder="请输入学分" type="number"></el-input>
                </el-form-item>
                <el-form-item label="上课时间" prop="Time"
                    :rules="[{ required: true, message: '请输入上课时间', trigger: 'blur' }]">
                    <el-input v-model="newCourse.Time" placeholder="请输入上课时间"></el-input>
                </el-form-item>
                <el-form-item label="教师" prop="Teacher"
                    :rules="[{ required: true, message: '请输入教师姓名', trigger: 'blur' }]">
                    <el-input v-model="newCourse.Teacher" placeholder="请输入教师姓名"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" prop="Title"
                    :rules="[{ required: true, message: '请输入课程类型', trigger: 'blur' }]">
                    <el-input v-model="newCourse.Title" placeholder="请输入课程类型"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCourse">取 消</el-button>
                <el-button type="primary" @click="submitAddCourse">确 定</el-button>
            </span>
        </el-dialog>
    </div>


</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import api from '../../../api';
let tableData = ref([])
let input2 = ref('')
const addCourseDialogVisible = ref(false)

// 用于存储新课程的数据
const newCourse = ref({
    CourseID: '',
    CName: '',
    Credit: '',
    Time: '',
    Teacher: '',
    Title: ''
})

const formRef = ref(null)
// 获取指定课程信息
const getCourse = () => {
    api.getCourse(input2.value).then((res) => {
        console.log(res.data)
        tableData.value = res.data.data
        console.log(tableData)
    })
}

// 获取所有课程信息
const getCourses = () => {
    api.getCourses().then((res) => {
        console.log(res.data)
        tableData.value = res.data.data
        console.log(tableData)
    })
}

// 打开添加课程信息的弹框
const openAddCourseDialog = () => {
    addCourseDialogVisible.value = true
}

// 提交添加课程信息
const submitAddCourse = () => {
    const form = formRef.value
    // 触发表单校验
    form.validate((valid) => {
        if (valid) {
            // 如果校验通过，提交数据
            api.postCourse(newCourse.value).then((res) => {
                console.log('课程添加成功', res.data)
                addCourseDialogVisible.value = false
                getCourses() // 刷新课程列表
            }).catch((err) => {
                console.error('添加课程失败', err)
            })
        } else {
            console.log('表单校验失败')
            return false
        }
    })
}
const cancelAddCourse = () => {
    addCourseDialogVisible.value = false
    formRef.value.resetFields() // 重置表单校验和数据
    newCourse.value = { // 可选：清空表单数据
        SName: '',
        CourseID: '',
        SGender: '',
        SAge: '',
        SDepartment: '',
        SMajor: ''
    }
}
onMounted(() => {
    getCourses()
})



</script>

<style scoped>
.main-container {
    height: 100%;
}


.checkForm {
    margin-top: 30px;
    text-align: center;
}
</style>