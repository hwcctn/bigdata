<template>
  <div class="logo">
    <div class="content-wrapper">
      <div class="left">
        <p class="img-caption">大数据</p>
      </div>
      <div class="right">
        <p>选课系统</p>
      </div>
    </div>
    <div class="meueMain">
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :router="true">
        <el-sub-menu index="1" v-if="isAdmin">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span style="font-size: 20px;">管理员端</span>
          </template>
          <el-menu-item index="/user"> <el-icon><User /></el-icon>人员管理</el-menu-item>
          <el-menu-item index="/course"> <el-icon><Edit /></el-icon>课程管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2" v-if="isStudent">
          <template #title>
            <el-icon><Stamp /></el-icon>
            <span style="font-size: 20px;">学生端</span>
          </template>
          <el-menu-item index="/choice"> <el-icon><User /></el-icon>选课</el-menu-item>
          <el-menu-item index="/basicInfo"> <el-icon><Edit /></el-icon>选课记录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 获取当前路由的菜单项，确保在路由变化时同步
const activeIndex = computed(() => {
  return route.meta.activeMenu || route.path;
});

// 判断用户身份

const identity = localStorage.getItem('identity');

const isAdmin = computed(() => identity === '管理员');
const isStudent = computed(() => identity === '学生');


</script>

<style scoped>
.logo {
  margin-top: 35px;
  margin-left: 25px;
}

.content-wrapper {
  display: flex;
  align-items: center;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.left img {
  width: 30px;
  height: 30px;
  height: auto;
  background-size: cover;
}

.img-caption {
  margin: 0;
  font-size: 14px;
  background: linear-gradient(to right, #7e76ed, #b9b5f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Lobster', cursive;
}

.right p {
  font-size: 15px;
  color: #4e4d4d;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
}

.meueMain {
  margin-top: 20px;
  height: 100%;
  width: 100%;
}

.el-menu-item {
  width: 250px;
  font-size: 18px;
  font-weight: 500;
}
</style>
