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
const account = ref('');
const password = ref('');

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const account = ref('');
    const password = ref('');

    const login = () => {
      console.log(account.value, password.value);
      console.log(router);
      router.push('/home');
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