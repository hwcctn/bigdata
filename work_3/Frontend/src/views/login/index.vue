<template>
    <div class="login">
        <div class="left">
            <div class="text">
                <h1>欢迎来到选课系统</h1>

                <hr style="width: 60%;" />

                <p>这是人工智能选课系统快来登录吧</p>
            </div>
        </div>
        <div class="right">
            <div class="center">
                <section style=" background-color: #00ff; width: 50%;height: 40%;
                    background-color: #00000060;
                    margin: auto;
                    margin-top: 10%;
                    text-align: center;
                    border-radius: 10px;
                    padding: 50px 50px;
                ">
                    <el-container>
                        <el-form :model="User" style="width: 100% ;height:100%; padding-left: 10%; padding-top: 10%;">

                            <el-form-item prop="account">
                                <el-input v-model="User.name" placeholder="请输入姓名" style="width: 80% ;padding: 0;"
                                    size="large"></el-input>
                            </el-form-item>


                            <el-form-item prop=" password">
                                <el-input type="password" v-model="User.id" style="width: 80%;padding: 0;"
                                    size="large" placeholder="请输入学号/工号"></el-input>
                            </el-form-item>


                            <span class="pwwd">
                                <a href="">忘记密码？</a>
                                <a href="">还没账号,注册一个</a>
                            </span>
                        </el-form>

                    </el-container>
                    <div slot="footer" class="dialog-footer" style="margin-top: 5%;">

                        <el-button type="primary" @click="login" style="margin-right: 40px;">登 录</el-button>
                        
                        <div style="margin-top:5% ; text-align: center;">
                            <span style="color:#bbb9b9; ">登录视为您已同意第三方账号绑定协议、服务条款、隐私政策</span>
                        </div>
                    </div>

                </section>
            </div>
        </div>

    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router';
import api from '../../api';
const router=useRouter();
let User = reactive({ name: '',  id: ''});
const login = async () => {
    api.postLogin({username:User.name,ID:User.id}).then((res)=>{
        if(res.data.code==='200'){
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('id', res.data.studentID);
            localStorage.setItem('identity', res.data.identity);
            router.push('/home');
        }
    })
  
};
</script>

<style scoped>
.login {
    width: 100vw;
    height: 100vh;
    background-image: url(https://img.zcool.cn/community/019cd15db6a804a8012163babc8b14.gif);
    background-repeat: no-repeat;
    background-size: cover;
}

.text {
    position: absolute;
    top: 40%;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}

.left {
    width: 50%;
    height: 100%;
    color: #fefafa;
    float: left;
    position: relative;
    display: flex;
    align-items: center
}

.right {
    width: 50%;
    height: 100%;
    position: relative;
    float: left;


}

.center {
    position: absolute;
    top: 10%;
    left: 0;
    right: 0;
    bottom: 0;
}
.el-input__wrapper {
  height: 40px;
  color: #bbb9b9;
}
</style>
