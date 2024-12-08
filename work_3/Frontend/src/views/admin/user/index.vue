<template>
    <div class="main-container">
        <div class="state" v-if="!$route.meta.hideList">
           
            <div
                style="background-color: #fff; height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; margin-top: 20px;">
                <div style="flex-grow: 1; display: flex; justify-content: left;">
                    <el-input v-model="input2" style="width: 240px;margin-right: 20px;" placeholder="学号"
                        :prefix-icon="Search" />
                    <el-button type="primary" @click="getStudent">搜索</el-button>
                </div>
                <el-button type="primary" @click="openAddStudentDialog">添加学生</el-button>
                <el-button type="primary" @click="getStudents">展示全部学生信息</el-button>
            </div>
            <div class="checkForm">
                <el-table :data="tableData" style="width: 1400px ;margin: 0 auto; padding:50px 100px;">
                    <el-table-column prop="SInfo.SName" label="姓名" width="188px" />
                    <el-table-column prop="SInfo.StudentID" label="学号" width="188px" />
                    <el-table-column prop="SInfo.SGender" label="性别" width="100px" />
                    <el-table-column prop="SInfo.SAge" label="年龄" width="102px" />
                    <el-table-column prop="Studies.SDepartment" label="学院" width="310px" />
                    <el-table-column prop="Studies.SMajor" label="专业" width="310px" />
                </el-table>
            </div>
        </div>

        <el-dialog title="添加学生" v-model="addStudentDialogVisible" width="500px">
            <!-- 使用 formRef 引用表单 -->
            <el-form :model="newStudent" ref="formRef" label-width="100px">
                <el-form-item label="姓名" prop="SName" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
                    <el-input v-model="newStudent.SName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="学号" prop="StudentID"
                    :rules="[{ required: true, message: '请输入学号', trigger: 'blur' }]">
                    <el-input v-model="newStudent.StudentID" placeholder="请输入学号"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="SGender"
                    :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]">
                    <el-select v-model="newStudent.SGender" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="SAge" :rules="[{ required: true, message: '请输入年龄', trigger: 'blur' }]">
                    <el-input v-model="newStudent.SAge" placeholder="请输入年龄" type="number"></el-input>
                </el-form-item>
                <el-form-item label="学院" prop="SDepartment"
                    :rules="[{ required: true, message: '请输入学院', trigger: 'blur' }]">
                    <el-input v-model="newStudent.SDepartment" placeholder="请输入学院"></el-input>
                </el-form-item>
                <el-form-item label="专业" prop="SMajor" :rules="[{ required: true, message: '请输入专业', trigger: 'blur' }]">
                    <el-input v-model="newStudent.SMajor" placeholder="请输入专业"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddStudent">取 消</el-button>
                <el-button type="primary" @click="submitAddStudent">确 定</el-button>
            </span>
        </el-dialog>

       
    </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import api from '../../../api'
let tableData = ref([])
let input2 = ref('')
let addStudentDialogVisible = ref(false) // 控制弹框的显示与隐藏

// 用于存储新添加的学生信息
let newStudent = ref({
    SName: '',
    StudentID: '',
    SGender: '',
    SAge: '',
    SDepartment: '',
    SMajor: ''
})

// 定义 formRef 引用
const formRef = ref(null)

// 获取指定学生信息
const getStudent = () => {
    api.getUser(input2.value).then((res) => {
        console.log(res.data)
        tableData.value = res.data.data
        console.log(tableData)
    })
}

// 获取所有学生信息
const getStudents = () => {
    api.getUsers().then((res) => {
        console.log(res.data)
        tableData.value = res.data.data
        console.log(tableData)
    })
}

// 打开添加学生信息的弹框
const openAddStudentDialog = () => {
    addStudentDialogVisible.value = true
}

// 提交添加学生信息
const submitAddStudent = () => {
    const form = formRef.value
    // 触发表单校验
    form.validate((valid) => {
        if (valid) {
            // 如果校验通过，提交数据
            api.postUser(newStudent.value).then((res) => {
                console.log('学生添加成功', res.data)
                addStudentDialogVisible.value = false
                getStudents() // 刷新学生列表
            }).catch((err) => {
                console.error('添加学生失败', err)
            })
        } else {
            console.log('表单校验失败')
            return false
        }
    })
}
const cancelAddStudent = () => {
    addStudentDialogVisible.value = false
    formRef.value.resetFields() // 重置表单校验和数据
    newStudent.value = { // 可选：清空表单数据
        SName: '',
        StudentID: '',
        SGender: '',
        SAge: '',
        SDepartment: '',
        SMajor: ''
    }
}
onMounted(() => {
    getStudents()
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