<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px"  class="Aside">
          <Menu/>
          </el-aside>
        <el-container class="right">
          <el-header class="Header">
        <Header/>
        </el-header>
          <el-main class="Main">
          <Content/>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>


<script setup>
import Header from './Header.vue';
import Menu from './Menu.vue';
import Content from './Content.vue';
</script>

<style  scoped>
.common-layout{
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
.Header{
  margin-top: 20px;
  background: linear-gradient(to bottom, #6e56c3, #857fe2);
  height: 80px;
  width: 100%;  
  display: flex; 
  align-items: center; 
  justify-content: center; 
}


.Aside{
   background-color:#fff;
   height:100vh ;
 
}
.Main{
 background-color:#f4f4f5; 
width: 100%;
padding: 0;
height:calc(100vh - 100px);
}
</style>
