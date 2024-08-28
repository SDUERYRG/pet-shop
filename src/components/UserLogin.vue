<template>
    <div class="container">
<div class="loginCard">
  <ElInput class=loginInput v-model="account" placeholder="请输入账号" />
  <ElInput class=loginInput type=password v-model="password" placeholder="请输入密码" />
  <ElButton class=loginButton type="primary" @click="login()">登录</ElButton>
</div>
</div>
</template>


<script lang="ts">
import { ref } from 'vue';
import { ElInput,ElButton } from 'element-plus';
import {useRouter} from 'vue-router';
import axios from 'axios';

export default {
name: 'UserLogin',
setup() {
  const router = useRouter();
  const account = ref('');
  const password = ref('');

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:4001/diary-server/login', {
        account: account.value,
        password: password.value
      });
      console.log('response:', response);
      if (response.data.status === true) {
        // 登录成功，处理返回的 token
        const token = response.data.message;
        console.log('登录成功，token:', token);
        // 你可以将 token 存储在本地存储或 Vuex 中
        localStorage.setItem('token', token);
        localStorage.setItem('userId', response.data.data.userId);
        console.log('userId:', response.data.data.userId);
        
        await router.push('/UserHome');
      } else {
        // 登录失败，处理错误信息
        console.error('登录失败:', response.data.message);
      }
    } catch (error) {
      console.error('请求错误:', error);
    }
  };
  

  return {
    account,
    password,
    login
  };
},
}
</script>

<style scoped>
.loginButton{
width: 100%;
}
.loginInput{
height: 50px;
padding-bottom: 10px;
}
</style>