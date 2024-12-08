<template>
  <div class="main-container">
    <div class="state" v-if="!$route.meta.hideList">
      <div
        style="background-color: #fff; height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; margin-top: 20px;">
        <div style="flex-grow: 1; display: flex; justify-content: left;">
          <el-input v-model="input2" style="width: 240px;margin-right: 20px;" placeholder="课号" :prefix-icon="Search" />
          <el-button type="primary" @click="getCourse">搜索</el-button>
        </div>

        <el-button type="primary" @click="getCourses">展示全部课程信息</el-button>
      </div>

      <div class="checkForm">
        <el-table :data="tableData" style="width: 1500px; margin: 0 auto; padding:50px 100px;">
          <el-table-column prop="CourseID" label="课程ID" width="230px" />
          <el-table-column prop="CName" label="课程名称" width="180px" />

          <el-table-column prop="Time" label="上课时间" width="180px" />
          <el-table-column prop="Teacher" label="教师" width="150px" />

          <el-table-column prop="Title" label="课程类型" width="230px" />
          <el-table-column prop="Credit" label="学分" width="230px" />
          <el-table-column fixed="right" label="状态" width="100">
            <template #default="{row}">
              <el-button 
                v-if="!isCourseSelected(row.CourseID)" 
                link type="primary" size="small" 
                @click="addCourse(row.CourseID)">
                选课
              </el-button>
              <el-button 
                v-else 
                link type="text" size="small" 
                disabled>
                已选
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

  </div>


</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import api from '../../../api';
let tableData = ref([])
let input2 = ref('')
let selectedCourseIds = ref([])  // 存储已选课程的 ID
const StudentID=localStorage.getItem('id');
// 获取已选课程 ID
const getSelectedCourses = () => {
  api.getHoistory(StudentID).then((res) => {
    // 假设接口返回的是已选课程 ID 的数组
    selectedCourseIds.value = res.data.data.map(course => course.CourseID)
  }).catch(err => {
    console.error('获取已选课程失败', err)
  })
}
// 获取指定课程信息
const getCourse = () => {
  api.getCourse(input2.value).then((res) => {
    console.log(res.data)
    tableData.value = res.data.data
    console.log(tableData)
  })
}
const isCourseSelected=computed(()=>{
  return (courseId) => {
    return selectedCourseIds.value.includes(courseId)
  }
}) 
// 获取所有课程信息
const getCourses = () => {
  api.getCourses().then((res) => {
    console.log(res.data)
    tableData.value = res.data.data
    console.log(tableData)
  })
}

// 选课
const addCourse=(courseId)=>{
  
  api.addCourse({
    StudentID:StudentID,
    CourseID:courseId,
    Score: "null"
  }).then((res=>{
    if(res.data!==null){
      selectedCourseIds.value.push(courseId)
      alert("选课成功")
    }
    
  }))
}
onMounted(() => {
  getCourses();
  getSelectedCourses();
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