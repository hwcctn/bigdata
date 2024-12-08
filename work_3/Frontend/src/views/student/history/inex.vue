<template>
  <div class="main-container">
    <div class="state" v-if="!$route.meta.hideList">
      <div
        style="background-color: #fff; height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; margin-top: 20px;">
        <div style="flex-grow: 1; display: flex; justify-content: left;">
          我的选课记录
        </div>

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
            <template #default>

              <el-button 
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
import { ref, onMounted } from 'vue'
import api from '../../../api';
let tableData = ref([])
let selectedCourseIds = ref([]) 
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

const isCourseSelected=function(courseId){
if(selectedCourseIds.value.includes(courseId)){
  return true
}
return false
}
// 获取所有课程信息
const getCourses = () => {
  getSelectedCourses();
  api.getCourses().then((res) => {
    console.log(res.data)
    tableData.value = res.data.data.filter(course => selectedCourseIds.value.includes(course.CourseID))
    console.log(tableData)
  })
}

onMounted(() => {
  getCourses();

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